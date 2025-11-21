export default function Toolbar({ runCode, clearOutput, copyOutput, editorRef }) {
  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    } else {
      alert("Editor not ready yet!");
    }
  };

  return (
    <div className="toolbar">
      <button onClick={runCode} className="run-btn">Run</button>
      <button onClick={handleFormat} className="copy-btn">Format</button>
      <button onClick={clearOutput} className="delete-btn">🗑️</button>
      <button onClick={copyOutput} className="copy-btn">📋</button>
    </div>
  );
}