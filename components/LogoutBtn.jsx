import { getAuth, signOut } from 'firebase/auth';
import { app } from '../Shared/Firebaseconfig';

export default function LogoutButton() {
  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}