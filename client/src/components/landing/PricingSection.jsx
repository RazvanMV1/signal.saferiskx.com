import React, { useState, useEffect } from 'react';
import styles from './PricingSection.module.css';

const STRIPE_PRICE_ID = 'price_1Ruunr7tiAJSAgl0vEb1x81Y'; // Your existing price ID
const apiUrl = process.env.REACT_APP_API_URL;

export default function PricingSection() {
  const [pricing, setPricing] = useState({
    price: 29, // Fallback price
    currency: 'EUR',
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/stripe/pricing/${STRIPE_PRICE_ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPricing({
            price: Math.round(data.unit_amount / 100), // Convert cents to main currency
            currency: data.currency.toUpperCase(),
            loading: false,
            error: null
          });
        } else {
          throw new Error('Failed to fetch pricing');
        }
      } catch (error) {
        console.error('❌ Error fetching pricing:', error);
        setPricing(prev => ({
          ...prev,
          loading: false,
          error: 'Could not load current pricing'
        }));
      }
    };

    fetchPricing();
  }, []);

  const handleSubscribe = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: STRIPE_PRICE_ID
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('❌ Error creating checkout:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const plan = {
    name: "Premium Signals",
    features: [
      "Real-time Forex & Crypto signals",
      "Instant Discord community access",
      "Live performance tracking",
      "Professional risk management",
      "Exclusive market analysis",
      "24/7 trading support",
      "Mobile notifications",
      "Cancel anytime"
    ],
    cta: "Start Trading Now",
    highlight: true
  };

  return (
    <section className={styles.pricingSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Join Premium Signals Today</h2>
        <p className={styles.subtitle}>
          Transform your trading with professional signals and expert guidance
        </p>
        
        <div className={styles.pricingCard}>
          <div className={`${styles.card} ${styles.highlight}`}>
            <div className={styles.badge}>Most Popular</div>
            
            <div className={styles.planHeader}>
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planSubtitle}>Everything you need to succeed</div>
            </div>
            
            <div className={styles.price}>
              {pricing.loading ? (
                <div className={styles.priceLoading}>
                  <div className={styles.skeleton}></div>
                </div>
              ) : pricing.error ? (
                <div className={styles.priceError}>
                  <span className={styles.priceValue}>29</span>
                  <span className={styles.priceCur}>EUR</span>
                  <span className={styles.pricePer}>/month</span>
                </div>
              ) : (
                <>
                  <span className={styles.priceValue}>{pricing.price}</span>
                  <span className={styles.priceCur}>{pricing.currency}</span>
                  <span className={styles.pricePer}>/month</span>
                </>
              )}
            </div>

            <div className={styles.priceNote}>
              Cancel anytime • No hidden fees • Instant access
            </div>
            
            <ul className={styles.features}>
              {plan.features.map((feature, idx) => (
                <li key={feature} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <span className={styles.checkIcon}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              className={styles.ctaBtn}
              onClick={handleSubscribe}
              disabled={pricing.loading}
            >
              <span className={styles.btnIcon}>🚀</span>
              {pricing.loading ? 'Loading...' : plan.cta}
              <span className={styles.btnArrow}>→</span>
            </button>

            <div className={styles.guarantee}>
              <span className={styles.guaranteeIcon}>🛡️</span>
              30-day money-back guarantee
            </div>
          </div>
        </div>

        <div className={styles.trustSignals}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>⚡</span>
            <span>Instant Access</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🔒</span>
            <span>Secure Payment</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>📈</span>
            <span>Proven Results</span>
          </div>
        </div>
      </div>
    </section>
  );
}
