const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
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

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    res.send({ message: 'Login successful', userId: user.userID });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});