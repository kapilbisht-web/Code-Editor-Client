import React from "react";

export default function LanguageSelector({ language, setLanguage }) {
  return (
    <div className="language-selector">
     <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="none">Select language</option>
  <option value="javascript">JavaScript</option>
  <option value="typescript">TypeScript</option>
  <option value="python">Python</option>
  <option value="java">Java</option>
  <option value="c">C</option>
  <option value="cpp">C++</option>
</select>
    </div>
  );
}
