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
const setupLoginScene = (scene: any, camera: any, renderer: any) => {
    if (!window.THREE) return;

    // Enhanced particle system
    const particleGeometry = new window.THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
      
      // Color variations for educational theme
      const color = new window.THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new window.THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new window.THREE.PointsMaterial({
      size: 0.8,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: window.THREE.AdditiveBlending,
    });

    const particles = new window.THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Floating geometric shapes with education theme
    const shapes = [];
    const geometries = [
      new window.THREE.TetrahedronGeometry(1.5),
      new window.THREE.OctahedronGeometry(1.2),
      new window.THREE.IcosahedronGeometry(1),
      new window.THREE.DodecahedronGeometry(0.8),
    ];

    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new window.THREE.MeshPhongMaterial({
        color: new window.THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6),
        transparent: true,
        opacity: 0.7,
        emissive: new window.THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.4, 0.1),
      });
      
      const shape = new window.THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      shapes.push(shape);
      scene.add(shape);
    }

    // Enhanced lighting system
    const ambientLight = new window.THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambientLight);

    const directionalLight = new window.THREE.DirectionalLight(0x0EA5E9, 1.5);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight1 = new window.THREE.PointLight(0xF59E0B, 1, 50);
    pointLight1.position.set(-20, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new window.THREE.PointLight(0x3B82F6, 0.8, 30);
    pointLight2.position.set(20, -10, -10);
    scene.add(pointLight2);

    camera.position.z = 20;

    // Enhanced mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Camera movement based on mouse
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Enhanced animation loop
    const animate = () => {
      const time = Date.now() * 0.001;

      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + positions[i] * 0.01) * 0.02;
        if (positions[i] > 50) positions[i] = -50;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.002;

      // Animate shapes with more complex motion
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 * (index % 3 + 1);
        shape.rotation.y += 0.015 * (index % 2 + 1);
        shape.rotation.z += 0.008 * (index % 4 + 1);
        
        // Floating motion
        shape.position.y += Math.sin(time * 2 + index) * 0.05;
        shape.position.x += Math.cos(time * 1.5 + index) * 0.03;
      });

      // Animate lights
      pointLight1.position.x = Math.sin(time * 0.7) * 25;
      pointLight1.position.y = Math.cos(time * 0.5) * 15;
      
      pointLight2.position.x = Math.cos(time * 0.9) * 20;
      pointLight2.position.z = Math.sin(time * 0.6) * 25;

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  };
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
        <ThreeScene onSceneReady={setupLoginScene} />
      </div>
      <div className="absolute inset-0 z-5 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-blue-500/10 to-transparent">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="p-8 animate-slide-in backdrop-blur-md bg-black/40 border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.05)] rounded-xl">

          

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
              <Button variant="outline" className="bg-white text-black hover:bg-gray-200 transition-colors font-semibold"
              onClick={() => handleSocialLogin("google")}>Google</Button>
              <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
              onClick={() => handleSocialLogin("facebook")}>Facebook</Button>
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
