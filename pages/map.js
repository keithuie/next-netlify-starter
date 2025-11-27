import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Import MapComponent without SSR (Leaflet needs window)
const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f8f9fa',
      fontSize: '18px',
      color: '#495057'
    }}>
      Loading map...
    </div>
  ),
});

export default function MapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa',
        fontSize: '18px',
        color: '#495057'
      }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Thames Water Site Locations Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
      </Head>

      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        {/* User info bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1000,
          background: 'white',
          padding: '10px 15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '14px' }}>
            {session.user.name}
          </span>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%'
              }}
            />
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              padding: '6px 12px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Sign Out
          </button>
        </div>

        <MapComponent />
      </div>
    </>
  );
}
