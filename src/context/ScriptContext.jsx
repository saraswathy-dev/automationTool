import { createContext, useContext, useState } from "react";

const ScriptContext = createContext();

export const ScriptProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState('amazon.spec.ts'); // default

  return (
    <ScriptContext.Provider value={{ selectedFile, setSelectedFile }}>
      {children}
    </ScriptContext.Provider>
  );
};

export const useScript = () => useContext(ScriptContext);
