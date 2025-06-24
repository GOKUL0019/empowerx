// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FloatingMathSymbols from '@/components/FloatingMathSymbols';
import ThreeScene from '@/components/ThreeScene';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false); // 👉 Starts in view-only mode
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        // dob can be loaded from Firestore if needed
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate('/login');
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName });
      setEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleCancel = () => {
    setEditing(false); // 👈 Just go back to view mode
    setDisplayName(user?.displayName || '');
    setDob(''); // optional reset
  };

  return (
    <div className="min-h-screen relative pt-20 px-6 text-white">
      <FloatingMathSymbols />
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      <div className="relative z-10 max-w-xl mx-auto py-12">
        <div className="glass-panel p-8 md:p-10 text-center relative rounded-xl shadow-lg">

          {/* Cancel only shows in edit mode */}
          {editing && (
            <button
              className="absolute top-4 right-4 text-sm text-yellow-400 hover:text-yellow-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

          {/* Avatar */}
          <Avatar className="mx-auto mb-6 w-24 h-24">
            <AvatarImage src={user?.photoURL || undefined} />
            <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
          </Avatar>

          {editing ? (
            <div className="space-y-6 text-left">
              <div>
                <Label htmlFor="name" className="text-white block mb-1">Full Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white placeholder-white/60"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <Label htmlFor="dob" className="text-white block mb-1">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white placeholder-white/60"
                />
              </div>

              <Button
                onClick={handleSave}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-2">{user?.displayName || 'User'}</h2>
              <p className="text-white/80 mb-6">{user?.email}</p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold"
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
