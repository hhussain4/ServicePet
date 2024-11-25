const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3001', // Replace with your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Handle preflight requests
app.options('*', cors());

// Database connection
const connection = mysql.createConnection({
  host: 'servicedb1.ctwou4wu0avu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Applebottomjeans12',
  database: 'servicePetDB'
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

  // Check if SSN already exists
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

    // Insert new user
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
      res.status(500).json({ message: 'Login failed' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});