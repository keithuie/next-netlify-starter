import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/map');
    }
  }, [status, router]);

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
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '10px'
          }}>🗺️</div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#212529',
            marginBottom: '10px'
          }}>
            Thames Water Site Locations
          </h1>

          <p style={{
            fontSize: '14px',
            color: '#6c757d',
            marginBottom: '30px'
          }}>
            Sign in to access the interactive site map
          </p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/map' })}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'white',
              border: '1px solid #dadce0',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              color: '#3c4043',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.background = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.background = 'white';
            }}
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '20px',
            lineHeight: '1.5'
          }}>
            By signing in, you agree to access the Thames Water site location database.
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
