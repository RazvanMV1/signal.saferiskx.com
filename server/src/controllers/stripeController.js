// controllers/stripeController.js
const { createCheckoutSession, getStripeInstance } = require('../services/stripeService');
const { Subscription, User } = require('../../models');
const discordService = require('../services/discordService');

console.log('🎮 Stripe controller loaded');

exports.createSession = async (req, res) => {
  console.log('🛒 Create session request from user:', req.user?.email);
  
  try {
    const user = req.user;

    if (!user) {
      console.log('❌ Unauthorized request');
      return res.status(401).json({ error: 'Neautentificat!' });
    }

    // Verifică dacă user-ul are deja abonament activ
    const existingSubscription = await Subscription.findOne({
      where: { userId: user.id, status: 'active' }
    });

    if (existingSubscription) {
      console.log('⚠️ User already has active subscription');
      return res.status(400).json({ error: 'Ai deja un abonament activ!' });
    }

    const url = await createCheckoutSession({ user });
    
    console.log('✅ Session created successfully');
    res.json({ url });
  } catch (err) {
    console.error('❌ Create session error:', err);
    res.status(500).json({ error: err.message || 'Eroare la crearea sesiunii Stripe' });
  }
};

// ✅ NOUĂ FUNCȚIE - STRIPE CUSTOMER PORTAL
exports.createPortalSession = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`🔧 Creating portal session for user ${userId} (${req.user.email})`);
    
    // Găsește abonamentul activ pentru utilizator
    const subscription = await Subscription.findOne({
      where: { 
        userId: userId, 
        status: 'active' 
      }
    });

    if (!subscription) {
      console.log(`❌ No active subscription found for user ${userId}`);
      return res.status(404).json({ error: 'Nu ai un abonament activ!' });
    }

    if (!subscription.stripeCustomerId) {
      console.log(`❌ No Stripe customer ID found for user ${userId}`);
      return res.status(400).json({ error: 'Eroare în identificarea contului Stripe' });
    }

    console.log(`✅ Found customer: ${subscription.stripeCustomerId}`);

    // Creează sesiunea Stripe Customer Portal
    const stripe = getStripeInstance();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`,
    });

    console.log(`🎉 Portal session created: ${portalSession.id}`);

    res.json({ 
      success: true,
      url: portalSession.url 
    });

  } catch (error) {
    console.error('❌ Portal session error:', error);
    res.status(500).json({ 
      error: 'Eroare la crearea sesiunii de management',
      details: error.message 
    });
  }
};

exports.webhook = async (req, res) => {
  console.log('🔔 Webhook received - Headers:', Object.keys(req.headers));
  console.log('🔔 Webhook body type:', typeof req.body);
  console.log('🔔 Webhook body length:', req.body?.length || 'N/A');
  
  const stripe = getStripeInstance();
  const sig = req.headers['stripe-signature'];
  
  console.log('🔑 Stripe signature present:', !!sig);
  console.log('🔑 Webhook secret present:', !!process.env.STRIPE_WEBHOOK_SECRET);
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log('✅ Event constructed successfully:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await handleWebhookEvent(event);
    console.log('✅ Event processed successfully');
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.json({ received: true });
};

exports.getSession = async (req, res) => {
  console.log('📋 Get session request:', req.query.session_id);
  
  try {
    const stripe = getStripeInstance();
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID lipsă!' });
    }
    
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('✅ Session retrieved:', session.id);
    
    res.json(session);
  } catch (err) {
    console.error('❌ Get session error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Handler pentru evenimente webhook
async function handleWebhookEvent(event) {
  console.log(`🎯 Processing event: ${event.type}`);
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object);
      break;
      
    // ✅ WEBHOOK-URI NOI PENTRU EXPIRARE
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
      
    case 'customer.subscription.past_due':
    case 'customer.subscription.unpaid':
      await handleSubscriptionExpired(event.data.object);
      break;
      
    default:
      console.log(`❓ Unhandled event type: ${event.type}`);
  }
}

// Handler pentru checkout completat
async function handleCheckoutCompleted(session) {
  console.log('📝 Handling checkout completed:', session.id);
  console.log('📝 Session metadata:', session.metadata);
  console.log('📝 Session details:', {
    subscription: session.subscription,
    customer: session.customer,
    amount_total: session.amount_total
  });
  
  const userId = parseInt(session.metadata?.userId);
  
  if (!userId) {
    throw new Error('No userId found in session metadata');
  }
  
  // Găsește user-ul
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }
  
  console.log('👤 User found:', user.email);
  
  // Verifică dacă subscription-ul există deja pentru această sesiune
  const existingSubscription = await Subscription.findOne({
    where: { stripeCheckoutSessionId: session.id }
  });

  if (existingSubscription) {
    console.log('⚠️ Subscription already exists for this session');
    return;
  }

  try {
    // Obține detalii subscription din Stripe
    const stripe = getStripeInstance();
    console.log('🔍 Retrieving Stripe subscription:', session.subscription);
    const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);
    
    // Validează și convertește timestamp-ul corect
    let nextPaymentDate = null;
    
    if (stripeSubscription.current_period_end) {
      const timestamp = typeof stripeSubscription.current_period_end === 'number' 
        ? stripeSubscription.current_period_end 
        : parseInt(stripeSubscription.current_period_end);
      
      if (!isNaN(timestamp) && timestamp > 0) {
        nextPaymentDate = new Date(timestamp * 1000);
        
        if (isNaN(nextPaymentDate.getTime())) {
          console.log('⚠️ Invalid date after conversion, using current date + 1 month');
          nextPaymentDate = new Date();
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        }
      } else {
        console.log('⚠️ Invalid timestamp from Stripe, using current date + 1 month');
        nextPaymentDate = new Date();
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
    } else {
      console.log('⚠️ No current_period_end from Stripe, using current date + 1 month');
      nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }
    
    console.log('📅 Final next payment date:', nextPaymentDate.toISOString());

    // Actualizează user-ul cu stripeCustomerId dacă nu îl are deja
    if (!user.stripeCustomerId) {
      await User.update(
        { stripeCustomerId: session.customer },
        { where: { id: userId } }
      );
      console.log('✅ Updated user with stripeCustomerId');
    }

    // Creează subscription în DB cu toate câmpurile tale
    const subscription = await Subscription.create({
      userId: userId,
      status: 'active',
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      nextPaymentDate: nextPaymentDate,
      stripeCheckoutSessionId: session.id
    });

    console.log('✅ Subscription created successfully:', subscription.id);

    // 🎮 DISCORD AUTO-ENROLLMENT
    if (user.discordId) {
      console.log('🎮 User has Discord connected, starting auto-enrollment...');
      
      try {
        // Verifică dacă user-ul este în server
        const guildStatus = await discordService.checkUserInGuild(user.discordId);
        
        if (guildStatus.inGuild) {
          if (!guildStatus.hasPremiumRole) {
            // User este în server dar nu are rolul premium
            await discordService.assignPremiumRole(user.discordId);
            console.log(`🏆 Premium role assigned to ${user.email} (${user.discordUsername})`);
          } else {
            console.log(`✅ User ${user.email} already has premium role`);
          }
        } else {
          console.log(`ℹ️ User ${user.email} not in Discord server yet - role will be assigned when they join`);
          // User-ul nu este în server, rolul va fi dat când se va conecta prin OAuth
        }
        
      } catch (discordError) {
        console.error('❌ Discord auto-enrollment error:', discordError.message);
        // Nu oprește procesul pentru erori Discord
      }
    } else {
      console.log('ℹ️ User has no Discord connected - can connect later for premium access');
    }

    console.log(`🎉 Complete setup for user ${user.email}: Subscription ${subscription.id}`);

  } catch (error) {
    console.error('❌ Error creating subscription:', error);
    throw error;
  }
}

// Handler pentru plată reușită (renewal)
async function handlePaymentSucceeded(invoice) {
  console.log('💰 Handling payment succeeded:', invoice.id);
  console.log('💰 Invoice details:', {
    subscription: invoice.subscription,
    amount_paid: invoice.amount_paid,
    customer: invoice.customer
  });
  
  if (!invoice.subscription) {
    console.log('⚠️ Invoice has no subscription - might be a one-time payment');
    return;
  }
  
  try {
    // Obține detalii subscription din Stripe pentru renewal
    const stripe = getStripeInstance();
    const stripeSubscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    // 🔧 FIX: Același handling pentru data ca în handleCheckoutCompleted
    let newNextPaymentDate = null;
    
    if (stripeSubscription.current_period_end) {
      const timestamp = typeof stripeSubscription.current_period_end === 'number' 
        ? stripeSubscription.current_period_end 
        : parseInt(stripeSubscription.current_period_end);
      
      if (!isNaN(timestamp) && timestamp > 0) {
        newNextPaymentDate = new Date(timestamp * 1000);
        
        if (isNaN(newNextPaymentDate.getTime())) {
          console.log('⚠️ Invalid renewal date, using current date + 1 month');
          newNextPaymentDate = new Date();
          newNextPaymentDate.setMonth(newNextPaymentDate.getMonth() + 1);
        }
      } else {
        console.log('⚠️ Invalid timestamp for renewal, using current date + 1 month');
        newNextPaymentDate = new Date();
        newNextPaymentDate.setMonth(newNextPaymentDate.getMonth() + 1);
      }
    } else {
      console.log('⚠️ No renewal date from Stripe, using current date + 1 month');
      newNextPaymentDate = new Date();
      newNextPaymentDate.setMonth(newNextPaymentDate.getMonth() + 1);
    }
    
    console.log('📅 Updating subscription with new payment date:', newNextPaymentDate.toISOString());
    
    // Actualizează subscription-ul prin stripeSubscriptionId
    const [updatedCount] = await Subscription.update({
      status: 'active',
      nextPaymentDate: newNextPaymentDate,
    }, {
      where: { 
        stripeSubscriptionId: invoice.subscription 
      }
    });

    if (updatedCount > 0) {
      console.log(`✅ Updated ${updatedCount} subscription for payment renewal`);
    } else {
      console.log('⚠️ No subscription found to update for stripe subscription:', invoice.subscription);
    }
    
  } catch (error) {
    console.error('❌ Error in handlePaymentSucceeded:', error);
  }
}

// Handler pentru subscription anulat
async function handleSubscriptionCancelled(subscription) {
  console.log('❌ Handling subscription cancelled:', subscription.id);
  
  try {
    // Găsește subscription-ul local și user-ul
    const localSubscription = await Subscription.findOne({
      where: { stripeSubscriptionId: subscription.id },
      include: [{
        model: User,
        as: 'user'
      }]
    });

    if (!localSubscription) {
      console.log('⚠️ No local subscription found for:', subscription.id);
      return;
    }

    const user = localSubscription.user;
    console.log('👤 Found user for cancelled subscription:', user.email);

    // Anulează subscription-ul în DB
    const [updatedCount] = await Subscription.update({
      status: 'cancelled',
    }, {
      where: { stripeSubscriptionId: subscription.id }
    });

    if (updatedCount > 0) {
      console.log(`✅ Cancelled ${updatedCount} subscription in database`);
    }

    // 🎮 DISCORD AUTO-REMOVAL
    if (user.discordId) {
      console.log('🎮 User has Discord connected, removing premium access...');
      
      try {
        // Verifică dacă user-ul este în server și are rolul
        const guildStatus = await discordService.checkUserInGuild(user.discordId);
        
        if (guildStatus.inGuild && guildStatus.hasPremiumRole) {
          await discordService.removePremiumRole(user.discordId);
          console.log(`❌ Premium role removed from ${user.email} (${user.discordUsername})`);
        } else {
          console.log(`ℹ️ User ${user.email} doesn't have premium role or not in server`);
        }
        
      } catch (discordError) {
        console.error('❌ Discord role removal error:', discordError.message);
        // Nu oprește procesul pentru erori Discord
      }
    } else {
      console.log('ℹ️ User has no Discord connected - no role to remove');
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionCancelled:', error);
  }
}

// ✅ NOI FUNCȚII PENTRU EXPIRAREA AUTOMATĂ

// Handler pentru eșecul plății (când cardul nu poate fi taxat)
async function handleInvoicePaymentFailed(invoice) {
  console.log('💳 Handling payment failed:', invoice.id);
  console.log('💳 Invoice details:', {
    subscription: invoice.subscription,
    amount_due: invoice.amount_due,
    customer: invoice.customer,
    attempt_count: invoice.attempt_count
  });
  
  if (!invoice.subscription) {
    console.log('⚠️ Invoice has no subscription');
    return;
  }
  
  try {
    // Găsește subscription-ul local
    const localSubscription = await Subscription.findOne({
      where: { stripeSubscriptionId: invoice.subscription },
      include: [{
        model: User,
        as: 'user'
      }]
    });

    if (!localSubscription) {
      console.log('⚠️ No local subscription found for failed payment:', invoice.subscription);
      return;
    }

    const user = localSubscription.user;
    console.log(`❌ Payment failed for user: ${user.email} (attempt ${invoice.attempt_count})`);
    
    // Nu remove imediat rolul - Stripe încearcă de mai multe ori
    // Doar loghează pentru moment
    console.log(`⏳ Payment will be retried by Stripe. User keeps access for now.`);
    
  } catch (error) {
    console.error('❌ Error in handleInvoicePaymentFailed:', error);
  }
}

// Handler pentru expirarea definitivă a abonamentului
async function handleSubscriptionExpired(subscription) {
  console.log('⏰ Handling subscription expired:', subscription.id);
  console.log('📊 Subscription status:', subscription.status);
  
  try {
    // Găsește subscription-ul local și user-ul
    const localSubscription = await Subscription.findOne({
      where: { stripeSubscriptionId: subscription.id },
      include: [{
        model: User,
        as: 'user'
      }]
    });

    if (!localSubscription) {
      console.log('⚠️ No local subscription found for expiration:', subscription.id);
      return;
    }

    const user = localSubscription.user;
    console.log(`🔄 Processing subscription expiration for user: ${user.email}`);
    
    // Remove premium role from Discord dacă user-ul are Discord conectat
    if (user.discordId) {
      try {
        console.log(`🎭 Removing premium role from Discord user: ${user.discordId}`);
        
        const guildStatus = await discordService.checkUserInGuild(user.discordId);
        
        if (guildStatus.inGuild && guildStatus.hasPremiumRole) {
          await discordService.removePremiumRole(user.discordId);
          console.log(`✅ Premium role removed due to subscription expiration`);
        } else {
          console.log(`ℹ️ User doesn't have premium role or not in server`);
        }
        
      } catch (discordError) {
        console.error(`❌ Failed to remove Discord role:`, discordError.message);
      }
    } else {
      console.log(`ℹ️ User has no Discord account connected`);
    }
    
    // Update subscription status în baza de date
    await localSubscription.update({ 
      status: subscription.status // 'past_due', 'canceled', 'unpaid', etc.
    });
    
    console.log(`✅ Subscription ${subscription.id} marked as ${subscription.status}`);
    
  } catch (error) {
    console.error('❌ Error in handleSubscriptionExpired:', error);
  }
}


// Handler pentru actualizarea abonamentului (pentru reactivare)
async function handleSubscriptionUpdated(subscription) {
  console.log('🔄 Handling subscription updated:', subscription.id);
  console.log('📊 New status:', subscription.status);
  
  try {
    // Găsește subscription-ul local
    const localSubscription = await Subscription.findOne({
      where: { stripeSubscriptionId: subscription.id },
      include: [{
        model: User,
        as: 'user'
      }]
    });

    if (!localSubscription) {
      console.log('⚠️ No local subscription found for update:', subscription.id);
      return;
    }

    const user = localSubscription.user;
    
    // Calculează noua dată de plată
    let newNextPaymentDate = null;
    
    if (subscription.current_period_end) {
      const timestamp = typeof subscription.current_period_end === 'number' 
        ? subscription.current_period_end 
        : parseInt(subscription.current_period_end);
      
      if (!isNaN(timestamp) && timestamp > 0) {
        newNextPaymentDate = new Date(timestamp * 1000);
      }
    }
    
    // Update subscription în baza de date
    await localSubscription.update({
      status: subscription.status === 'active' ? 'active' : subscription.status,
      nextPaymentDate: newNextPaymentDate
    });
    
    console.log(`✅ Updated subscription ${subscription.id} to status: ${subscription.status}`);
    
    // Dacă abonamentul devine activ și user-ul are Discord conectat
    if (subscription.status === 'active' && user.discordId) {
      try {
        console.log(`🎉 Reactivating premium role for Discord user: ${user.discordId}`);
        
        // Verifică dacă user-ul este în server
        const guildStatus = await discordService.checkUserInGuild(user.discordId);
        
        if (guildStatus.inGuild && !guildStatus.hasPremiumRole) {
          await discordService.assignPremiumRole(user.discordId);
          console.log(`✅ Premium role restored due to subscription reactivation`);
        } else if (guildStatus.inGuild && guildStatus.hasPremiumRole) {
          console.log(`✅ User already has premium role`);
        } else {
          console.log(`ℹ️ User not in Discord server - role will be assigned when they join`);
        }
        
      } catch (discordError) {
        console.error(`❌ Failed to restore Discord role:`, discordError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error in handleSubscriptionUpdated:', error);
  }
}
