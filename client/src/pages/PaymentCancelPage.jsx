// src/pages/PaymentCancelPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect după 10 secunde
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
        boxShadow: '0 4px 28px rgba(244, 67, 54, 0.2)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
          😔
        </div>
        
        <h1 style={{ 
          color: '#f44336', 
          fontSize: '2rem', 
          marginBottom: '15px' 
        }}>
          Plata a fost anulată
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#666', 
          marginBottom: '30px' 
        }}>
          Nu îți faci griji - nu a fost perceput niciun cost.
        </p>

        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          color: '#856404'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Motivele posibile:</h3>
          <ul style={{ textAlign: 'left', margin: 0 }}>
            <li>Ai închis fereastra de plată</li>
            <li>Cardul a fost refuzat</li>
            <li>Fonduri insuficiente</li>
            <li>Problemă tehnică temporară</li>
          </ul>
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
          >
            Înapoi la Dashboard
          </button>

          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#19c27d',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'transform 0.2s'
            }}
          >
            Încearcă din nou
          </button>
        </div>

        <p style={{ 
          color: '#888', 
          fontSize: '0.9rem',
          marginTop: '20px'
        }}>
          Vei fi redirectat automat către dashboard în 10 secunde...
        </p>

        <div style={{ 
          marginTop: '30px', 
          padding: '15px',
          background: '#e3f2fd',
          borderRadius: '8px'
        }}>
          <p style={{ 
            color: '#1976d2', 
            fontSize: '0.9rem',
            margin: 0
          }}>
            💡 <strong>Sugestie:</strong> Verifică datele cardului și încearcă din nou. Pentru probleme persistente, contactează-ne.
          </p>
        </div>
      </div>
    </div>
  );
}
