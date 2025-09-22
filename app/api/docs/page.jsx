"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Orbitron } from "next/font/google";
import { Button } from "@heroui/button";
import { Copy } from "lucide-react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

export default function ApiDocsPage() {
  const [apiKey, setApiKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = () => {
    const newKey = "centauri_" + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    setCopied(false);
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-bl from-[#571845] via-[#c80039] to-[#ffc300] text-zinc-100">
      <section className="w-full flex flex-col items-center text-center py-24 px-6 relative overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`${orbitron.className} text-5xl md:text-7xl font-bold tracking-wide drop-shadow-[0_0_25px_#00000090]`}
        >
          Centauri API
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed"
        >
          Empower your applications with next-generation cloud infrastructure.  
          Simple, fast, and built for scale.
        </motion.p>
      </section>

      <section className="flex justify-center px-6 -mt-12 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-black/60 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Get Your API Key</h2>
          <p className="text-gray-300 mb-6">
            Generate your personal API key and start integrating today.
          </p>

          {apiKey ? (
            <div className="flex items-center justify-between bg-black/70 px-4 py-3 rounded-lg border border-gray-700">
              <code className="font-mono text-yellow-300 text-sm truncate">
                {apiKey}
              </code>
              <button
                onClick={handleCopy}
                className="ml-3 text-sm hover:text-yellow-400 transition"
              >
                {copied ? "Copied!" : <Copy size={18} />}
              </button>
            </div>
          ) : (
            <Button
              onPress={handleGenerateKey}
              className="px-8 py-3 mt-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold text-lg rounded-xl shadow-lg hover:scale-105 hover:from-yellow-300 hover:to-pink-400 transition-transform"
            >
              Generate API Key
            </Button>
          )}
        </motion.div>
      </section>

      <section className="px-6 md:px-24 mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 text-center"
        >
          API Documentation
        </motion.h2>

        <div className="grid gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-black/50 backdrop-blur-md rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-xl font-semibold mb-3">Authentication</h3>
            <p className="text-gray-300 mb-4">
              Use your API key in the header:
              <code className="bg-black/40 px-1 py-0.5 rounded ml-2">
                Authorization
              </code>
            </p>
            <pre className="bg-black/70 p-4 rounded-lg text-sm text-yellow-300 overflow-x-auto">
{`curl -H "Authorization: Bearer YOUR_API_KEY" https://api.centauri.dev/v1/projects`}
            </pre>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-black/50 backdrop-blur-md rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-xl font-semibold mb-3">Get Projects</h3>
            <p className="text-gray-300 mb-4">
              Retrieve all your active projects.
            </p>
            <pre className="bg-black/70 p-4 rounded-lg text-sm text-yellow-300 overflow-x-auto">
{`GET https://api.centauri.dev/v1/projects`}
            </pre>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-black/50 backdrop-blur-md rounded-2xl shadow-lg p-8 md:col-span-2"
          >
            <h3 className="text-xl font-semibold mb-3">Create Project</h3>
            <p className="text-gray-300 mb-4">
              Start a new project by posting JSON data.
            </p>
            <pre className="bg-black/70 p-4 rounded-lg text-sm text-yellow-300 overflow-x-auto">
{`POST https://api.centauri.dev/v1/projects

{
  "name": "My Project",
  "description": "Test project using Centauri API"
}`}
            </pre>
          </motion.div>
        </div>
      </section>

      <footer className="w-full text-center py-6 text-gray-300 text-sm border-t border-white/20">
        © {new Date().getFullYear()} Centauri API. Built for developers.
      </footer>
    </main>
  );
}
