const { User, Subscription } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendActivationEmail } = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    if (!email || !firstName || !lastName || !password)
      return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(409).json({ error: 'Email deja folosit.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      // discordUsername va rămâne null la register
      isVerified: false,
      activationToken
    });

    // Trimite email de verificare
    try {
      await sendActivationEmail(user.email, activationToken);
      console.log('Activation email sent to:', user.email);
    } catch (emailError) {
      console.error('Error sending activation email:', emailError);
      // Continuă procesul chiar dacă email-ul nu a fost trimis
    }
    
    res.status(201).json({
      message: 'Cont creat cu succes! Verifică email-ul pentru activare.',
      success: true
    });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la înregistrare', details: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email și parola sunt obligatorii.' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Email sau parolă greșită.' });

    if (!user.isVerified) {
      return res.status(403).json({ 
      message: 'Te rugăm să îți verifici email-ul înainte de a te loga' 
    });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email sau parolă greșită.' });

    // Generează JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );

    // Pune JWT în cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000
    });

    const { password: _, ...userData } = user.toJSON();
    res.json({ message: 'Login reușit', user: userData });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la autentificare', details: err.message });
  }
};

exports.activate = async (req, res) => {
  try {
    console.log('Cerere de activare primită cu token:', req.query.token, 'la', new Date());

    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ 
        error: 'Token lipsește',
        type: 'missing_token'
      });
    }
    
    const user = await User.findOne({ 
      where: { activationToken: token } 
    });
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Token invalid.',
        type: 'invalid_token'
      });
    }

    if (user.isVerified) {
      // Cont deja activat
      return res.json({ 
        message: 'Contul este deja activat! Te poți loga.',
        success: true,
        type: 'already_activated'
      });
    }

    // Activează contul (dar PĂSTREAZĂ token-ul pentru viitor)
    user.isVerified = true;
    user.isActive = true;
    // NU șterge token-ul: user.activationToken = null;
    await user.save();

    res.json({ 
      message: 'Cont activat cu succes! Poți să te loghezi.',
      success: true,
      type: 'activated'
    });
    
  } catch (err) {
    console.error('Eroare la activare:', err);
    res.status(500).json({ 
      error: 'Eroare la activare', 
      details: err.message,
      type: 'server_error'
    });
  }
};


exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Nu ești autentificat.' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Token invalid sau expirat.' });
    }

    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(404).json({ error: 'Utilizator inexistent.' });
    }

    // Nu trimite parola către frontend
    const { password, activationToken, ...userData } = user.toJSON();

    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la autentificare', details: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout cu succes!' });
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User inexistent' });

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: 'Completează toate câmpurile.' });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Parola veche este greșită.' });

    if (newPassword.length < 6)
      return res.status(400).json({ error: 'Parola nouă trebuie să aibă minim 6 caractere.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Parola a fost schimbată cu succes!' });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la schimbarea parolei', details: err.message });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    if (!subscription) {
      return res.json({
        hasSubscription: false,
        status: 'inactive',
        nextPaymentDate: null,
        message: 'No active subscription found'
      });
    }

    const response = {
      hasSubscription: true,
      hasActiveSubscription: subscription.status === 'active',
      id: subscription.id,
      status: subscription.status,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      nextPaymentDate: subscription.nextPaymentDate,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper endpoint pentru a verifica doar dacă are abonament activ
exports.checkActiveSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { 
        userId: req.user.id,
        status: 'active'
      }
    });

    res.json({
      hasActiveSubscription: !!subscription,
      status: subscription ? subscription.status : 'inactive'
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
