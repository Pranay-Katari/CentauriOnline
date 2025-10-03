"use client";

import dynamic from "next/dynamic";
import "./Iridescence.css";

const Iridescence = dynamic(() => import("./Iridescence"), { ssr: false });
import Head from "next/head";
import { motion } from "framer-motion";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { FaGithub, FaBolt, FaShieldAlt, FaRocket } from "react-icons/fa";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

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
    <main
      className="relative min-h-screen w-screen flex flex-col items-center overflow-x-hidden text-zinc-100
      bg-gradient-to-bl from-[#571845] via-[#c80039] to-[#ffc300]"
    >
      <Head>
        <title>Centauri API – SaaS-Grade Infrastructure</title>
        <meta
          name="description"
          content="Centauri API provides secure, startup-ready infrastructure for developers. Fast, scalable, and easy to integrate."
        />
        <meta property="og:title" content="Centauri API" />
        <meta
          property="og:description"
          content="Fast, secure, and scalable APIs for startups and developers."
        />
      </Head>

      <Iridescence className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none" />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full p-6 flex justify-between items-center z-20 bg-black/10 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <img src="/icon.ico" alt="Centauri Logo" className="w-10 h-10" />
          <h1 className={`${orbitron.className} text-2xl tracking-wider`}>
            Centauri API
          </h1>
        </div>

        <nav className="flex gap-8 text-sm md:text-base">
          <Link href="/apilogin" className="hover:text-yellow-300 transition">
            API Base
          </Link>
          <Link href="/logine" className="hover:text-yellow-300 transition">
            IDE
          </Link>
          <Link
            href="/login"
            className="ml-4 px-5 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors shadow-md"
          >
            Sign Up
          </Link>
        </nav>
      </motion.header>

      <section className="flex flex-col items-center text-center mt-20 px-6 relative z-10">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className={`${orbitron.className} text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
        >
          Fire-Up With {" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500">
            Centauri API
          </span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed mb-10"
        >
          Next-generation infrastructure for developers who move fast. Scale, secure, and launch with confidence — powered by Centauri.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <Link
            href="/apilogin"
            className="px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold text-lg shadow-lg hover:bg-yellow-300 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-full bg-black/30 border border-yellow-300/40 text-white font-semibold text-lg hover:bg-black/40 transition-colors shadow-lg"
          >
            Try IDE
          </Link>
        </motion.div>
      </section>

      <section
        id="features"
        className="relative z-10 max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 text-center"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="bg-black/20 p-6 rounded-xl border border-yellow-300/20 hover:border-yellow-300/40 transition-colors"
        >
          <FaBolt size={36} className="mx-auto text-yellow-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Blazing Fast</h3>
          <p className="text-sm text-gray-200">
            Low-latency endpoints optimized for high-traffic SaaS workloads.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          className="bg-black/20 p-6 rounded-xl border border-yellow-300/20 hover:border-yellow-300/40 transition-colors"
        >
          <FaShieldAlt size={36} className="mx-auto text-yellow-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Enterprise-Grade Security</h3>
          <p className="text-sm text-gray-200">
            Secure authentication and data protection to meet compliance needs.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          className="bg-black/20 p-6 rounded-xl border border-yellow-300/20 hover:border-yellow-300/40 transition-colors"
        >
          <FaRocket size={36} className="mx-auto text-yellow-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Built to Scale</h3>
          <p className="text-sm text-gray-200">
            Elastic infrastructure that grows with your startup or SaaS platform.
          </p>
        </motion.div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-4 mt-24 mb-20"
      >
        <p className="text-lg font-medium">Open Source & Community Driven</p>
    
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full text-center text-gray-100/80 text-sm relative z-10"
      >
        © {new Date().getFullYear()} Centauri API. All rights reserved.
      </motion.footer>
      <p>By Pranay Katari</p>
    </main>
  );
}
