import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/map');
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid username or password');
        setLoading(false);
      } else {
        router.push('/map');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0066a4 0%, #00a4e4 100%)',
      }}>
        <div style={{ fontSize: '18px', color: 'white' }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Login - Thames Water Site Locations</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0066a4 0%, #00a4e4 100%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '10px',
            textAlign: 'center'
          }}>🗺️</div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#212529',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            Thames Water Site Locations
          </h1>

          <p style={{
            fontSize: '14px',
            color: '#6c757d',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            Sign in to access the interactive site map
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#212529'
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your username"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#212529'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div style={{
                padding: '12px',
                background: '#f8d7da',
                color: '#721c24',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: loading ? '#6c757d' : '#0066a4',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 500,
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#005288';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#0066a4';
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '20px',
            lineHeight: '1.5',
            textAlign: 'center'
          }}>
            Only authorized users may access this system.
          </p>
        </div>

        <div style={{
          marginTop: '20px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          © 2025 Thames Water Site Locations. All rights reserved.
        </div>
      </div>
    </>
  );
}
