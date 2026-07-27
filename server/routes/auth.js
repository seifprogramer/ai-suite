const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../db/supabase');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const { data: existingUser, error: existError } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`);

    if (existError) {
      console.error('❌ Register - Check user error:', existError);
      throw existError;
    }

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password: hashedPassword
        }
      ])
      .select();

    if (error) {
      console.error('❌ Register - Insert error:', error);
      throw error;
    }

    const user = data[0];
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log('✅ User registered:', email);
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login attempt for:', email);

    // Find user
    const { data: users, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (selectError) {
      console.error('❌ Login - Query error:', selectError);
      throw selectError;
    }

    if (!users || users.length === 0) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ error: 'User not found' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log('✅ User logged in:', email);
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
