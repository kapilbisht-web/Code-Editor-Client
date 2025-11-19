import React, { useState } from "react";
import CodeEditor from "./components/Editor";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/App.css";

function App() {
  const [language, setLanguage] = useState("Select Language");

  return (
    <div className="app-container">
      <div className="center-panel">
        {/* ✅ Editor handles its own LanguageSelector now */}
        <ErrorBoundary>
          <CodeEditor language={language} setLanguage={setLanguage} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;