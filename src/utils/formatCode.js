import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

export default function formatCode(code, language) {
  try {
    // ✅ Only format JS for now
    if (language !== "javascript") {
      return code;
    }

    const formatted = prettier.format(code, {
      parser: "babel",
      plugins: [parserBabel],
      semi: true,
      singleQuote: true,
      tabWidth: 2,
    });

    return typeof formatted === "string" ? formatted : code;
  } catch (err) {
    console.error("Format error:", err);
    return code; // fallback
  }
}