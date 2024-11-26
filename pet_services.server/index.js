const express = require('express');
const mysql = require('mysql2'); // Use mysql2
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser'); 
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const port = 3000;

// Database connection
const sessionStore = new MySQLStore({
  host: 'servicedb1.ctwou4wu0avu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Applebottomjeans12',
  database: 'servicePetDB',
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001', // Your frontend's URL
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add Authorization if needed
}));


// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false, // For HTTPS: set to true
    sameSite: 'none', // Required for cross-origin requests
    httpOnly: true, // Ensures cookie is not accessible via JavaScript
  },
}));


// Database connection
const connection = mysql.createConnection({
  host: 'servicedb1.ctwou4wu0avu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Applebottomjeans12',
  database: 'servicePetDB',
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

// Registration endpoint
app.post('/register', (req, res) => {
  const { name, email, password, ssn, address } = req.body;
  const checkQuery = 'SELECT * FROM users WHERE ssn = ?';
  connection.query(checkQuery, [ssn], (err, results) => {
    if (err) {
      console.error('Error checking SSN:', err);
      res.status(500).json({ message: 'Registration failed' });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ message: 'SSN already exists' });
      return;
    }
    const insertQuery = 'INSERT INTO users (name, email, password, ssn, address) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertQuery, [name, email, password, ssn, address], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ message: 'Registration failed' });
      } else {
        res.status(200).json({ message: 'Registration successful' });
      }
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying user:', err);
      return res.status(500).json({ message: 'Login failed' });
    }

    if (results.length > 0) {
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error('Error regenerating session:', regenerateErr);
          return res.status(500).json({ message: 'Login failed' });
        }

        req.session.userId = results[0].userID; // Dynamically set userId from the database
        console.log('Setting userId in session:', req.session.userId); // Debug

        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Error saving session:', saveErr);
            return res.status(500).json({ message: 'Login failed' });
          }

          console.log('Session saved:', req.session);
          res.status(200).json({ message: 'Login successful', sessionId: req.session.id });
        });
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});






// User data endpoint
app.get('/api/user', (req, res) => {
  console.log('Cookies received:', req.cookies); // Logs cookies
  console.log('Session ID:', req.sessionID); // Logs the session ID
  console.log('Session data:', req.session); // Logs session details

  if (!req.session || !req.session.userId) {
    console.log('No session or userId found. Returning 401.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.session.userId;
  console.log('Authenticated userId:', userId);

  const query = 'SELECT * FROM users WHERE userID = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return res.status(500).json({ message: 'Failed to fetch user data' });
    }
    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
