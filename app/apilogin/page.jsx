"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Orbitron } from "next/font/google";
import { Button } from "@heroui/button";
import { FcGoogle } from "react-icons/fc";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

const supabase = createClient(
  "https://vtghvkppmfbjukzsutuq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Z2h2a3BwbWZianVrenN1dHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDE0MjYsImV4cCI6MjA3MzQxNzQyNn0.pSTf8F2iYGZOBNkbxdaeayf3Js2pIXmYdtnqaY5U0Pk"
);

export default function ApiLoginPage() {
  const redirect = "/api/docs";

  const [authForm, setAuthForm] = useState({ email: "", password: "", confirm: "" });
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.replace(redirect);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) window.location.replace(redirect);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [redirect]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) throw error;
        window.location.replace(redirect);
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
        redirectTo: `${window.location.origin}${redirect}`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <main className="h-screen w-screen flex bg-gradient-to-bl from-[#571845] via-[#c80039] to-[#ffc300] text-white">
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-black/50 backdrop-blur-md p-12">
        <h1
          className={`${orbitron.className} text-6xl tracking-wide drop-shadow-[0_0_25px_#ffc300]`}
        >
          CENTUARI API
        </h1>
        <p className="text-lg text-gray-300 max-w-md text-center mt-6">
          Secure and scalable APIs for your next-generation projects.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-black/70 p-8">
        <div className="bg-black/80 p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {authMode === "login" ? "Login to API Docs" : "Create an API Account"}
          </h2>

          <Button
            onPress={handleGoogleLogin}
            variant="flat"
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium mb-6 hover:bg-gray-100"
          >
            <FcGoogle size={22} /> Continue with Google
          </Button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="px-3 text-sm text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => setAuthForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full mb-3 p-3 rounded-lg bg-black/30 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))}
            className="w-full mb-3 p-3 rounded-lg bg-black/30 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {authMode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={authForm.confirm}
              onChange={(e) => setAuthForm((p) => ({ ...p, confirm: e.target.value }))}
              className="w-full mb-3 p-3 rounded-lg bg-black/30 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          )}

          <Button
            color="primary"
            onPress={handleAuth}
            className="w-full mb-3"
            isDisabled={loading}
          >
            {loading
              ? "Processing..."
              : authMode === "login"
              ? "Login"
              : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-400">
            {authMode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setAuthMode("signup")}
                  className="text-yellow-400 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setAuthMode("login")}
                  className="text-yellow-400 hover:underline"
                >
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
