// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('../db'); // Using the updated db.js connection

const router = express.Router();


// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user from the database
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare hashed password with the input password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// User registration route
router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Email, password, and full name are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await client.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hashedPassword, fullName, 'admin'] // default role is 'admin'
    );

    // Return success response
    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
    });

  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

module.exports = router;
