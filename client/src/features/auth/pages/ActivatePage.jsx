// src/pages/ActivatePage.jsx (sau unde vrei)
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ActivatePage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Token lipsește din URL');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/activate?token=${token}`, {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          // Redirectează către login după 3 secunde
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Eroare la activarea contului');
      }
    };

    activateAccount();
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f7f9fb'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 28px rgba(25, 118, 210, 0.2)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {status === 'loading' && (
          <div>
            <h2>Se activează contul...</h2>
            <div>Te rugăm să aștepți.</div>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <h2 style={{ color: '#19c27d' }}>✅ Cont activat!</h2>
            <p>{message}</p>
            <p>Vei fi redirectat către login în câteva secunde...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <h2 style={{ color: '#f44' }}>❌ Eroare</h2>
            <p>{message}</p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Mergi la Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}