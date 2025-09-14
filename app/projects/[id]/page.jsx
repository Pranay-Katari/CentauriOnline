"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import Editor from "@monaco-editor/react";
import { executeCode } from "../../components/api"; 

const supabase = createClient(
    "https://vtghvkppmfbjukzsutuq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Z2h2a3BwbWZianVrenN1dHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDE0MjYsImV4cCI6MjA3MzQxNzQyNn0.pSTf8F2iYGZOBNkbxdaeayf3Js2pIXmYdtnqaY5U0Pk"
  );
export default function IDE() {
  const editorRef = useRef(null);
  const [projectId, setProjectId] = useState(null);
  const [tree, setTree] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [output, setOutput] = useState("");
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, node: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("file");
  const [newName, setNewName] = useState("");
  const [terminalHeight, setTerminalHeight] = useState(150);
  const isDragging = useRef(false);

  useEffect(() => {
    const init = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data: projects } = await supabase.from("projects").select("id").eq("user_id", user.id).limit(1);
      if (projects && projects.length > 0) {
        setProjectId(projects[0].id);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!projectId) return;
    const loadTree = async () => {
      const { data: folders } = await supabase.from("folders").select("*").eq("project_id", projectId);
      const { data: items } = await supabase.from("project_items").select("*").eq("project_id", projectId);

      const buildTree = (parentId = null) => [
        ...folders.filter(f => f.parent_id === parentId).map(f => ({
          ...f, type: "folder", children: buildTree(f.id)
        })),
        ...items.filter(i => i.parent_id === parentId).map(i => ({
          ...i, type: "file"
        }))
      ];
      setTree(buildTree());
    };
    loadTree();
  }, [projectId]);

  const handleSave = async () => {
    if (!activeFile) return;
    const content = editorRef.current?.getValue?.();
    await supabase.from("project_items")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", activeFile.id);
    alert("Saved!");
  };

  const runCode = async () => {
    if (!activeFile) return;
    const code = editorRef.current?.getValue?.();
    const result = await executeCode(activeFile.language, code);
    const runResult = result.run || {};
    setOutput(runResult.output || runResult.stdout || runResult.stderr || "No output.");
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    if (modalType === "file") {
      await supabase.from("project_items").insert({
        project_id: projectId,
        parent_id: contextMenu.node?.id || null,
        name: newName,
        type: "file",
        content: "",
        language: "javascript"
      });
    } else {
      await supabase.from("folders").insert({
        project_id: projectId,
        parent_id: contextMenu.node?.id || null,
        name: newName
      });
    }
    setModalOpen(false);
    setNewName("");
    setContextMenu({ ...contextMenu, visible: false });
    const { data: folders } = await supabase.from("folders").select("*").eq("project_id", projectId);
    const { data: items } = await supabase.from("project_items").select("*").eq("project_id", projectId);
    const buildTree = (parentId = null) => [
      ...folders.filter(f => f.parent_id === parentId).map(f => ({ ...f, type: "folder", children: buildTree(f.id) })),
      ...items.filter(i => i.parent_id === parentId).map(i => ({ ...i, type: "file" }))
    ];
    setTree(buildTree());
  };

  const handleDelete = async (node) => {
    if (node.type === "file") {
      await supabase.from("project_items").delete().eq("id", node.id);
    } else {
      await supabase.from("folders").delete().eq("id", node.id);
    }
    setContextMenu({ ...contextMenu, visible: false });
    setTree(prev => prev.filter(n => n.id !== node.id));
  };

  const renderNode = (node) => (
    <div
      key={node.id}
      onClick={() => node.type === "file" && setActiveFile(node)}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.pageX, y: e.pageY, node });
      }}
      className={`px-2 py-1 rounded cursor-pointer text-sm ${
        activeFile?.id === node.id ? "bg-yellow-500 text-black font-bold" : "hover:bg-yellow-500/20"
      }`}
    >
      {node.type === "folder" ? "📂" : "📄"} {node.name}
      {node.children && <div className="ml-4">{node.children.map(renderNode)}</div>}
    </div>
  );

  const handleMouseDown = useCallback(() => { isDragging.current = true; }, []);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const windowHeight = window.innerHeight;
      const offsetFromBottom = windowHeight - e.clientY;
      const clamped = Math.max(100, Math.min(offsetFromBottom, windowHeight - 200));
      setTerminalHeight(clamped);
    };
    const handleMouseUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <main className="h-screen w-screen flex flex-col bg-gradient-to-bl from-[#571845] via-[#c80039] to-[#ffc300] text-white">
      <header className="p-4 flex justify-between items-center bg-black/60 border-b border-gray-700">
        <h1 className="text-2xl font-bold">CENTUARI IDE</h1>
        {activeFile && (
          <button onClick={handleSave} className="px-4 py-1 bg-green-500 rounded">Save</button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-black/50 p-3 text-sm">
          <h2 className="uppercase text-gray-400 mb-2">Explorer</h2>
          {tree.map(renderNode)}
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {activeFile ? (
              <Editor
                height="100%"
                theme="vs-dark"
                defaultLanguage={activeFile.language || "javascript"}
                value={activeFile.content}
                onMount={(editor) => (editorRef.current = editor)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Open a file to start editing</div>
            )}
          </div>

          <div
            className="h-1.5 bg-white/10 hover:bg-blue-400/50 cursor-row-resize"
            onMouseDown={handleMouseDown}
          />

          <div style={{ height: terminalHeight }} className="bg-black/70 p-2 font-mono text-green-400 text-sm overflow-auto">
            <button onClick={runCode} className="bg-green-500 text-black px-2 py-1 rounded mb-2">Run ▶</button>
            <div>{output}</div>
          </div>
        </div>
      </div>

      {contextMenu.visible && (
        <div
          className="absolute bg-black/90 border border-gray-700 rounded shadow-lg text-sm z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={() => setContextMenu({ ...contextMenu, visible: false })}
        >
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => { setModalType("file"); setModalOpen(true); }}>➕ New File</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => { setModalType("folder"); setModalOpen(true); }}>📂 New Folder</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleDelete(contextMenu.node)}>🗑 Delete</div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg w-96 border border-gray-700">
            <h2 className="text-lg font-bold mb-4">New {modalType}</h2>
            <input
              type="text"
              placeholder={`Enter ${modalType} name`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-black/30 border border-gray-600 text-white"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="px-3 py-1 bg-gray-600 rounded">Cancel</button>
              <button onClick={handleAdd} className="px-3 py-1 bg-yellow-500 text-black rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
