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
  const query = 'INSERT INTO users (name, email, password, ssn, address) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, email, password, ssn, address], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).send('Registration failed');
    } else {
      res.status(200).send('Registration successful');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});