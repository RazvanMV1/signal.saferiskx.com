// src/features/discord-service/api.js
const apiUrl = process.env.REACT_APP_API_URL;

// Obține subscription-ul utilizatorului
export const getSubscription = async () => {
  try {
    console.log('🔍 Fetching subscription from:', `${apiUrl}/api/user/subscription`);
    
    const response = await fetch(`${apiUrl}/api/user/subscription`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Subscription response status:', response.status);

    // Dacă utilizatorul nu are abonament (404), returnează null
    if (response.status === 404) {
      console.log('ℹ️ User has no subscription');
      return null;
    }

    // Dacă nu este autentificat (401), aruncă eroare pentru redirect la login
    if (response.status === 401) {
      console.log('🔒 User not authenticated');
      throw new Error('Not authenticated');
    }

    // Pentru alte erori
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', response.status, errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Subscription data received:', {
      status: data.status,
      nextPaymentDate: data.nextPaymentDate,
      stripeCustomerId: data.stripeCustomerId ? 'present' : 'missing'
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching subscription:', error);
    
    // Re-throw authentication errors pentru handling în component
    if (error.message === 'Not authenticated') {
      throw error;
    }
    
    // Pentru alte erori, returnează null (user fără abonament)
    return null;
  }
};

// Creează sesiune Stripe pentru plată
export const createStripeSession = async () => {
  try {
    console.log('💳 Creating Stripe session...');
    
    const response = await fetch(`${apiUrl}/api/stripe/create-session`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
      // Nu mai trimitem body pentru că avem un singur tip de abonament
    });

    console.log('📡 Create session response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Create session error:', response.status, errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Stripe session created successfully');
    
    return data;
  } catch (error) {
    console.error('❌ Error creating Stripe session:', error);
    throw error;
  }
};

// Obține statusul Discord al utilizatorului
export const getDiscordStatus = async () => {
  try {
    console.log('🎮 Fetching Discord status...');
    
    const response = await fetch(`${apiUrl}/api/discord/status`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Discord status response:', response.status);

    if (response.status === 401) {
      console.log('🔒 User not authenticated for Discord status');
      throw new Error('Not authenticated');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Discord status error:', response.status, errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Discord status received:', {
      connected: data.connected,
      inGuild: data.inGuild,
      hasPremiumRole: data.hasPremiumRole,
      hasActiveSubscription: data.hasActiveSubscription
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching Discord status:', error);
    throw error;
  }
};

// Inițiază procesul Discord OAuth
export const initiateDiscordAuth = async () => {
  try {
    console.log('🔗 Initiating Discord OAuth...');
    
    const response = await fetch(`${apiUrl}/api/discord/auth/initiate`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Discord auth initiate response:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Discord auth initiate error:', response.status, errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Discord OAuth URL received');
    
    return data;
  } catch (error) {
    console.error('❌ Error initiating Discord auth:', error);
    throw error;
  }
};

// Procesează callback-ul Discord OAuth
export const handleDiscordCallback = async (code) => {
  try {
    console.log('🔄 Processing Discord callback...');
    
    const response = await fetch(`${apiUrl}/api/discord/auth/callback`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    console.log('📡 Discord callback response:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Discord callback error:', response.status, errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Discord callback processed successfully');
    
    return data;
  } catch (error) {
    console.error('❌ Error processing Discord callback:', error);
    throw error;
  }
};

// Adaugă această funcție în api.js
export const disconnectDiscord = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/discord/disconnect`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la deconectarea Discord');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error disconnecting Discord:', error);
    throw error;
  }
};

// Force sync Discord status (pentru admin/debugging)
export const forceSyncDiscord = async () => {
  try {
    console.log('🔄 Force syncing Discord...');
    
    const response = await fetch(`${apiUrl}/api/discord/force-sync`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Discord force sync response:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Discord force sync error:', response.status, errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Discord force sync completed');
    
    return data;
  } catch (error) {
    console.error('❌ Error force syncing Discord:', error);
    throw error;
  }
};

// Test Discord enrollment (pentru debugging)
export const testDiscordEnrollment = async () => {
  try {
    console.log('🧪 Testing Discord enrollment...');
    
    const response = await fetch(`${apiUrl}/api/discord/test-enrollment`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Discord test enrollment response:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Discord test enrollment error:', response.status, errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Discord enrollment test completed');
    
    return data;
  } catch (error) {
    console.error('❌ Error testing Discord enrollment:', error);
    throw error;
  }
};
