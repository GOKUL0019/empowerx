// src/pages/Login.tsx
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import ThreeScene from "@/components/ThreeScene";
import FloatingMathSymbols from "@/components/FloatingMathSymbols";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, googleProvider } from '@/firebase';
import { useToast } from "@/hooks/use-toast";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState(searchParams.get("role") || "learner");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (email && password) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          toast({
            title: "Login Successful!",
            description: `Welcome back to Y2Prove, ${userRole}!`,
          });
          navigate("/main");
        } catch (error: any) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
      }
    } else {
      if (name && email && password) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: name });

          toast({
            title: "Account Created!",
            description: `Welcome to Y2Prove, ${name}! Your ${userRole} account is ready.`,
          });
          navigate("/main");
        } catch (error: any) {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
      }
    }
  };

  const handleSocialLogin = async (type: "google" | "facebook") => {
    try {
      if (type === 'google') {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        toast({
          title: 'Google Login Successful',
          description: `Welcome ${user.displayName || 'User'}!`,
        });

        navigate("/main");
      } else {
        toast({
          title: 'Facebook login not implemented',
          description: 'Please use Google login for now.',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Login Error',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
    }
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case "teacher":
        return "Teacher Portal";
      case "parent":
        return "Parent Dashboard";
      default:
        return "Student Learning Hub";
    }
  };

  const getRoleDescription = () => {
    switch (userRole) {
      case "teacher":
        return isLogin ? "Access your teaching dashboard and student analytics" : "Join our innovative teaching community";
      case "parent":
        return isLogin ? "Monitor and support your child's learning journey" : "Help guide your child's mathematical growth";
      default:
        return isLogin ? "Continue your immersive math learning adventure" : "Begin your journey to mathematical mastery";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
      <FloatingMathSymbols />
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="glass-panel p-8 animate-slide-in backdrop-blur-xl bg-white/5 border-2 border-white/20 shadow-2xl">
          

          <div className="text-center mb-8">
            <h2 className="text-3xl font-space font-bold text-white mb-2">
              {isLogin ? `Welcome Back` : `Join the Future`}
            </h2>
            <h3 className="text-xl text-yellow-400 mb-2 font-medium">{getRoleTitle()}</h3>
            <p className="text-white/80 text-sm leading-relaxed">{getRoleDescription()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </div>

            <Button type="submit" className="w-full h-12 neon-button text-lg font-semibold">
              {isLogin ? "Sign In to Y2Prove" : "Create Account"}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/70 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleSocialLogin("google")}>Google</Button>
              <Button variant="outline" onClick={() => handleSocialLogin("facebook")}>Facebook</Button>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <button onClick={() => setIsLogin(!isLogin)} className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
              {isLogin ? "Don't have an account? Create one now" : "Already have an account? Sign in"}
            </button>
            <div>
              <Link to="/" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
