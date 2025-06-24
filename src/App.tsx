import "@/firebase";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Pages
import Index from "./pages/Index"; // Home before login
import Login from "./pages/Login";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import About from "./pages/About"; // ✅ Always show this page
import NotFound from "./pages/NotFound";
import Main from "./pages/Main"; // Dashboard after login
import ProfilePage from "./pages/ProfilePage";
import EmpowerXInfo from "./pages/EmpowerXInfo";

// Components
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen relative overflow-hidden">
            <Navigation />
            <Routes>
              {/* Home - dynamic based on login status */}
              <Route path="/" element={user ? <Main /> : <Index />} />
              <Route path="/home" element={user ? <Main /> : <Index />} />

              {/* ✅ About should always be public and static */}
              <Route path="/about" element={<About />} />

              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes */}
              <Route path="/main" element={<ProtectedRoute><Main /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/empowerx" element={<ProtectedRoute><EmpowerXInfo /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
