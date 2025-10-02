"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Orbitron } from "next/font/google";
import { Button } from "@heroui/button";
import { FcGoogle } from "react-icons/fc";
import dynamic from "next/dynamic";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });
const Waves = dynamic(() => import("../Waves"), { ssr: false });


const supabase = createClient(
  "https://vtghvkppmfbjukzsutuq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Z2h2a3BwbWZianVrenN1dHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDE0MjYsImV4cCI6MjA3MzQxNzQyNn0.pSTf8F2iYGZOBNkbxdaeayf3Js2pIXmYdtnqaY5U0Pk"
);

export default function LoginPage() {
  const router = useRouter();
  const [authForm, setAuthForm] = useState({ email: "", password: "", confirm: "" });
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push("/dashboard");
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) router.push("/dashboard");
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) throw error;
      } else {
        if (authForm.password !== authForm.confirm) {
          throw new Error("Passwords do not match.");
        }
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) throw error;
        alert("Signup successful! Please check your email.");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // after login
      },
    });
    if (error) alert(error.message);
  };

  return (
      <main className="relative h-screen w-screen flex items-center justify-center overflow-hidden text-white">
        {/* Gradient background behind Waves */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#571845] via-[#c80039] to-[#ffc300] -z-20" />
  
        {/* Waves overlay for dynamic animated effect */}
        <Waves
          lineColor="rgba(255,255,255,0.2)"
          backgroundColor="transparent"
          className="absolute inset-0 -z-10"
        />
  
        {/* Left branding panel */}
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 p-12 bg-black/20 backdrop-blur-md relative z-10">
          <h1 className={`${orbitron.className} text-6xl font-bold tracking-wide drop-shadow-[0_0_25px_#fffff]`}>
            CENTAURI API
          </h1>
          <img src="/icon.ico" alt="Centauri API Logo" className="relative w-32 h-32" />
          <p className="text-lg text-gray-100 max-w-md text-center mt-6 leading-relaxed">
            Scalable and secure APIs to power your next startup idea.  
            Join the future of developer-first infrastructure.
          </p>
        </div>
  
        {/* Right login panel */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 relative z-10">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {authMode === "login" ? "Login to Your Account" : "Create a Startup Account"}
            </h2>
  
            {/* Google Login */}
            <Button
    onPress={handleGoogleLogin}
    variant="flat"
    className="
      w-full flex items-center justify-center gap-3
      bg-white text-gray-800 font-medium
      py-3 rounded-full
      shadow-md border border-gray-200
      hover:bg-gray-100 hover:shadow-lg
      transition-all duration-200 ease-in-out
      active:scale-95
    "
  >
    <FcGoogle size={24} />
    <span className="font-semibold">Sign in with Google</span>
  </Button>
  
            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-400/40" />
              <span className="px-3 text-sm text-gray-200">or</span>
              <div className="flex-grow border-t border-gray-400/40" />
            </div>
  
            {/* Auth Inputs */}
            <input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) => setAuthForm(p => ({ ...p, email: e.target.value }))}
              className="w-full mb-3 p-3 rounded-lg bg-black/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(e) => setAuthForm(p => ({ ...p, password: e.target.value }))}
              className="w-full mb-3 p-3 rounded-lg bg-black/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {authMode === "signup" && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={authForm.confirm}
                onChange={(e) => setAuthForm(p => ({ ...p, confirm: e.target.value }))}
                className="w-full mb-3 p-3 rounded-lg bg-black/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            )}
  
            <Button
              color="primary"
              onPress={handleAuth}
              className="w-full mb-3 bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-semibold hover:opacity-90"
              isDisabled={loading}
            >
              {loading ? "Processing..." : authMode === "login" ? "Login" : "Sign Up"}
            </Button>
  
            {/* Auth Mode Toggle */}
            <p className="text-center text-sm text-gray-200">
              {authMode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <button onClick={() => setAuthMode("signup")} className="text-yellow-300 hover:underline">
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setAuthMode("login")} className="text-yellow-300 hover:underline">
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </main>
    );
  }