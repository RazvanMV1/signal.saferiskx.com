// src/features/profile/api.js
const apiUrl = process.env.REACT_APP_API_URL;

export async function getUserInfo() {
  const res = await fetch(`${apiUrl}/api/me`, {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  return await res.json();
}

// Update user profile info (nume, prenume, email)
export async function updateUserProfile(profileData) {
  try {
    const response = await fetch(`${apiUrl}/api/auth/profile`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la actualizarea profilului');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Update profile error:', error);
    throw error;
  }
}

// Change user password
export async function changePassword(passwordData) {
  try {
    const response = await fetch(`${apiUrl}/api/auth/change-password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la schimbarea parolei');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Change password error:', error);
    throw error;
  }
}

// Logout user
export async function logoutUser() {
  try {
    const response = await fetch(`${apiUrl}/api/logout`, {  // ✅ Updated endpoint
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la logout');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw error;
  }
}

// Get user's active sessions (if you implement this)
export async function getActiveSessions() {
  try {
    const response = await fetch(`${apiUrl}/api/auth/sessions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la încărcarea sesiunilor');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Get sessions error:', error);
    throw error;
  }
}

// Get user's subscription history
export async function getSubscriptionHistory() {
  try {
    const response = await fetch(`${apiUrl}/api/profile/subscriptions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la încărcarea istoricului abonamentelor');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Get subscription history error:', error);
    throw error;
  }
}

// Get user's Discord activity history
export async function getDiscordActivity() {
  try {
    const response = await fetch(`${apiUrl}/api/profile/discord-activity`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la încărcarea activității Discord');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Get Discord activity error:', error);
    throw error;
  }
}

// Get user's billing history
export async function getBillingHistory() {
  try {
    const response = await fetch(`${apiUrl}/api/profile/billing`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la încărcarea istoricului de facturare');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Get billing history error:', error);
    throw error;
  }
}

// Open Stripe Customer Portal (same as in discord service)
export async function openStripePortal() {
  try {
    const response = await fetch(`${apiUrl}/api/stripe/create-portal-session`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la deschiderea portalului de facturare');
    }

    const data = await response.json();
    
    if (data.success && data.url) {
      // Deschide în tab nou
      window.open(data.url, '_blank');
      return data;
    } else {
      throw new Error('Nu s-a putut obține URL-ul portalului');
    }
  } catch (error) {
    console.error('❌ Open Stripe portal error:', error);
    throw error;
  }
}

// Revoke specific session (logout from specific device)
export async function revokeSession(sessionId) {
  try {
    const response = await fetch(`${apiUrl}/api/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la revocarea sesiunii');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Revoke session error:', error);
    throw error;
  }
}

// Logout from all devices
export async function logoutAllDevices() {
  try {
    const response = await fetch(`${apiUrl}/api/auth/logout-all`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la logout din toate dispozitivele');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Logout all devices error:', error);
    throw error;
  }
}

// Update notification preferences
export async function updatePreferences(preferences) {
  try {
    const response = await fetch(`${apiUrl}/api/profile/preferences`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferences)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la actualizarea preferințelor');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Update preferences error:', error);
    throw error;
  }
}

// Get notification preferences
export async function getPreferences() {
  try {
    const response = await fetch(`${apiUrl}/api/profile/preferences`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Eroare la încărcarea preferințelor');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Get preferences error:', error);
    throw error;
  }
}

// Helper function pentru error handling
export function handleApiError(error) {
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    // Redirect to login if unauthorized
    window.location.href = '/login';
    return;
  }
  
  console.error('API Error:', error);
  throw error;
}

// Helper function pentru date formatting
export function formatDate(dateString) {
  if (!dateString) return 'Data necunoscută';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Data necunoscută';
  }
}

// Helper function pentru validarea email-ului
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function pentru validarea parolei
export function validatePassword(password) {
  return {
    isValid: password.length >= 6,
    errors: password.length < 6 ? ['Parola trebuie să aibă minim 6 caractere'] : []
  };
}
