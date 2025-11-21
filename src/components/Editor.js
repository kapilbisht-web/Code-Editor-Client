import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import socket from "../utils/socket";
import "../styles/Editor.css";
import LanguageSelector from "./LanguageSelector";
import Toolbar from "./Toolbar";
import OutputSection from "./OutputSection";

export default function CodeEditor({ language, setLanguage }) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [errorOutput, setErrorOutput] = useState("");
  const [editorHeight, setEditorHeight] = useState(400);
  const [theme, setTheme] = useState("vs-light");
  const [execInfo, setExecInfo] = useState({ timeMs: null, memoryMB: null });

  // ✅ Ref to Monaco editor instance
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    socket.on("code-update", (newCode) => setCode(newCode));
    return () => socket.off("code-update");
  }, []);

  useEffect(() => {
    socket.on("code-output", (result) => {
      const end = performance.now();
      setOutput(result);
      setErrorOutput("");
      setExecInfo({ timeMs: Math.round(end), memoryMB: null });
    });

    socket.on("code-error", (err) => {
      const end = performance.now();
      setErrorOutput(err);
      setOutput("");
      setExecInfo({ timeMs: Math.round(end), memoryMB: null });
    });

    return () => {
      socket.off("code-output");
      socket.off("code-error");
    };
  }, []);

  const handleChange = (value) => setCode(value);

  const runCode = () => {
    const start = performance.now();
    socket.emit("run-code", { code, language });
    setExecInfo({ timeMs: performance.now() - start, memoryMB: null });
  };

  const clearOutput = () => {
    setOutput("");
    setErrorOutput("");
    setExecInfo({ timeMs: null, memoryMB: null });
  };

  const copyOutput = () => {
    const textToCopy = output || errorOutput;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      alert("Output copied to clipboard!");
    }
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "vs-dark" ? "vs-light" : "vs-dark"));

  const startResize = (e) => {
    const startY = e.clientY;
    const startHeight = editorHeight;

    const onMouseMove = (moveEvent) => {
      const newHeight = startHeight + (moveEvent.clientY - startY);
      if (newHeight > 200) setEditorHeight(newHeight);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="editor-container">
      {/* Header */}
      <div className="editor-header">
        <div className="header-top">
          <h2 className="editor-title">Code Editor</h2>
          <button onClick={toggleTheme} className="theme-btn">⚡</button>
        </div>
        <LanguageSelector language={language} setLanguage={setLanguage} />
      </div>

      {/* Monaco Editor */}
      <div className="resizable-editor" style={{ height: editorHeight }}>
        <Editor
          height="100%"
          theme={theme}
          language={language}
          value={code}
          onChange={handleChange}
          onMount={handleEditorDidMount}   // ✅ capture editor instance
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
        <div className="resize-handle" onMouseDown={startResize}></div>
      </div>

      {/* Toolbar */}
      <Toolbar
        runCode={runCode}
        clearOutput={clearOutput}
        copyOutput={copyOutput}
        editorRef={editorRef}
      />

      {/* Output Section */}
      <OutputSection
        output={output}
        errorOutput={errorOutput}
        execInfo={execInfo}
      />
    </div>
  );
}