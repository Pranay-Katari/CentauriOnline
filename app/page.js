"use client";

import Link from "next/link";
import { Orbitron } from "next/font/google";
import { FaGithub, FaBook } from "react-icons/fa";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

export default function HomePage() {
  return (
    <main className="h-screen w-screen flex flex-col items-center justify-between bg-gradient-to-bl from-[#571845] via-[#c80039] to-[#ffc300] text-zinc-100">
      <header className="w-full p-5 flex justify-center">
        
      </header>

      <h1
          className={`${orbitron.className} text-6xl tracking-wide drop-shadow-[0_0_25px_#ffc300]`}
        >
          CENTUARI IDE
        </h1>
      <section className="flex flex-col items-center text-center px-6">
        <p className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed mb-6">
          An in-development, next-generation cloud IDE. Build, run, and collaborate on projects
          anywhere — with the speed and power of modern development tools.
        </p>
        <Link
          href="/login"
          className="px-8 py-3 bg-yellow-400 text-black rounded-xl font-bold text-lg hover:scale-105 hover:bg-yellow-300 transition-transform shadow-lg"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="w-full flex justify-center gap-6 pb-6 text-gray-200">
        <a
          href="https://github.com/Pranay-Katari/CentauriOnline"
          target="_blank"
          className="flex items-center gap-2 hover:text-yellow-300 transition"
        >
          <FaGithub /> GitHub
        </a>
      </footer>
    </main>
  );
}
