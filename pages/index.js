import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      router.push('/map');
    } else {
      router.push('/login');
    }
  }, [session, status, router]);

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
