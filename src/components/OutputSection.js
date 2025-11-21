export default function OutputSection({ output, errorOutput, execInfo = {} }) {
  return (
    <div className="output-section">
      <h3 className="output-title">
        Output
        {execInfo?.timeMs !== null && execInfo?.timeMs !== undefined && (
          <span className="exec-meta"> • Ran in {execInfo.timeMs} ms</span>
        )}
        {execInfo?.memoryMB !== null && execInfo?.memoryMB !== undefined && (
          <span className="exec-meta"> • Memory {execInfo.memoryMB} MB</span>
        )}
      </h3>

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
  );
}