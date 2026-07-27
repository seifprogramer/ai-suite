const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('../db/supabase');

const router = express.Router();

// Login - Creates user if doesn't exist (no password verification)
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('🔍 Login attempt for:', email);

    // Find user
    let { data: users, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (selectError) {
      console.error('❌ Login - Query error:', selectError);
      throw selectError;
    }

    let user;

    // If user doesn't exist, create them
    if (!users || users.length === 0) {
      console.log('📝 Creating new user:', email);
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            username: email.split('@')[0], // Use email prefix as username
            email: email,
            password: 'no-password' // Placeholder
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Failed to create user:', insertError);
        throw insertError;
      }

      user = newUser;
      console.log('✅ New user created:', email);
    } else {
      user = users[0];
      console.log('✅ Existing user found:', email);
    }

    // Generate JWT token
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
