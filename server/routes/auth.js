const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../db/supabase');

const router = express.Router();

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
