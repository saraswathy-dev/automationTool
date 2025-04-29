import { X } from "lucide-react";
import CodeDiffViewer from "./CodeDiffViewer";

export default function InspectPanel({ activeTab, setActiveTab, closeInspectPanel, codeLines }) {
  return (
    <div className="w-80 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h3 className="font-medium">Inspect</h3>
        <button className="text-gray-500 hover:text-gray-700" onClick={closeInspectPanel}>
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "screenshot" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500"}`}
          onClick={() => setActiveTab("screenshot")}
        >
          Screenshot
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "code" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500"}`}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
      </div>

      {activeTab === "code" ? (
        <CodeDiffViewer codeLines={codeLines} />
      ) : (
        <div className="p-4 grid grid-cols-3 gap-2">
          {/* Screenshot Content */}
          <img src="src/assets/codediff1.svg" alt="Screenshot 1" className="rounded" />
          <img src="src/assets/codediff2.svg" alt="Screenshot 2" className="rounded" />
          
        </div>
      )}
    </div>
  );
}
