"use client";

import { Orbitron } from "next/font/google";
import { useState ,useRef, useEffect, useCallback} from "react";
import Editor from "@monaco-editor/react";
import { executeCode } from "./components/api";
import {Button, ButtonGroup} from "@heroui/button";




export const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

export default function IDE() {
  const editorRef = useRef(null);
  const [files, setFiles] = useState({
    "index.js": `// index.js\nconsole.log("Hello from index.js");`,
  });
  const [dbFiles, setDbFiles] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(150);
  const [activeFile, setActiveFile] = useState("index.js");
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");

  const handleCodeChange = (value) => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: value || "",
    }));
  };

  const handleLoadFiles = async () => {
    const res = await fetch("/api/load");
    const data = await res.json();
    setDbFiles(data);
    setDropdownVisible(true);
  };
  
  const handleImportFile = (file) => {
    setFiles((prev) => ({
      ...prev,
      [file.filename]: file.content,
    }));
    setActiveFile(file.filename);
    setSelectedLanguage(file.language);
    setDropdownVisible(false);
  };
  

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    file: null,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || dragType.current !== "horizontal") return;
  
      const windowHeight = window.innerHeight;
      const offsetFromBottom = windowHeight - e.clientY;
      const clampedHeight = Math.max(100, Math.min(offsetFromBottom, windowHeight - 200));
  
      setTerminalHeight(clampedHeight);
    };
  
    const handleMouseUp = () => {
      isDragging.current = false;
      dragType.current = "";
    };
  
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  // Run the active file
  const [isRunning, setIsRunning] = useState(false);
  const isDragging = useRef(false);
  const dragType = useRef("");

  const handleMouseDown = useCallback(
    (type) => (e) => {
      isDragging.current = true;
      dragType.current = type;
      e.preventDefault();
    },
    []
  );

  const detectLanguage = (fileName) => {
    const ext = fileName.split(".").pop();
    switch (ext) {
      case "js":
        return "javascript";
      case "py":
        return "python";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      case "c":
        return "c";
      case "ts":
        return "typescript";
    }
  };

  useEffect(() => {
    if (activeFile) {
      setSelectedLanguage(detectLanguage(activeFile));
    }
  }, [activeFile]);

  const handleFileClick = (file) => {
    setActiveFile(file);
    if (!openTabs.includes(file)) {
      setOpenTabs((prev) => [...prev, file]);
    }
  };

  const runCode = async () => {
    const code = editorRef.current?.getValue?.();
    if (!code) {
      setOutput("Please select a language and write some code.");
      return;
    }

    try {
      setIsRunning(true);
      const result = await executeCode(selectedLanguage, code);
      const runResult = result.run || {};
      const finalOutput =
        runResult.output ||
        runResult.stdout ||
        runResult.stderr ||
        "No output.";

      setOutput(finalOutput);
    } catch (error) {
      setOutput("Execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  const addFile = () => {
    const fileName = prompt("Enter file name (e.g., newFile.js):");
    if (fileName && !files[fileName]) {
      setFiles((prev) => ({ ...prev, [fileName]: `// ${fileName}\n` }));
      setActiveFile(fileName);
      setSelectedLanguage(detectLanguage(fileName));
    }
  };

  return (
    <main className="h-screen w-screen flex flex-col bg-gradient-to-bl from-[#571845] via-[#c80039] to-[#ffc300] text-zinc-100 relative">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <h1
          className={`${orbitron.className} text-6xl tracking-widest drop-shadow-[0_0_15px_#ffc300]`}
        >
          CENTUARI IDE
        </h1>
      </div>

      <div className="flex flex-1 mt-28 mx-6 bg-black/40 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl">
        <aside className="w-64 bg-black/50 backdrop-blur-md p-3 text-sm">
          <h2 className="text-gray-300 uppercase mb-3 flex justify-between items-center">
            Explorer
            <div className="relative inline-block">
              <button
                onClick={handleLoadFiles}
                className="text-green-400 hover:text-green-300 border px-2 py-1 rounded bg-black/30"
              >
                Load ▼
              </button>

              {dropdownVisible && (
                <div
                  className="absolute z-50 mt-2 bg-black/90 text-white border border-gray-700 rounded w-64 max-h-60 overflow-auto"
                  onMouseLeave={() => setDropdownVisible(false)}
                >
                  {dbFiles.length > 0 ? (
                    dbFiles.map((file) => (
                      <div
                        key={file.filename}
                        onClick={() => handleImportFile(file)}
                        className="px-4 py-2 hover:bg-yellow-500/20 cursor-pointer"
                      >
                        {file.filename}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400">No files found</div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={addFile}
              className="text-green-400 hover:text-green-300"
              title="Add File"
            >
              ＋
            </button>
          </h2>
          <ul className="space-y-1">
            {Object.keys(files).map((file) => (
              <li
                key={file}
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    visible: true,
                    x: e.pageX,
                    y: e.pageY,
                    file: file,
                  });
                }}
                className={`cursor-pointer px-2 py-1 rounded ${
                  activeFile === file
                    ? "bg-yellow-500 text-black font-bold"
                    : "text-gray-300 hover:bg-yellow-500/20"
                }`}
              >
                {file}
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-black/50 backdrop-blur-md h-10 flex items-center px-4 text-sm border-b border-gray-700">
            <span className="text-gray-200">{activeFile}</span>
            <div className="absolute right-0 flex justify between">
            <Button
              color="primary"
              size="md"
              variant="flat"
              onPress={async () => {
                const res = await fetch("/api/route", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    filename: activeFile,
                    content: files[activeFile],
                    language: selectedLanguage,
                  }),
                });

                const result = await res.json();
                alert(result.success ? "continue" : `Error: ${result.error}`);
              }}
            >
              Save to Server
            </Button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage={selectedLanguage}
              theme="vs-dark"
              value={files[activeFile]}
              onChange={handleCodeChange}
              onMount={handleEditorMount}
            />
          </div>
          <div
            className="h-1.5 bg-white/10 hover:bg-blue-400/50 cursor-row-resize transition-colors duration-200 flex items-center justify-center group"
            onMouseDown={handleMouseDown("horizontal")}
          >
            <div className="w-8 h-0.5 bg-white/30 group-hover:bg-blue-400/70 rounded-full transition-colors"></div>
          </div>
          <div
            style={{ height: terminalHeight }}
            className="bg-black/60 backdrop-blur-md border-t border-gray-700 p-2 text-green-400 font-mono text-sm overflow-auto"
          >
            <button
              onClick={runCode}
              className="bg-green-500/90 hover:bg-green-400 text-black px-2 py-1 rounded mb-2"
            >
              Run ▶
            </button>
            <div className="flex-1 p-6 bg-black/20 overflow-y-auto custom-scrollbar">
              <div className=" text-gray-200 text-sm">
                {output != null ? (
                  <div>Output: {output}</div>
                ) : (
                  'Click "Run Code" to see output here...'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {contextMenu.visible && (
      <div
        className="absolute bg-black/80 text-white border border-gray-700 rounded shadow-lg text-sm z-50"
        style={{
          top: contextMenu.y,
          left: contextMenu.x,
        }}
        onMouseLeave={() => setContextMenu({ ...contextMenu, visible: false })}
      >
        <div
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            const newName = prompt("Enter new file name:", contextMenu.file);
            if (newName && newName !== contextMenu.file) {
              setFiles((prev) => {
                const updated = { ...prev };
                updated[newName] = updated[contextMenu.file];
                delete updated[contextMenu.file];
                return updated;
              });
              setActiveFile(newName);
            }
            setContextMenu({ ...contextMenu, visible: false });
          }}
        >
          Rename
        </div>
        <div
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            const blob = new Blob([files[contextMenu.file]], {
              type: "text/plain;charset=utf-8",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = contextMenu.file;
            link.click();
            setContextMenu({ ...contextMenu, visible: false });
          }}
        >
          Download
        </div>
      </div>
    )}
    </main>
  );
}
