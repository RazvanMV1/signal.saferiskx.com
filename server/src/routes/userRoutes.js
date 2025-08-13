const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // importă middleware-ul de autentificare
const { User, Subscription } = require('../../models'); // importă modelul din models/

// Adaugă un user nou
router.post('/', async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    const user = await User.create({ email, firstName, lastName, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la crearea userului', details: err.message });
  }
});

// Obține subscription-ul utilizatorului
router.get('/subscription', auth, async (req, res) => {
  try {
    console.log('📋 Fetching subscription for user:', req.user.email);
    
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    if (!subscription) {
      console.log('❌ No subscription found for user:', req.user.id);
      return res.status(404).json({ message: 'Nu ai niciun abonament' });
    }

    console.log('✅ Subscription found:', subscription.status);
    res.json(subscription);
  } catch (error) {
    console.error('❌ Error fetching subscription:', error);
    res.status(500).json({ error: 'Eroare la obținerea abonamentului' });
  }
});

// Listează toți userii
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error('EROARE LA LISTARE:', err); // Adaugă asta!
    res.status(500).json({ error: 'Eroare la listare useri' });
  }
});

router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ error: 'Email-ul este obligatoriu' });
    }

    const deletedRowsCount = await User.destroy({
      where: { email: email }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Utilizatorul cu acest email nu a fost găsit' });
    }

    res.status(200).json({ 
      message: 'Utilizatorul a fost șters cu succes',
      email: email,
      deletedCount: deletedRowsCount
    });

  } catch (err) {
    console.error('EROARE LA ȘTERGERE:', err);
    res.status(500).json({ error: 'Eroare la ștergerea userului', details: err.message });
  }
});

module.exports = router;
