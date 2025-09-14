"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
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
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState("files");

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [newFileName, setNewFileName] = useState("");
  const [newLanguage, setNewLanguage] = useState("javascript");
  const [newFileType, setNewFileType] = useState("code");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else {
        setUser(data.user);
        loadFiles(data.user.id);
        loadProjects(data.user.id);
      }
    });
  }, [router]);

  const loadFiles = async (userId) => {
    const { data } = await supabase
      .from("files")
      .select("id, filename, language, file_type, created_at")
      .eq("user_id", userId);
    setFiles(data || []);
  };

  const loadProjects = async (userId) => {
    const { data } = await supabase
      .from("projects")
      .select("id, name, description, created_at")
      .eq("user_id", userId);
    setProjects(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleAddFile = async () => {
    if (!user || !newFileName.trim()) return;
    const { data, error } = await supabase
      .from("files")
      .insert([
        {
          user_id: user.id,
          filename: newFileName,
          language: newLanguage,
          file_type: newFileType,
          content: "",
        },
      ])
      .select();
    if (!error && data) {
      setFiles([...files, ...data]);
      setNewFileName("");
      setIsFileModalOpen(false);
    } else console.error(error);
  };

  const handleAddProject = async () => {
    if (!user || !newProjectName.trim()) return;
    const { data, error } = await supabase
      .from("projects")
      .insert([{ user_id: user.id, name: newProjectName, description: newProjectDesc }])
      .select();
    if (!error && data) {
      setProjects([...projects, ...data]);
      setNewProjectName("");
      setNewProjectDesc("");
      setIsProjectModalOpen(false);
    } else console.error(error);
  };

  return (
    <main className="flex flex-col items-center text-white bg-gradient-to-br from-[#571845] via-[#c80039] to-[#ffc300] min-h-screen">
      <header className="w-full py-6 flex flex-col items-center">
      <h1 className={`${orbitron.className} text-6xl mb-8 drop-shadow-[0_0_15px_#ffc300]`}>
        CENTUARI IDE
      </h1>
        
        <nav className="flex justify-between w-full max-w-6xl items-center mt-6 px-6">
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-yellow-400 shadow-lg hover:scale-105 transition"
          >
            ← Home
          </button>

          <div className="flex gap-4">
            {view === "files" ? (
              <button
                onClick={() => setIsFileModalOpen(true)}
                className="px-5 py-2 rounded-xl font-bold bg-green-500 shadow-lg hover:scale-105 transition"
              >
                ＋ New File
              </button>
            ) : (
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="px-5 py-2 rounded-xl font-bold bg-indigo-500 shadow-lg hover:scale-105 transition"
              >
                ＋ New Project
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 shadow-lg hover:scale-105 transition"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <div className="flex gap-6 mb-10 mt-4">
        <button
          onClick={() => setView("files")}
          className={`px-6 py-2 rounded-lg text-lg ${
            view === "files"
              ? "bg-yellow-400 text-black font-bold"
              : "bg-black/40 hover:bg-black/60"
          }`}
        >
          Files
        </button>
        <button
          onClick={() => setView("projects")}
          className={`px-6 py-2 rounded-lg text-lg ${
            view === "projects"
              ? "bg-yellow-400 text-black font-bold"
              : "bg-black/40 hover:bg-black/60"
          }`}
        >
          Projects (Beta)
        </button>
      </div>

      <section className="w-full max-w-6xl gap-8">
        {view === "files"
          ? files.length > 0
            ? files.map((file) => (
                <Link key={file.id} href={`/ide/${file.filename}`}>
                  <div className="p-6 bg-black/40 rounded-2xl shadow-xl hover:bg-black/60 hover:scale-105 transition cursor-pointer">
                    <h2 className="text-xl font-bold">{file.filename}</h2>
                    <p className="text-sm text-gray-300 mt-2">
                      Language: {file.language}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {file.file_type} • {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))
            : <p className="col-span-full text-center text-lg">No files yet</p>
          : projects.length > 0
          ? projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="p-6 bg-black/40 rounded-2xl shadow-xl hover:bg-black/60 hover:scale-105 transition cursor-pointer text-center">
                  <h2 className="text-xl font-bold">{project.name}</h2>
                  <p className="text-sm text-gray-300 mt-2">
                    {project.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created • {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))
          : <p className="col-span-full text-center text-lg">No projects yet</p>}
      </section>

      {isFileModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl w-96 p-6 shadow-2xl">
            <h2 className="font-bold text-lg mb-4">Create a New File</h2>
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Filename"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded mb-3"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="typescript">TypeScript</option>
            </select>
            <select
              className="w-full p-2 border rounded mb-3"
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value)}
            >
              <option value="code">Code</option>
              <option value="text">Text</option>
              <option value="markdown">Markdown</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFile}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl w-96 p-6 shadow-2xl">
            <h2 className="font-bold text-lg mb-4">Create a New Project</h2>
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Description"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
