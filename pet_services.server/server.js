const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const connection = mysql.createConnection({
  host: 'servicedb1.ctwou4wu0avu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Applebottomjeans12',
  database: 'servicePetDB'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database.');
});

// Configure session middleware
app.use(session({
  secret: 'secret-key', // Replace with a strong secret
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/');
  }
}

// Serve static files from public directory
app.use(express.static('public'));

// Handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.userId = results[0].userID; // Store user ID in session
      res.redirect('/dashboard.html');
    } else {
      res.send('Invalid credentials');
    }
  });
});

// Protect dashboard route
app.get('/dashboard.html', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Protect appointments route
app.get('/appointments.html', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'appointments.html'));
});

// Serve user settings page with pre-populated data
app.get('/settings.html', checkAuthenticated, (req, res) => {
  const query = 'SELECT name, email, phone, address FROM users WHERE userID = ?';
  connection.query(query, [req.session.userId], (err, results) => {
    if (err) throw err;
    const user = results[0];
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Settings</title>
        <link rel="stylesheet" href="dashboard.css">
      </head>
      <body>
        <div class="top-bar">
          <div class="logo">ServicePet</div>
          <div class="user-menu">
            <div class="user-icon">👤</div>
            <div class="dropdown">
              <button class="dropbtn">☰</button>
              <div class="dropdown-content">
                <a href="settings.html">User Settings</a>
                <a href="/logout">Sign Out</a>
              </div>
            </div>
          </div>
        </div>
        <div class="nav-bar">
          <a href="dashboard.html" class="nav-link">Dashboard</a>
          <a href="appointments.html" class="nav-link">Create Appointment</a>
        </div>
        <div class="content">
          <h2>User Settings</h2>
          <form action="/update-user" method="POST">
            <label for="name">First Name:</label>
            <input type="text" id="name" name="name" required value="${user.name}">
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required value="${user.email}">

            <label for="phone">Phone:</label>
            <input type="text" id="phone" name="phone" required value="${user.phone}">

            <label for="address">Address:</label>
            <input type="text" id="address" name="address" required value="${user.address}">

            <label for="current-password">Current Password:</label>
            <input type="password" id="current-password" name="current-password" required>

            <label for="new-password">New Password:</label>
            <input type="password" id="new-password" name="new-password">

            <label for="confirm-password">Confirm New Password:</label>
            <input type="password" id="confirm-password" name="confirm-password">

            <button type="submit">Save</button>
          </form>
        </div>
      </body>
      </html>
    `);
  });
});

// Handle user update
app.post('/update-user', checkAuthenticated, (req, res) => {
  const { name, email, phone, address, 'current-password': currentPassword, 'new-password': newPassword, 'confirm-password': confirmPassword } = req.body;

  const userId = req.session.userId; // Get the user ID from the session

  // Check if new password matches confirm password
  if (newPassword && newPassword !== confirmPassword) {
    return res.send('New passwords do not match.');
  }

  // Check if the current password is correct
  const checkPasswordQuery = 'SELECT password FROM users WHERE userID = ?';
  connection.query(checkPasswordQuery, [userId], (err, results) => {
    if (err) throw err;

    const user = results[0];
    if (user.password !== currentPassword) {
      return res.send('Current password is incorrect.');
    }

    // Update user information in the database
    const updateQuery = 'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, password = ? WHERE userID = ?';
    const updatedPassword = newPassword || user.password; // Use new password if provided, otherwise keep current password

    connection.query(updateQuery, [name, email, phone, address, updatedPassword, userId], (err, results) => {
      if (err) throw err;
      res.send('User information updated successfully.');
    });
  });
});

// Handle sign out
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
