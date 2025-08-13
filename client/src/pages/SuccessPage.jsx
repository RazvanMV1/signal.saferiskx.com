// src/pages/SuccessPage.jsx (sau unde vrei)
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect după 5 secunde
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [navigate]);

  const sessionId = searchParams.get('session_id');

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f7f9fb',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '50px',
        borderRadius: '16px',
        boxShadow: '0 4px 28px rgba(25, 118, 210, 0.2)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
          🎉
        </div>
        
        <h1 style={{ 
          color: '#19c27d', 
          fontSize: '2rem', 
          marginBottom: '15px' 
        }}>
          Plata realizată cu succes!
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#032858', 
          marginBottom: '20px' 
        }}>
          Abonamentul tău Discord Premium Signals a fost activat.
        </p>
        
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>
            Ce urmează?
          </h3>
          <p style={{ margin: '5px 0', color: '#555' }}>
            ✅ Accesul la semnalele premium a fost activat
          </p>
          <p style={{ margin: '5px 0', color: '#555' }}>
            ✅ Poți accesa Discord-ul din dashboard
          </p>
          <p style={{ margin: '5px 0', color: '#555' }}>
            ✅ Următoarea plată: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('ro-RO')}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(92deg, #1976d2 80%, #032858 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginRight: '15px',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Mergi la Dashboard
          </button>

          <a 
            href="https://discord.gg/YOUR_DISCORD_INVITE"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#5865f2',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Intră în Discord
          </a>
        </div>

        <p style={{ 
          color: '#888', 
          fontSize: '0.9rem',
          marginTop: '20px'
        }}>
          Vei fi redirectat automat către dashboard în 5 secunde...
        </p>

        {sessionId && (
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', color: '#1976d2' }}>
              Detalii plată
            </summary>
            <p style={{ 
              fontSize: '0.8rem', 
              color: '#666',
              wordBreak: 'break-all',
              padding: '10px',
              background: '#f5f5f5',
              borderRadius: '4px',
              marginTop: '10px'
            }}>
              Session ID: {sessionId}
            </p>
          </details>
        )}
      </div>
    </div>
  );
}
