export default function CodeDiffViewer({ codeLines }) {
    return (
      <div className="bg-white border border-gray-200 rounded overflow-y-auto max-h-96 text-xs font-mono p-4">
        {codeLines.map((line) => (
          <div
            key={line.num}
            className={`flex items-start ${
              line.type === "removed"
                ? "bg-red-50"
                : line.type === "added"
                ? "bg-green-50"
                : ""
            }`}
          >
            <div className="w-6 text-right pr-2 py-1 text-gray-500 select-none border-r border-gray-200">
              {line.num}
            </div>
            <div className="flex-1 pl-2 py-1">
              {line.type === "removed" && <span className="text-red-600 mr-1">-</span>}
              {line.type === "added" && <span className="text-green-600 mr-1">+</span>}
              {line.content}
            </div>
          </div>
        ))}
      </div>
    );
  }
  