"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { FaRocket, FaLock, FaServer } from "react-icons/fa";
import { FaGithub, FaBook } from "react-icons/fa";


const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

export default function ApiLandingPage() {
  return (
    <main className="min-h-screen w-screen flex flex-col items-center bg-gradient-to-bl from-[#571845] via-[#c80039] to-[#ffc300] text-zinc-100 overflow-x-hidden">
      <header className="w-full p-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <img src="/icon.ico" alt="Centauri API Logo" className="w-12 h-12" />
          <h1 className={`${orbitron.className} text-2xl tracking-wider`}>
            Centauri Online
          </h1>
        </motion.div>

        <nav className="flex gap-6 text-sm md:text-base">
          <Link href="#features" className="hover:text-yellow-300 transition">
            Features
          </Link>
          <Link href="/apilogin" className="hover:text-yellow-300 transition">
            API Base (Prototype)
          </Link>
          <Link href="#contact" className="hover:text-yellow-300 transition">
            Contact
          </Link>
        </nav>
      </header>

      <section className="flex flex-col items-center text-center mt-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`${orbitron.className} text-5xl md:text-7xl font-bold mb-6 drop-shadow-[0_0_20px_#00000080]`}
        >
          Build with the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500">
            Centauri API
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed mb-12"
        >
          Next-generation infrastructure for developers who move fast.  
          Scale, secure, and launch with confidence — powered by Centauri.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <Link
            href="/apilogin"
            className="px-8 py-3 bg-yellow-400 text-black rounded-xl font-bold text-lg hover:scale-105 hover:bg-yellow-300 transition-transform shadow-lg"
          >
            API Base (Prototype)
          </Link>
          <Link
            href="/idepage"
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:scale-105 hover:from-purple-400 hover:to-pink-400 transition-transform shadow-lg"
          >
            Go to IDE (v.1)
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 text-gray-200 text-sm"
        >
        </motion.p>
      </section>

      <section
        id="features"
        className="grid grid-cols-1 md:grid-cols-3 gap-10 px-12 py-24 w-full"
      >
        {[
          {
            icon: <FaRocket size={40} />,
            title: "Blazing Fast",
            desc: "Low-latency API responses for seamless integrations.",
          },
          {
            icon: <FaLock size={40} />,
            title: "Secure",
            desc: "Enterprise-grade authentication and data encryption.",
          },
          {
            icon: <FaServer size={40} />,
            title: "Scalable",
            desc: "Designed to handle millions of requests reliably.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-black/30 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform"
          >
            <div className="text-yellow-300 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-200">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      
      <a
          href="https://github.com/Pranay-Katari/CentauriOnline"
          target="_blank"
          className="flex items-center gap-2 hover:text-yellow-300 transition"
        >
          <FaGithub /> GitHub
        </a>
        <a></a>
      <footer className="w-full flex justify-center pb-6 text-gray-200 text-sm">
        © {new Date().getFullYear()} Centauri API. All rights reserved.
        
      </footer>
    </main>
  );
}
