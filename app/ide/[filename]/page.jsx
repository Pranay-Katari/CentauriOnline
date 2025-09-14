"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@heroui/button";
import { executeCode } from "../../components/api";

const supabase = createClient(
  "https://vtghvkppmfbjukzsutuq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Z2h2a3BwbWZianVrenN1dHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDE0MjYsImV4cCI6MjA3MzQxNzQyNn0.pSTf8F2iYGZOBNkbxdaeayf3Js2pIXmYdtnqaY5U0Pk"
);

export default function IDEPage() {
  const { filename } = useParams();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(""); 
  const editorRef = useRef(null);

  useEffect(() => {
    const loadFile = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("files")
        .select("*")
        .eq("filename", filename)
        .eq("user_id", user.id)
        .single();
      setFile(data);
    };
    loadFile();
  }, [filename, router]);

  const handleSave = async () => {
    const content = editorRef.current?.getValue?.();
    await supabase
      .from("files")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", file.id);
    alert("Saved!");
  };

  const handleRun = async () => {
    const code = editorRef.current?.getValue?.();
    if (!code) return;

    try {
      const result = await executeCode(file.language, code); 
      setOutput(result.run?.output || result.run?.stdout || result.run?.stderr);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  if (!file) return <div className="p-8">Loading...</div>;

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <header className="p-4 flex justify-between items-center bg-black/80 border-b border-gray-700">
        <div className="flex gap-4 items-center">
          <Button
            size="sm"
            color="secondary"
            variant="flat"
            onClick={() => router.push("/dashboard")}
          >
            ← Dashboard
          </Button>
          <h1 className="text-lg font-bold">{file.filename}</h1>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSave} className="bg-green-600 text-white">
            Save
          </Button>
          <Button onClick={handleRun} className="bg-blue-600 text-white">
            Run
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <Editor
          height="100%"
          width="70%"
          theme="vs-dark"
          defaultLanguage={file.language}
          defaultValue={file.content}
          onMount={(editor) => (editorRef.current = editor)}
        />

        <div className="w-1/3 bg-black border-l border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-md font-bold mb-2">Console Output</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-300">
            {output || "Run your code to see output..."}
          </pre>
        </div>
      </div>
    </main>
  );
}
