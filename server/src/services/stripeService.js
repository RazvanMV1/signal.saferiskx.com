// services/stripeService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

console.log('🔧 Stripe service initialized');

const getStripeInstance = () => stripe; // Redenumit pentru consistență

const createCheckoutSession = async ({ user }) => {
  console.log('💳 Creating checkout session for user:', user.email);
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id.toString()
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
    });

    console.log('✅ Checkout session created:', session.id);
    return session.url;
  } catch (error) {
    console.error('❌ Stripe checkout session error:', error);
    throw new Error('Failed to create checkout session: ' + error.message);
  }
};

module.exports = {
  createCheckoutSession,
  getStripeInstance // Schimbat de la getStripe
};
