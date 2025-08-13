// src/pages/DiscordCallback.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { handleDiscordCallback } from '../features/discord-service/api';

export default function DiscordCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Se procesează conectarea Discord...');
  
  // Prevent multiple executions
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate processing
    if (hasProcessed.current) {
      console.log('🚫 Discord callback already processed, skipping...');
      return;
    }

    const processCallback = async () => {
      try {
        // Mark as processing to prevent duplicates
        hasProcessed.current = true;
        
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        console.log('🔄 Starting Discord callback processing...');
        console.log('📋 Code present:', !!code);
        console.log('📋 Error present:', !!error);

        if (error) {
          throw new Error('User cancelled Discord authorization');
        }

        if (!code) {
          throw new Error('No authorization code received from Discord');
        }

        console.log('🔄 Processing Discord callback with code:', code.substring(0, 10) + '...');
        setMessage('Se conectează cu Discord...');

        // Procesează callback-ul
        const result = await handleDiscordCallback(code);

        if (result.success) {
          console.log('✅ Discord connection successful:', result);
          setStatus('success');
          setMessage('Discord conectat cu succes! Redirectare...');

          // Redirect după 2 secunde
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          throw new Error(result.message || 'Failed to connect Discord');
        }

      } catch (error) {
        console.error('❌ Discord callback error:', error);
        setStatus('error');
        setMessage('Eroare la conectarea Discord: ' + error.message);

        // Redirect la dashboard după 5 secunde chiar și în caz de eroare
        setTimeout(() => {
          navigate('/dashboard');
        }, 5000);
      }
    };

    processCallback();
  }, []); // Removed searchParams and navigate from dependencies

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return '🔄';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '🔄';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
          {getStatusIcon()}
        </div>
        
        <h2 style={{ 
          color: status === 'error' ? '#dc3545' : '#333',
          marginBottom: '15px' 
        }}>
          {status === 'processing' && 'Se procesează...'}
          {status === 'success' && 'Succes!'}
          {status === 'error' && 'Eroare!'}
        </h2>
        
        <p style={{ 
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '20px' 
        }}>
          {message}
        </p>
        
        {status === 'processing' && (
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        )}

        {(status === 'success' || status === 'error') && (
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Înapoi la Dashboard
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
