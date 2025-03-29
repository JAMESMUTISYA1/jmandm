'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../Shared/Firebaseconfig';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin?redirect=' + encodeURIComponent(window.location.pathname));
      }
    });
    return () => unsubscribe();
  }, [router]);

  return <>{children}</>;
}