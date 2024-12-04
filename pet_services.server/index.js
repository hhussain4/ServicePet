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
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
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

app.post('/api/user/appointments', (req, res) => {
  const { petIDs } = req.body; // Get pet IDs from the request body

  if (!petIDs || petIDs.length === 0) {
    return res.status(400).json({ message: 'No pet IDs provided' });
  }

  console.log('Fetching appointments for petIDs:', petIDs); // Debug log

  const appointmentQuery = `
    SELECT 
      a.appointmentID, 
      a.petID, 
      p.name AS petName, 
      d.name AS doctorName, 
      h.hospitalName AS hospitalName, 
      a.date, 
      a.time, 
      a.address
    FROM appointments a
    JOIN pets p ON a.petID = p.petID
    JOIN doctors d ON a.doctorID = d.doctorID
    JOIN hospitals h ON a.hospitalID = h.hospitalID
    WHERE a.petID IN (?)
    ORDER BY a.date ASC, a.time ASC
  `;

  connection.query(appointmentQuery, [petIDs], (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      return res.status(500).json({ message: 'Failed to fetch appointments' });
    }

    console.log('Appointments fetched:', results); // Debug log
    res.status(200).json(results);
  });
});

// Update user data endpoint
app.post('/api/update-user', fetchUserSession, async (req, res) => {
  const userId = req.userId; // Retrieved from session middleware
  const { name, email, address, currentPassword, newPassword } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({ message: 'Name, email, and address are required.' });
  }

  try {
    // Fetch the user's current password from the database
    const query = 'SELECT password FROM users WHERE userID = ?';
    const [user] = await new Promise((resolve, reject) => {
      connection.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If the user wants to update the password
    let passwordToUpdate = user.password; // Keep the current password if not changing
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to update the password.' });
      }

      // Verify the current password matches
      if (currentPassword !== user.password) {
        return res.status(403).json({ message: 'Current password is incorrect.' });
      }

      // Update the password
      passwordToUpdate = newPassword;
    }

    // Update the user in the database
    const updateQuery = `
      UPDATE users 
      SET name = ?, email = ?, address = ?, password = ?
      WHERE userID = ?
    `;

    await new Promise((resolve, reject) => {
      connection.query(updateQuery, [name, email, address, passwordToUpdate, userId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.status(200).json({ message: 'User data updated successfully.' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Failed to update user data.' });
  }
});

app.post('/api/logout', fetchUserSession, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Failed to log out.' });
    }
    res.clearCookie('connect.sid'); // Clears the session cookie
    res.status(200).json({ message: 'Logged out successfully.' });
  });
});
app.delete('/api/pets/:petID', (req, res) => {
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

    const { petID } = req.params;

    const deleteAppointmentsQuery = 'DELETE FROM appointments WHERE petID = ?';
    const deletePetQuery = 'DELETE FROM pets WHERE petID = ? AND userID = ?';

    // First, delete related appointments, then delete the pet
    connection.query(deleteAppointmentsQuery, [petID], (err) => {
      if (err) {
        console.error('Error deleting appointments:', err);
        return res.status(500).json({ message: 'Failed to delete related appointments' });
      }

      connection.query(deletePetQuery, [petID, session.userId], (err, result) => {
        if (err) {
          console.error('Error deleting pet:', err);
          return res.status(500).json({ message: 'Failed to delete pet' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Pet not found or not owned by the user' });
        }

        res.status(200).json({ message: 'Pet deleted successfully' });
      });
    });
  });
});

app.delete('/api/appointments/:appointmentID', fetchUserSession, (req, res) => {
  const { appointmentID } = req.params;

  const deleteQuery = 'DELETE FROM appointments WHERE appointmentID = ? AND EXISTS (SELECT 1 FROM pets WHERE petID = appointments.petID AND userID = ?)';
  
  connection.query(deleteQuery, [appointmentID, req.userId], (err, result) => {
    if (err) {
      console.error('Error deleting appointment:', err);
      return res.status(500).json({ message: 'Failed to delete appointment' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
