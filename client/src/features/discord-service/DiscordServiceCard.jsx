// src/features/discord-service/DiscordServiceCard.jsx
import React, { useState, useEffect } from 'react';
import { getSubscription, createStripeSession, disconnectDiscord } from './api';
import styles from './DiscordServiceCard.module.css';

const apiUrl = process.env.REACT_APP_API_URL;

export default function DiscordServiceCard() {
  const [subscription, setSubscription] = useState(null);
  const [discordStatus, setDiscordStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        console.log('🔄 Fetching subscription and Discord data...');
        
        // Fetch subscription și Discord status în paralel
        const [subscriptionData, discordData] = await Promise.all([
          getSubscription(),
          getDiscordStatus()
        ]);
        
        console.log('📊 Data received:', { 
          subscription: subscriptionData ? subscriptionData.status : 'none',
          discord: discordData ? discordData.connected : 'none'
        });
        
        setSubscription(subscriptionData);
        setDiscordStatus(discordData);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        
        if (err.message === 'Not authenticated') {
          window.location.href = '/login';
          return;
        }
        
        setError('Eroare la încărcarea datelor');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Funcție pentru refresh data
  const refreshData = async () => {
    setLoading(true);
    try {
      const [subscriptionData, discordData] = await Promise.all([
        getSubscription(),
        getDiscordStatus()
      ]);
      setSubscription(subscriptionData);
      setDiscordStatus(discordData);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.discordCard}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Se încarcă informațiile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.discordCard}>
        <div className={styles.error}>
          <div className={styles.errorMessage}>{error}</div>
          <button 
            className={styles.retryBtn}
            onClick={() => window.location.reload()}
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  // Determine care componentă să afișeze
  const hasActiveSubscription = subscription && subscription.status === 'active';
  
  if (hasActiveSubscription) {
    return <ActiveSubscriptionCard 
      subscription={subscription} 
      discordStatus={discordStatus}
      onDiscordUpdate={refreshData}
    />;
  } else {
    return <NoSubscriptionCard />;
  }
}

// Componentă pentru utilizatori fără abonament
function NoSubscriptionCard() {
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      setError(null);
      
      console.log('🛒 Starting purchase process...');
      
      const sessionData = await createStripeSession();
      
      if (sessionData && sessionData.url) {
        console.log('🚀 Redirecting to Stripe Checkout...');
        window.location.href = sessionData.url;
      } else {
        throw new Error('Nu s-a putut obține URL-ul de plată');
      }
      
    } catch (error) {
      console.error('❌ Purchase error:', error);
      setError(error.message || 'Eroare la procesarea plății. Te rugăm să încerci din nou.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className={styles.discordCard}>
      <div className={styles.title}>Discord Premium Signals</div>
      
      <div className={styles.price}>
        <span className={styles.amount}>29</span>
        <span className={styles.currency}>EUR/lună</span>
      </div>
      
      <div className={styles.description}>
        Primește semnale de trading premium în timp real direct pe Discord. 
        Analize tehnice profesionale și oportunități de investiții exclusive.
      </div>
      
      <div className={styles.features}>
        <div className={styles.feature}>✅ Semnale în timp real</div>
        <div className={styles.feature}>✅ Analize tehnice avansate</div>
        <div className={styles.feature}>✅ Suport 24/7</div>
        <div className={styles.feature}>✅ Comunitate exclusivă</div>
        <div className={styles.feature}>🎮 Auto-enrollment Discord</div>
      </div>
      
      {error && (
        <div className={styles.purchaseError}>
          <span className={styles.errorText}>{error}</span>
        </div>
      )}
      
      <button 
        className={`${styles.purchaseBtn} ${purchasing ? styles.purchasing : ''}`}
        onClick={handlePurchase}
        disabled={purchasing}
      >
        {purchasing ? (
          <>
            <div className={styles.spinner}></div>
            <span>Se procesează...</span>
          </>
        ) : (
          'Abonează-te acum'
        )}
      </button>
    </div>
  );
}

// Componentă pentru utilizatori cu abonament activ
function ActiveSubscriptionCard({ subscription, discordStatus, onDiscordUpdate }) {
  const [connectingDiscord, setConnectingDiscord] = useState(false);
  const [discordError, setDiscordError] = useState(null);
  // ✅ NOUĂ VARIABILĂ PENTRU BILLING PORTAL
  const [openingBilling, setOpeningBilling] = useState(false);
  const [billingError, setBillingError] = useState(null);

  // ✅ NOUĂ FUNCȚIE - DESCHIDE STRIPE CUSTOMER PORTAL
  const openBillingPortal = async () => {
    try {
      setOpeningBilling(true);
      setBillingError(null);
      
      console.log('💳 Opening billing portal...');
      
      const response = await fetch(`${apiUrl}/api/stripe/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Pentru cookie-uri
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Eroare la deschiderea portalului de facturare');
      }
      
      if (data.success && data.url) {
        console.log('✅ Portal URL received, opening...');
        // Deschide în tab nou
        window.open(data.url, '_blank');
      } else {
        throw new Error('Nu s-a putut obține URL-ul portalului');
      }
      
    } catch (error) {
      console.error('❌ Error opening billing portal:', error);
      setBillingError(error.message);
    } finally {
      setOpeningBilling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data necunoscută';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Data necunoscută';
    }
  };

  const handleConnectDiscord = async () => {
    try {
      setConnectingDiscord(true);
      setDiscordError(null);
      
      console.log('🎮 Initiating Discord connection...');
      
      // Obține URL-ul OAuth de la backend
      const response = await fetch(`${apiUrl}/api/discord/auth/initiate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        console.log('🔗 Redirecting to Discord OAuth...');
        // Redirectează la Discord OAuth
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Eroare la inițierea conectării Discord');
      }
      
    } catch (error) {
      console.error('❌ Discord connection error:', error);
      setDiscordError(error.message);
      setConnectingDiscord(false);
    }
  };

  const handleDisconnectDiscord = async () => {
    try {
      setConnectingDiscord(true);
      setDiscordError(null);
      
      console.log('🔌 Disconnecting Discord account...');
      
      const result = await disconnectDiscord();
      
      if (result.success) {
        console.log('✅ Discord disconnected successfully');
        // Refresh data to show connect button
        await onDiscordUpdate();
      } else {
        throw new Error(result.error || 'Eroare la deconectare');
      }
      
    } catch (error) {
      console.error('❌ Discord disconnect error:', error);
      setDiscordError(error.message);
    } finally {
      setConnectingDiscord(false);
    }
  };

  const getDiscordStatusText = () => {
    if (!discordStatus) return 'Se verifică...';
    
    if (!discordStatus.connected) {
      return '❌ Discord neconectat';
    }
    
    if (!discordStatus.inGuild) {
      return '⚠️ Nu ești pe server';
    }
    
    if (!discordStatus.hasPremiumRole) {
      return '⏳ Fără rol Premium';
    }
    
    return '✅ Conectat cu Premium';
  };

  const getDiscordAction = () => {
    if (!discordStatus) return null;
    
    if (!discordStatus.connected) {
      return (
        <button 
          onClick={handleConnectDiscord}
          disabled={connectingDiscord}
          className={styles.discordConnectBtn}
        >
          {connectingDiscord ? 'Se conectează...' : '🔗 Conectează Discord'}
        </button>
      );
    }
    
    // User has Discord connected
    return (
      <div className={styles.discordConnected}>
        <div className={styles.discordInfo}>
          <div className={styles.discordUser}>
            <strong>Conectat ca:</strong> {discordStatus.discord?.username || 'Necunoscut'}
          </div>
          <div className={styles.discordStatusDetail}>
            {discordStatus.inGuild && discordStatus.hasPremiumRole ? (
              <span className={styles.statusSuccess}>✅ Acces Premium Complet</span>
            ) : discordStatus.inGuild ? (
              <span className={styles.statusPending}>⏳ În server, fără rol Premium</span>
            ) : (
              <span className={styles.statusWarning}>⚠️ Nu ești în server</span>
            )}
          </div>
        </div>
        
        <div className={styles.discordActions}>
          {discordStatus.inGuild && discordStatus.hasPremiumRole ? (
            <a 
              href="https://discord.gg/C6hTC3Qp" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.discordBtn}
            >
              🚀 Deschide Discord Premium
            </a>
          ) : (
            <div className={styles.pendingActions}>
              <p className={styles.pendingText}>
                {!discordStatus.inGuild 
                  ? 'Te rugăm să te alături serverului Discord.'
                  : 'Se acordă rolul premium...'}
              </p>
              <button onClick={onDiscordUpdate} className={styles.refreshBtn}>
                🔄 Actualizează Status
              </button>
            </div>
          )}
          
          <button 
            onClick={handleDisconnectDiscord} 
            disabled={connectingDiscord}
            className={styles.discordDisconnectBtn}
          >
            {connectingDiscord ? 'Se deconectează...' : '🔌 Schimbă Contul Discord'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.discordCard}>
      <div className={styles.activeHeader}>
        <div className={`${styles.statusBadge} ${styles.statusActive}`}>
          ✅ Abonament Activ
        </div>
      </div>
      
      <div className={styles.paymentInfo}>
        <div className={styles.nextPayment}>
          <div className={styles.label}>Următoarea plată:</div>
          <div className={styles.paymentDate}>
            {formatDate(subscription.nextPaymentDate)}
          </div>
          <div className={styles.paymentAmount}>29 EUR</div>
        </div>
      </div>
      
      <div className={styles.subscriptionDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Status:</span>
          <span className={styles.detailValue}>Activ</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Abonament din:</span>
          <span className={styles.detailValue}>{formatDate(subscription.createdAt)}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Discord:</span>
          <span className={styles.detailValue}>{getDiscordStatusText()}</span>
        </div>
      </div>

      {/* ✅ NOUĂ SECȚIUNE - BILLING MANAGEMENT */}
      <div className={styles.billingSection}>
        <div className={styles.billingTitle}>💳 Gestionare Abonament</div>
        
        {billingError && (
          <div className={styles.billingError}>
            <span className={styles.errorText}>{billingError}</span>
          </div>
        )}
        
        <button 
          onClick={openBillingPortal}
          disabled={openingBilling}
          className={styles.billingPortalBtn}
        >
          {openingBilling ? (
            <>
              <div className={styles.spinner}></div>
              <span>Se deschide...</span>
            </>
          ) : (
            '💳 Gestionează Abonamentul'
          )}
        </button>
        
        <div className={styles.billingDescription}>
          Actualizează metoda de plată, descarcă facturile sau anulează abonamentul
        </div>
      </div>
      
      <div className={styles.discordSection}>
        <div className={styles.discordTitle}>🎮 Acces Discord Premium</div>
        
        {discordError && (
          <div className={styles.discordError}>
            {discordError}
          </div>
        )}
        
        {getDiscordAction()}
      </div>
    </div>
  );
}

// Funcții API helper
async function getDiscordStatus() {
  try {
    const response = await fetch(`${apiUrl}/api/discord/status`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 401) {
      throw new Error('Not authenticated');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching Discord status:', error);
    throw error;
  }
}