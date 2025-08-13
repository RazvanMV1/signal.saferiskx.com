// src/features/profile/ProfileCard.jsx
import React, { useState, useEffect } from 'react';
import { getUserInfo } from './api';
import styles from './ProfileCard.module.css';

const apiUrl = process.env.REACT_APP_API_URL;

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserInfo();
        setUser(userData);
      } catch (err) {
        setError('Nu s-au putut încărca datele');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
  try {
    console.log('🚪 Logging out...');
    
    const response = await fetch(`${apiUrl}/api/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      console.log('✅ Logout successful');
      // Redirect la pagina de login
      window.location.href = '/login';
    } else {
      throw new Error('Eroare la logout');
    }
  } catch (error) {
    console.error('❌ Logout error:', error);
    alert('Eroare la logout: ' + error.message);
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
      return 'Data necunoscută';
    }
  };

  if (loading) {
    return (
      <div className={styles.profileCard}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Se încarcă profilul...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profileCard}>
        <div className={styles.error}>
          <div className={styles.errorMessage}>Eroare: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryBtn}
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  const getFullName = () => {
    if (user.fullName) return user.fullName;
    if (user.name) return user.name;
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Utilizator';
  };

  const getInitials = () => {
    const name = getFullName();
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className={styles.profileCard}>
      {/* Profile Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          {getInitials()}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{getFullName()}</div>
          <div className={styles.userEmail}>{user.email}</div>
          {user.createdAt && (
            <div className={styles.memberSince}>
              Membru din {formatDate(user.createdAt)}
            </div>
          )}
        </div>
      </div>

      {/* Security Section */}
      <SecuritySection />

      {/* Join Server Section */}
<div className={styles.logoutSection}>
  <div className={styles.sectionTitlel}>🎮 Server Discord</div>
  <div className={styles.logoutContent}>
    <p className={styles.logoutDescription}>
      Alătură-te comunității noastre Discord pentru semnale premium și discuții de trading.
    </p>
    <a 
      href={apiUrl.SERVER_DISCORD_URL}
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.logoutBtn}
    >
      🎮 Alătură-te pe Discord
    </a>
  </div>
</div>


      {/* Logout Section */}
      <div className={styles.logoutSection}>
        <div className={styles.sectionTitlel}>🚪 Sesiune</div>
        <div className={styles.logoutContent}>
          <p className={styles.logoutDescription}>
            Închide sesiunea curentă și revino la pagina de login
          </p>
          <button 
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// Security Component
function SecuritySection() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changing, setChanging] = useState(false);

  const handlePasswordChange = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('Parolele nu coincid!');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        alert('Parola trebuie să aibă minim 6 caractere!');
        return;
      }

      setChanging(true);

      const response = await fetch(`${apiUrl}/api/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        console.log('✅ Password changed successfully');
        alert('Parola a fost schimbată cu succes!');
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Eroare la schimbarea parolei');
      }
    } catch (error) {
      console.error('❌ Password change error:', error);
      alert('Eroare: ' + error.message);
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionTitle}>🔒 Securitate</div>
      
      {!showPasswordForm ? (
        <div className={styles.securityActions}>
          <div className={styles.securityItem}>
            <div className={styles.securityInfo}>
              <h4>Parolă</h4>
              <p>Schimbă parola contului tău</p>
            </div>
            <button 
              onClick={() => setShowPasswordForm(true)}
              className={styles.actionButton}
            >
              🔑 Schimbă Parola
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.passwordForm}>
          <div className={styles.inputGroup}>
            <label>Parola curentă:</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              placeholder="Introdu parola curentă"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Parola nouă:</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              placeholder="Introdu parola nouă (minim 6 caractere)"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Confirmă parola:</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              placeholder="Confirmă parola nouă"
            />
          </div>
          <div className={styles.passwordActions}>
            <button 
              onClick={handlePasswordChange}
              disabled={changing}
              className={styles.saveBtn}
            >
              {changing ? '🔑 Se schimbă...' : '🔑 Schimbă Parola'}
            </button>
            <button 
              onClick={() => setShowPasswordForm(false)}
              className={styles.cancelBtn}
            >
              ❌ Anulează
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
