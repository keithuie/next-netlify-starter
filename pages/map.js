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
        {/* User info bar - positioned to not block map controls */}
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '10px',
          zIndex: 999,
          background: 'white',
          padding: '8px 12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '13px', display: 'none' }} className="user-name-desktop">
            {session.user.name}
          </span>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%'
              }}
            />
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              padding: '5px 10px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Sign Out
          </button>
        </div>

        <MapComponent />

        <style jsx>{`
          @media (min-width: 768px) {
            .user-name-desktop {
              display: inline !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
