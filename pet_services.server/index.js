const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const port = 5000;

// Database connection
const sessionStore = new MySQLStore({
  host: 'servicedb1.ctwou4wu0avu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Applebottomjeans12',
  database: 'servicePetDB',
});

const connection = mysql.createConnection({
  host: 'servicedb1.ctwou4wu0avu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Applebottomjeans12',
  database: 'servicePetDB',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Frontend's URL
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false, // For HTTPS: set to true in production
    sameSite: 'none',
    httpOnly: true,
  },
}));

// Middleware to fetch user session and validate authorization
const fetchUserSession = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sessionToken = authHeader.split(' ')[1];
  sessionStore.get(sessionToken, (err, session) => {
    if (err || !session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.userId = session.userId;
    next();
  });
};

// Routes
app.post('/register', (req, res) => {
  const { name, email, password, ssn, address } = req.body;
  const checkQuery = 'SELECT * FROM users WHERE ssn = ?';
  connection.query(checkQuery, [ssn], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Registration failed' });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ message: 'SSN already exists' });
      return;
    }
    const insertQuery = 'INSERT INTO users (name, email, password, ssn, address) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertQuery, [name, email, password, ssn, address], (err) => {
      if (err) {
        res.status(500).json({ message: 'Registration failed' });
      } else {
        res.status(200).json({ message: 'Registration successful' });
      }
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Login failed' });
    }
    if (results.length > 0) {
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ message: 'Login failed' });
        }
        req.session.userId = results[0].userID;
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ message: 'Login failed' });
          }
          res.status(200).json({ message: 'Login successful', sessionToken: req.session.id });
        });
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

// User data endpoint
app.get('/api/user', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No Authorization header. Returning 401.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sessionToken = authHeader.split(' ')[1];

  sessionStore.get(sessionToken, (err, session) => {
    if (err || !session) {
      console.log('Invalid session token. Returning 401.');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!session.userId) {
      console.log('No userId in session. Returning 401.');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = 'SELECT * FROM users WHERE userID = ?';
    connection.query(query, [session.userId], (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ message: 'Failed to fetch user data' });
      }

      if (results.length > 0) {
        console.log('User data fetched from database:', results[0]); // Log this
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
  });
});

// Add pet endpoint
app.post('/api/pets', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No Authorization header. Returning 401.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sessionToken = authHeader.split(' ')[1];

  sessionStore.get(sessionToken, (err, session) => {
    if (err || !session) {
      console.log('Invalid session token. Returning 401.');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!session.userId) {
      console.log('No userId in session. Returning 401.');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { breed, name, birthDate } = req.body;

    if (!breed || !name || !birthDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO pets (userID, breed, name, birthDate) VALUES (?, ?, ?, ?)';
    connection.query(query, [session.userId, breed, name, birthDate], (err, result) => {
      if (err) {
        console.error('Error adding pet:', err);
        return res.status(500).json({ message: 'Failed to add pet' });
      }

      res.status(201).json({ message: 'Pet added successfully', petID: result.insertId });
    });
  });
});

// Get pets endpoint
app.get('/api/pets', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No Authorization header. Returning 401.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sessionToken = authHeader.split(' ')[1];

  sessionStore.get(sessionToken, (err, session) => {
    if (err || !session) {
      console.log('Invalid session token. Returning 401.');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!session.userId) {
      console.log('No userId in session. Returning 401.');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = 'SELECT * FROM pets WHERE userID = ?';
    connection.query(query, [session.userId], (err, results) => {
      if (err) {
        console.error('Error fetching pets:', err);
        return res.status(500).json({ message: 'Failed to fetch pets' });
      }

      res.status(200).json(results);
    });
  });
});
// Appointment-related routes
app.get('/api/appointments/pets', fetchUserSession, (req, res) => {
  const query = 'SELECT * FROM pets WHERE userID = ?';
  connection.query(query, [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch pets' });
    }
    res.status(200).json(results);
  });
});

app.get('/api/appointments/doctors', (req, res) => {
  const query = 'SELECT * FROM doctors';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch doctors' });
    }
    res.status(200).json(results);
  });
});

app.get('/api/appointments/hospitals', (req, res) => {
  const query = 'SELECT hospitalID, hospitalName AS name, address AS location FROM hospitals';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching hospitals:', err);
      return res.status(500).json({ message: 'Failed to fetch hospitals' });
    }
    res.status(200).json(results);
  });
});


app.post('/api/appointments/create', fetchUserSession, (req, res) => {
  const { petID, doctorName, hospitalName, date, time, address } = req.body;

  if (!petID || !doctorName || !hospitalName || !date || !time || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const findIDsQuery = `
    SELECT 
      (SELECT doctorID FROM doctors WHERE name = ?) AS doctorID,
      (SELECT hospitalID FROM hospitals WHERE hospitalName = ?) AS hospitalID
  `;

  connection.query(findIDsQuery, [doctorName, hospitalName], (err, results) => {
    if (err || !results[0].doctorID || !results[0].hospitalID) {
      return res.status(500).json({ message: 'Failed to fetch IDs for doctor or hospital' });
    }

    const { doctorID, hospitalID } = results[0];

    const insertQuery = `
      INSERT INTO appointments (petID, doctorID, hospitalID, date, time, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    connection.query(insertQuery, [petID, doctorID, hospitalID, date, time, address], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to create appointment' });
      }
      res.status(201).json({ message: 'Appointment created successfully', appointmentID: result.insertId });
    });
  });
});

app.post('/api/validate-insurance', (req, res) => {
  const { insuranceType, policyId } = req.body;

  const query = `
    SELECT * 
    FROM insurance i
    JOIN owner_insurance oi ON i.policyID = oi.policyID
    WHERE i.companyName = ? AND oi.policyID = ?
  `;

  connection.query(query, [insuranceType, policyId], (err, results) => {
    if (err) {
      console.error('Error validating insurance:', err);
      return res.status(500).json({ message: 'Failed to validate insurance' });
    }

    if (results.length === 0) {
      return res.status(400).json({ isValid: false });
    }

    res.status(200).json({ isValid: true });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
