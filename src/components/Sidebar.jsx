import { useEffect, useState } from "react";
import { useScript } from "../context/ScriptContext.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Sidebar() {
  const [scriptLibrary, setScriptLibrary] = useState([]);
  const { setSelectedFile } = useScript();  // Correct context hook usage

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/playwright/testcases`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setScriptLibrary(data);
      } catch (error) {
        console.error("Error fetching script library:", error);
      }
    };

    fetchScripts();
  }, []);

  return (
    <div className="self-stretch bg-white border-l border-gray-200 inline-flex justify-start items-center">
      <div className="w-72 self-stretch bg-white border-r border-gray-200 inline-flex flex-col justify-start items-start">
        <div className="self-stretch flex-1 px-3 py-6 flex flex-col justify-start items-start gap-4">
          <div className="self-stretch pl-4 inline-flex justify-start items-center gap-1">
            <div className="flex-1 justify-start text-gray-800 text-sm font-medium leading-none">
              Test Spec Library
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            {scriptLibrary.map((script, index) => (
              <div
                key={index}
                onClick={() => setSelectedFile(script.file)}  // Now updates selectedFile correctly
                className="self-stretch px-4 py-2 bg-white hover:bg-gray-100 rounded-lg flex flex-col justify-center items-start cursor-pointer"
              >
                <div className="self-stretch justify-center text-gray-900 text-base font-normal leading-7">
                  {script.file}
                </div>
                <div className="justify-center text-gray-500 text-sm font-normal leading-tight">
                  {new Date(script.startTime).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  last modified
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
