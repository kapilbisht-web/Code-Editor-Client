import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import socket from "../utils/socket";
import "../styles/Editor.css";
import LanguageSelector from "./LanguageSelector.js";

export default function CodeEditor({ language, setLanguage }) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [errorOutput, setErrorOutput] = useState("");
  const [editorHeight, setEditorHeight] = useState(400);
  const [theme, setTheme] = useState("vs-light");

  useEffect(() => {
    socket.on("code-update", (newCode) => setCode(newCode));
    return () => socket.off("code-update");
  }, []);

  useEffect(() => {
    socket.on("code-output", (result) => {
      setOutput(result);
      setErrorOutput("");
    });

    socket.on("code-error", (err) => {
      setErrorOutput(err);
      setOutput("");
    });

    return () => {
      socket.off("code-output");
      socket.off("code-error");
    };
  }, []);

  const handleChange = (value) => {
    setCode(value);
    socket.emit("code-change", value);
  };

  // ✅ FIXED: Send both code and language
  const runCode = () => {
    console.log("Running code:", { code, language }); // Debug log
    socket.emit("run-code", { code, language });
  };

  const clearOutput = () => {
    setOutput("");
    setErrorOutput("");
  };

  const copyOutput = () => {
    const textToCopy = output || errorOutput;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      alert("Output copied to clipboard!");
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "vs-dark" ? "vs-light" : "vs-dark"));
  };

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
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
        <div className="resize-handle" onMouseDown={startResize}></div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        {/* ✅ FIXED: Run button only calls runCode */}
        <button onClick={runCode} className="run-btn">Run</button>
        <button onClick={clearOutput} className="delete-btn">🗑️</button>
        <button onClick={copyOutput} className="copy-btn">📋</button>
      </div>

      {/* ✅ Output Section */}
      <div className="output-section">
        <h3 className="output-title">Output</h3>
        {output && (
          <div className="output-box success">
            {output.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
        {errorOutput && (
          <div className="output-box error">
            {errorOutput.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}