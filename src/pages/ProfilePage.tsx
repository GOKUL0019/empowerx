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
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');

        const storedImage = localStorage.getItem(`profileImage-${currentUser.uid}`);
        const storedDob = localStorage.getItem(`dob-${currentUser.uid}`);

        if (storedImage) {
          setLocalImage(storedImage);
        }
        if (storedDob) {
          setDob(storedDob);
        }
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

      if (selectedImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string;
          localStorage.setItem(`profileImage-${user.uid}`, base64Image);
          setLocalImage(base64Image);
        };
        reader.readAsDataURL(selectedImage);
      }

      if (dob) {
        localStorage.setItem(`dob-${user.uid}`, dob);
      }

      const auth = getAuth();
      await auth.currentUser?.reload();
      setUser(auth.currentUser);

      setEditing(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setDisplayName(user?.displayName || '');
    const storedDob = localStorage.getItem(`dob-${user?.uid}`);
    setDob(storedDob || '');
    setSelectedImage(null);
  };

  const getAvatarSrc = () => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    } else if (localImage) {
      return localImage;
    } else if (user?.photoURL) {
      return user.photoURL;
    } else {
      return ''; // Force fallback
    }
  };

  return (
    <div className="min-h-screen relative pt-20 px-6 text-white">
      <FloatingMathSymbols />
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      <div className="relative z-10 max-w-xl mx-auto py-12">
        <div className="glass-panel p-8 md:p-10 text-center relative rounded-xl shadow-lg">

          {editing && (
            <button
              className="absolute top-4 right-4 text-sm text-yellow-400 hover:text-yellow-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

          <Avatar className="mx-auto mb-6 w-24 h-24 ring-2 ring-blue-400 ring-offset-2 ring-offset-blue-200">
            <AvatarImage src={getAvatarSrc()} />
            <AvatarFallback className="bg-blue-500 text-white font-semibold">
              {user?.displayName?.[0] || 'U'}
            </AvatarFallback>
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

              <div>
                <Label className="text-white block mb-1">Profile Picture</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
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
              <p className="text-white/80 mb-2">{user?.email}</p>
              {dob && (
                <p className="text-white/70 mb-6">DOB: {dob}</p>
              )}

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
