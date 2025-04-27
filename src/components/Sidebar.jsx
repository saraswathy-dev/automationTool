
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Sidebar({ scriptLibrary }) {




    return (
      <div className="w-64 border-r border-gray-200 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm text-gray-600 mb-2">
                    Type Script Library
                  </h3>
                  <ul className="space-y-4">
                    {scriptLibrary.map((script, index) => (
                      <li key={index} className="text-sm">
                        <p className="font-medium">{script.name}</p>
                        <p className="text-xs text-gray-500">
                          {script.lastModified} last modified
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
    );
  }
  