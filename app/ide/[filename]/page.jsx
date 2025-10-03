"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@heroui/button";

const supabase = createClient(
  "https://vtghvkppmfbjukzsutuq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Z2h2a3BwbWZianVrenN1dHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDE0MjYsImV4cCI6MjA3MzQxNzQyNn0.pSTf8F2iYGZOBNkbxdaeayf3Js2pIXmYdtnqaY5U0Pk"
);

const API_BASE = "https://rendercode-rm8x.onrender.com";

async function executeCode(language, code) {
  const res = await fetch(`${API_BASE}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code }),
  });

  if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);

  return res.json();
}

// === STARTER CODE TEMPLATES ===
const STARTER_CODE = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b, c; 
    cin >> a >> b >> c;
    cout << "The sum of these three numbers is " << a + b + c << "\\n";
    return 0;
}`,
  python: `a, b, c = map(int, input().split())
print("The sum of these three numbers is", a + b + c)`,
  javascript: `// JavaScript starter code
const input = require('fs').readFileSync(0, 'utf-8').trim().split(' ').map(Number);
const [a, b, c] = input;
console.log("The sum of these three numbers is", a + b + c);`,
  java: `// Java starter code
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println("The sum of these three numbers is " + (a + b + c));
    }
}`,
};

export default function IDEPage() {
  const { filename } = useParams();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const editorRef = useRef(null);

  // === Load file from Supabase ===
  useEffect(() => {
    const loadFile = async () => {
      const { data } = await supabase
        .from("files")
        .select("*")
        .eq("filename", filename)
        .maybeSingle();

      if (!data) {
        alert("File not found!");
        router.push("/ide_dashboard");
        return;
      }

      // If file is empty, use starter template for that language
      if (!data.content || data.content.trim() === "") {
        const starter = STARTER_CODE[data.language] || "";
        data.content = starter;

        // Save starter into DB (so it's persisted)
        await supabase
          .from("files")
          .update({ content: starter })
          .eq("id", data.id);
      }

      setFile(data);
    };

    loadFile();
  }, [filename, router]);

  // === Save file to DB ===
  const handleSave = async () => {
    if (!file) return;
    setSaving(true);

    const content = editorRef.current?.getValue() || "";

    const { error } = await supabase
      .from("files")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", file.id);

    setSaving(false);

    if (error) {
      alert("Error saving file!");
      console.error(error);
    } else {
      alert("✅ Saved!");
      setFile({ ...file, content });
    }
  };

  // === Run code through backend ===
  const handleRun = async () => {
    if (!file) return;
    const code = editorRef.current?.getValue() || "";

    setLoading(true);
    setOutput("");

    try {
      const result = await executeCode(file.language, code);
      const runResult =
        result.run?.output || result.run?.stdout || result.run?.stderr || "";
      setOutput(runResult);
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!file)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
        Loading file...
      </div>
    );

  return (
    <main className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/80 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            color="secondary"
            variant="flat"
            onClick={() => router.push("/ide_dashboard")}
          >
            ← Dashboard
          </Button>
          <h1 className="text-xl font-bold tracking-wide">{file.filename}</h1>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={handleRun}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4"
            disabled={loading}
          >
            {loading ? "Running..." : "Run"}
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* CODE EDITOR */}
        <div className="w-2/3 h-full">
          <Editor
            height="100%"
            language={file.language}
            value={file.content || ""}
            theme="vs-dark"
            options={{
              fontSize: 14,
              smoothScrolling: true,
              minimap: { enabled: true },
              automaticLayout: true,
            }}
            onMount={(editor) => (editorRef.current = editor)}
          />
        </div>

        {/* OUTPUT CONSOLE */}
        <div className="w-1/3 h-full bg-black border-l border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-md font-semibold border-b border-gray-700 pb-2 mb-4">
            Console Output
          </h2>

          <div className="h-[calc(100%-3rem)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" />
                Running your code...
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-green-300 bg-black/50 p-3 rounded-md">
                {output}
              </pre>
            ) : (
              <p className="text-gray-500 italic">
                Run your code to see output here.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
