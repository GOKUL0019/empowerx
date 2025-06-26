// src/components/Navigation.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const storedImage = localStorage.getItem(`profileImage-${currentUser.uid}`);
        const fallback = `https://api.dicebear.com/7.x/thumbs/svg?seed=${currentUser.uid}`;
        const photo = currentUser.photoURL || fallback;
        setProfileImage(storedImage || photo);
      } else {
        setUser(null);
        setProfileImage("");
      }
    });

    return () => unsubscribe();
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Team", path: "/team" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="relative z-50 glass-panel bg-[rgba(146, 163, 203, 0.7)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/lovable-uploads/ad581c1b-cb17-4239-908e-832272027cb1.png"
              alt="Y2Prove Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-white font-space font-bold text-xl">Y2Prove</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-white hover:text-yellow-400 transition-colors duration-300 font-medium ${
                  location.pathname === item.path ? "text-yellow-400" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            {!user ? (
              <Link
                to="/login"
                className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <div onClick={() => navigate("/profile")} className="cursor-pointer">
                  <Avatar className="cursor-pointer ring-2 ring-blue-400 ring-offset-2 ring-offset-blue-200 transition duration-300">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                      {user.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-white hover:text-yellow-400 transition-colors duration-300 font-medium ${
                    location.pathname === item.path ? "text-yellow-400" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
                >
                  Login
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(false);
                    }}
                    className="cursor-pointer ring-2 ring-blue-400 ring-offset-2 ring-offset-blue-200 transition duration-300"
                  >
                    <AvatarImage src={profileImage} />
                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                      {user.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
