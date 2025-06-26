import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import FloatingMathSymbols from '@/components/FloatingMathSymbols';
import ThreeScene from '@/components/ThreeScene';

const Main = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [slot, setSlot] = useState('');
  const [date, setDate] = useState('');
  const [experience, setExperience] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleBookingSubmit = async () => {
    if (!slot || !date) return alert('Please fill all fields');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        userId: user?.uid,
        name: user?.displayName || 'Anonymous',
        email: user?.email || 'N/A',
        slot,
        date,
        experience,
        timestamp: new Date()
      });
      setSubmitted(true);
      setShowForm(false);
      setSlot('');
      setDate('');
      setExperience('');
    } catch (error) {
      console.error('Booking submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative pt-20 px-6 text-white">
      <FloatingMathSymbols />
      <div className="fixed inset-0 z-0">
        <ThreeScene />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Welcome {user?.displayName || 'User'}
          </h1>
          
        </div>

        {showDetails && (
          <div className="glass-panel p-6 mb-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              User Details
            </h2>
            <p><span className="text-white/80">Name:</span> {user?.displayName}</p>
            <p><span className="text-white/80">Email:</span> {user?.email}</p>
            <p><span className="text-white/80">UID:</span> {user?.uid}</p>
          </div>
        )}

        <div className="glass-panel p-8 mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Y2Prove Class Booking
          </h2>
          <p className="mb-4 text-white/80">
            Select from a variety of math classes and book your slots easily.
          </p>
          <ul className="space-y-2 text-white">
            <li>📘 Algebra Crash Course – Mondays 5 PM</li>
            <li>📗 Geometry Fundamentals – Wednesdays 6 PM</li>
            <li>📙 Trigonometry Deep Dive – Fridays 7 PM</li>
          </ul>
          <Button
            onClick={() => setShowForm(true)}
            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            Book a Slot
          </Button>
        </div>

        {showForm && (
          <div className="glass-panel p-6 mb-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              Booking Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Select Class</label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full p-2 bg-black border border-white rounded"
                >
                  <option value="">-- Choose a class --</option>
                  <option>Algebra Crash Course</option>
                  <option>Geometry Fundamentals</option>
                  <option>Trigonometry Deep Dive</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 bg-black border border-white rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Prior Experience (optional)</label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2 bg-black border border-white rounded"
                />
              </div>
              <Button
                onClick={handleBookingSubmit}
                disabled={submitting}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {submitting ? 'Submitting...' : 'Submit Booking'}
              </Button>
            </div>
          </div>
        )}

        {submitted && (
          <div className="text-center text-green-400 font-semibold mt-4">
            Booking submitted successfully! You’ll receive a confirmation soon.
          </div>
        )}

        <div className="glass-panel p-6 mt-10">
          <h3 className="text-xl font-semibold text-cyan-400 mb-2">
            Explore More
          </h3>
          <p className="text-white/70">
            Dive into practice quizzes, animated lessons, and track your progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
