// src/pages/Main.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import FloatingMathSymbols from '@/components/FloatingMathSymbols';
import ThreeScene from '@/components/ThreeScene';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Main = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative pt-20 px-6 text-white">
      <FloatingMathSymbols />
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-12">
        {/* Header with profile and logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Welcome {user?.displayName || 'User'}
          </h1>
          <div className="flex items-center gap-4">
            
            
          </div>
        </div>

        {/* User Details Section */}
        {showDetails && (
          <div className="glass-panel p-6 mb-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              User Details
            </h2>
            <p>
              <span className="text-white/80">Name:</span>{' '}
              {user?.displayName || 'N/A'}
            </p>
            <p>
              <span className="text-white/80">Email:</span>{' '}
              {user?.email || 'N/A'}
            </p>
            <p>
              <span className="text-white/80">UID:</span>{' '}
              {user?.uid || 'N/A'}
            </p>
          </div>
        )}

        {/* Booking Section */}
        <div className="glass-panel p-8 mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Y2Prove Class Booking
          </h2>
          <p className="mb-4 text-white/80">
            Select from a variety of math classes and book your slots easily.
            This platform is designed to support learners, teachers, and
            parents.
          </p>
          <ul className="space-y-2 text-white">
            <li>📘 Algebra Crash Course – Mondays 5 PM</li>
            <li>📗 Geometry Fundamentals – Wednesdays 6 PM</li>
            <li>📙 Trigonometry Deep Dive – Fridays 7 PM</li>
          </ul>
          <Button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
            Book a Slot
          </Button>
        </div>

        {/* Explore More Section */}
        <div className="glass-panel p-6">
          <h3 className="text-xl font-semibold text-cyan-400 mb-2">
            Explore More
          </h3>
          <p className="text-white/70">
            Dive into practice quizzes, animated lessons, and track your
            progress. Click on your profile icon to manage your settings and
            view achievements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
