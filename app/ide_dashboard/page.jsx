"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FiTrash2, FiEdit2, FiPlus } from "react-icons/fi";
import { Button } from "@heroui/button";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

const supabase = createClient(
  "https://vtghvkppmfbjukzsutuq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Z2h2a3BwbWZianVrenN1dHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDE0MjYsImV4cCI6MjA3MzQxNzQyNn0.pSTf8F2iYGZOBNkbxdaeayf3Js2pIXmYdtnqaY5U0Pk"
);
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]); 
  const [newFileName, setNewFileName] = useState("");
  const [newLanguage, setNewLanguage] = useState("python");
  const newID = useRef("");

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // LOAD USER & FILES
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else {
        const loadFiles = async (userId) => {
          const { data } = await supabase
            .from("files")
            .select("id, filename, language, created_at")
            .eq("user_id", userId);
          setFiles(data || []);
        };
        setUser(data.user);
        loadFiles(data.user.id);
      }
    });
  }, [router]);

  // CREATE FILE
  const handleAddFile = async () => {
    if (!user || !newFileName.trim()) return;
    const { data, error } = await supabase
      .from("files")
      .insert([
        {
          user_id: user.id,
          filename: newFileName.trim(),
          language: newLanguage,
          content: "",
        },
      ])
      .select();

    if (!error && data) {
      setFiles([...files, ...data]);
      setNewFileName("");
    }
  };

  // RENAME FILE
  const handleRenameFile = async (fileId, newName) => {
    const { error } = await supabase
      .from("files")
      .update({ filename: newName })
      .eq("id", fileId);
    if (!error)
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, filename: newName } : f)));
  };

  const handleDeleteFile = async (fileId) => {
    const { error } = await supabase.from("files").delete().eq("id", fileId);
    if (!error) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } else {
      console.error("Delete error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#571845] via-[#c80039] to-[#ffc300] text-white px-6 md:px-12 py-10">
      
      <header className="flex items-center justify-between mb-12">
        <Button
            onClick={() => router.push("/")}
            className="bg-black/40 border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-black/60 transition"
          >
            ← Back
          </Button>
        <h1
          className={`${orbitron.className} text-4xl md:text-5xl font-extrabold tracking-wider drop-shadow-[0_0_15px_rgba(255,195,0,0.7)]`}
        >
          CENTAURI IDE
        </h1>

        <Button
          onPress={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          Logout
        </Button>
      </header>

      <div className="bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-5 mb-10 border border-white/10 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
        <input
          className="flex-1 bg-black/40 border border-gray-600 px-4 py-2 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="New file name..."
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
        />
        <select
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          className="bg-black/40 border border-gray-600 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button
          onClick={handleAddFile}
          className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-md flex items-center gap-2 font-medium shadow-md transition"
        >
          <FiPlus /> Create
        </button>
      </div>

      <section className="bg-black/30 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-black/50 text-xs uppercase tracking-wide text-gray-300">
            <tr>
              <th className="px-6 py-3">Filename</th>
              <th className="px-6 py-3">Language</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {files.length > 0 ? (
              files
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3 font-medium">
                      <Link href={`/ide/${file.filename}`} className="hover:underline">
                        {file.filename}
                      </Link>
                    </td>
                    <td className="px-6 py-3">{file.language}</td>
                    <td className="px-6 py-3 text-sm text-gray-300">
                      {new Date(file.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 flex justify-end gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        const newName = prompt("Enter new filename", file.filename);
                        if (newName) handleRenameFile(file.id, newName);
                      }}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id);
                      }}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-gray-300 text-lg"
                >
                  No files yet. Create one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
