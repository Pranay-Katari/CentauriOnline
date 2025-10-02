"use client";

import dynamic from "next/dynamic";
import './Iridescence.css';

const Iridescence = dynamic(() => import('./Iridescence'), { ssr: false });
import Head from 'next/head';
import { motion } from "framer-motion";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { FaGithub } from "react-icons/fa";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

export default function ApiLandingPage() {
  return (
    <main className="relative min-h-screen w-screen flex flex-col items-center overflow-x-hidden text-zinc-100
      bg-gradient-to-bl from-[#571845] via-[#c80039] to-[#ffc300]">
      <Head>
      <title>Centauri API – Fast, Secure & Scalable APIs</title>
      <meta
        name="description"
        content="Centauri API provides blazing-fast, secure, and scalable infrastructure for modern developers. Build and launch quickly."
      />
      <meta name="keywords" content="API, Centauri, developer tools, scalable APIs" />
      <meta name="robots" content="index, follow" />
    </Head>
      {/* Animated Iridescence overlay */}
      <Iridescence className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" />

      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full p-6 flex justify-between items-center relative z-10"
      >
        <div className="flex items-center gap-3">
          <img src="/icon.ico" alt="Centauri API Logo" className="w-12 h-12" />
          <h1 className={`${orbitron.className} text-2xl tracking-wider`}>
            Centauri Online
          </h1>
        </div>

        <nav className="flex gap-6 text-sm md:text-base">
          <Link href="/apilogin" className="hover:text-yellow-300 transition">
            API Base
          </Link>
          <Link href="/idepage" className="hover:text-yellow-300 transition">
            IDE
          </Link>
          <Link href="#contact" className="hover:text-yellow-300 transition">
            Contact
          </Link>
        </nav>
      </motion.header>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center mt-20 px-6 relative z-10">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className={`${orbitron.className} text-5xl md:text-7xl font-bold mb-6 drop-shadow-[0_0_20px_#00000080]`}
        >
          Build with the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500">
            Centauri API
          </span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed mb-12"
        >
          Next-generation infrastructure for developers who move fast.  
          Scale, secure, and launch with confidence — powered by Centauri.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <motion.div whileHover={{ scale: 1.05, y: -4 }}>
            <Link
              href="/apilogin"
              className="px-8 py-3 bg-yellow-400 text-black rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-xl"
            >
              API Base (Prototype)
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -4 }}>
            <Link
              href="/idepage"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-400 hover:to-pink-400 transition-colors shadow-xl"
            >
              Go to IDE (v.1)
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* GITHUB CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-4 mt-24 mb-20"
      >
        <p className="text-lg font-medium">Open Source & Community Driven</p>
        <motion.a
          href="https://github.com/Pranay-Katari/CentauriOnline"
          target="_blank"
          whileHover={{ scale: 1.1, rotate: 2 }}
          className="flex items-center gap-3 text-xl font-semibold bg-black/40 px-6 py-3 rounded-full
            shadow-md hover:shadow-yellow-200/40 transition-all"
        >
          <FaGithub size={28} /> Visit GitHub
        </motion.a>
      </motion.div>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full flex justify-center pb-6 text-gray-200 text-sm relative z-10"
      >
        © {new Date().getFullYear()} Centauri API. All rights reserved.
      </motion.footer>
    </main>
  );
}
