import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import PassedBadge from "./components/passedBadge.jsx";
import FailedBadge from "./components/FailedBadge.jsx";
import {
  Menu,
  AlertCircle,
  Check,
  Play,
  ExternalLink,
  X,
  ChevronRight,
  FileText,
  Filter,
  Copy,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import StatusBadge from "./components/StatusBadge";

import { useScript } from "./context/ScriptContext.jsx";
import msg1 from "./assets/msg1.svg";
import msg3 from "./assets/msg3.svg";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
function HealingMessage({ stage }) {
  const messages = [
    "ZeroFlake AI is reviewing the codes... Feel free to grab a coffee...",
    "ZeroFlake AI finds the issues and is trying to fix it... It might take a while...",
    "ZeroFlake AI fixed the issues! Generating the suggestion report...",
  ];

  const images = [
    msg1, // Image for Stage 1
    msg1, // Image for Stage 2
    msg3, // Image for Stage 3
  ];

  const dots = [
    [true, false, false],
    [true, true, false],
    [true, true, true],
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-2 p-4 flex-1">
      <img
        className="w-24 h-24 animate-bounce"
        src={images[stage - 1]}
        alt={`Stage ${stage}`}
      />
      <div className="text-center text-base font-normal leading-7">
        {messages[stage - 1]}
      </div>
      <div className="w-12 h-12 relative mt-2 flex justify-between">
        {dots[stage - 1].map((active, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              active ? "bg-blue-500" : "bg-gray-300"
            } animate-pulse`}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [animatePassed, setAnimatePassed] = useState(false);
  const [animateFailed, setAnimateFailed] = useState(false);
  const [scriptLibrary, setScriptLibrary] = useState([]);
  const [mainTest, setMainTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [showSelfHealing, setShowSelfHealing] = useState(false);
  const [healingStepIndex, setHealingStepIndex] = useState(0);
  const [fixingIndex, setFixingIndex] = useState(null); // Track which step is being fixed
  const [isHealing, setIsHealing] = useState(false);

  const { selectedFile } = useScript();
  console.log("Selected File from Context:", selectedFile);

  //get teststeps from api
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/playwright/testcases`);
        const data = await res.json();

        const targetTest = data.find((test) => test.file === selectedFile);
        if (targetTest) {
          const stepsWithDefaultStatus =
            targetTest.steps?.map((step) => ({
              ...step,
              status: "Ready to test",
            })) || [];

          setMainTest({
            ...targetTest,
            steps: stepsWithDefaultStatus,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching test cases:", err);
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [selectedFile]);

  // run test
  const runTest = async () => {
    setRunning(true);
    let ws; // Declare ws outside try for closing later if needed
  
    try {
      // 1. Start Playwright test (trigger backend job)
      const res = await fetch(`${API_BASE}/api/test-cases/${selectedFile}`);
      const result = await res.json();
      console.log("🎯 Playwright triggered:", result);
  
      const jobId = result?.jobId;
      if (!jobId) throw new Error("No jobId returned from backend");
  
      // 2. Dynamically determine WebSocket protocol
      const wsProtocol = API_BASE.startsWith('https') ? 'wss' : 'ws';
      const wsUrl = `${wsProtocol}://${API_BASE.replace(/^https?:\/\//, '')}/ws/job-status/${jobId}`;
      ws = new WebSocket(wsUrl);
  
      ws.onopen = () => {
        console.log('✅ WebSocket connected to job tracker');
        console.log('🚀 JobId already included in URL:', jobId);
        // No need to send anything else! We just listen.
      };
  
      ws.onmessage = async (event) => {
        console.log('📩 WebSocket message received:', event.data);
  
        const data = JSON.parse(event.data);
  
        // Check if job is completed
        if (data.job_id === jobId && (data.status === "completed" || data.status === "failed")) {
          console.log(`🎯 Job ${jobId} finished with status: ${data.status}`);
  
          // 3. After job done -> Fetch final test case result
          const resultRes = await fetch(`${API_BASE}/api/test-cases/${selectedFile}`);
          const resultData = await resultRes.json();
  
          if (resultData?.steps && mainTest?.steps) {
            const updatedSteps = mainTest.steps.map((step, index) => ({
              ...step,
              status: resultData.steps[index]?.status || "Not Attempted",
            }));
  
            setMainTest(prev => ({
              ...prev,
              steps: updatedSteps,
            }));
          }
  
          ws.close(); // Cleanly close websocket
          setRunning(false);
        }
      };
  
      ws.onerror = (err) => {
        console.error('❌ WebSocket connection error:', err);
        if (ws) ws.close();
        setRunning(false);
      };
  
      ws.onclose = () => {
        console.log('❌ WebSocket closed.');
      };
  
    } catch (err) {
      console.error('❌ Failed to run test:', err);
      if (ws) ws.close();
      setRunning(false);
    }
  };
  
  

  //fixAI-selfhealing
  const fixStep = async () => {
    try {
      setIsHealing(true);
      setIsInspectOpen(true);
      setHealingStage(1);
  
      setTimeout(() => setHealingStage(2), 2000);
      setTimeout(() => setHealingStage(3), 4000);
  
      setTimeout(async () => {
        try {
          const response = await fetch('/ai/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              user_input: mainTest.title,
              system_prompt_file: "system_prompt.txt",
              typescript_file: "amazon.spec.ts",
              output_file: "gen_ai.spec.ts",
              model: "gpt-4o",
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
  
          const data = await response.json(); // assume API returns an array of step results
  
          const updatedSteps = mainTest.steps.map((step, index) => {
            const stepStatus = data?.steps?.[index]?.test_status || "Failed";
            const isPassed = stepStatus === "Passed";
  
            return {
              ...step,
              ai_attempt: isPassed ? "Passed ✅" : "Failed ❌",
              status: isPassed ? "Fixed by AI" : "Fix attempt failed",
            };
          });
  
          setMainTest(prev => ({
            ...prev,
            steps: updatedSteps,
          }));
  
        } catch (error) {
          console.error('Healing API error:', error);
  
          const updatedSteps = mainTest.steps.map((step) => ({
            ...step,
            ai_attempt: "Error ❌",
            status: `Error: ${error.message}`,
          }));
  
          setMainTest(prev => ({
            ...prev,
            steps: updatedSteps,
          }));
  
        } finally {
          setIsHealing(false);
          setHealingStage(0);
        }
      }, 6000); // After healing stages finish
    } catch (outerError) {
      console.error('Unexpected error in fixStep:', outerError);
      setIsHealing(false);
      setHealingStage(0);
    }
  };
  
  
  //healing logic
  const [healingStage, setHealingStage] = useState(0); // 0 = None, 1-3 = stages, 4 = show code

  useEffect(() => {
    let timer;
    if (healingStage === 1) {
      timer = setTimeout(() => setHealingStage(2), 3000);
    } else if (healingStage === 2) {
      timer = setTimeout(() => setHealingStage(3), 3000);
    } else if (healingStage === 3) {
      timer = setTimeout(() => setHealingStage(4), 3000);
    }
    console.log("isHealing state:", isHealing);
    return () => clearTimeout(timer); // Clean up on unmount or change
  }, [healingStage]);

  const hasFailedSteps = mainTest?.steps?.some((step) =>
    step.status?.toLowerCase().includes("failed")
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openInspectPanel = () => {
    setHealingStage(4);
    setIsInspectOpen(true);
  };

  const closeInspectPanel = () => {
    setIsInspectOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "passed":
        return (
          <div
            className={`flex items-center justify-center w-full py-1 bg-green-100 text-green-700 rounded-md ${
              animatePassed ? "animate-pulse" : ""
            }`}
          >
            <span className="inline-flex items-center">
              <Check size={14} className="mr-1" />
              Passed
            </span>
          </div>
        );
      case "failed":
        return (
          <div
            className={`flex items-center justify-center w-full py-1 bg-red-100 text-red-700 rounded-md ${
              animateFailed ? "animate-pulse" : ""
            }`}
          >
            <span className="inline-flex items-center">
              <X size={14} className="mr-1" />
              Failed
            </span>
          </div>
        );
      case "not-started":
        return (
          <div className="flex items-center justify-center w-full py-1 bg-gray-100 text-gray-500 rounded-md">
            <span className="inline-flex items-center">
              <AlertCircle size={14} className="mr-1" />
              Not Start
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const codeLines = [
    { num: 1, content: "<!-- Product List HTML -->", type: "comment" },
    { num: 2, content: '<div class="product-list">', type: "normal" },
    {
      num: 3,
      content: '<div class="product-card full-stock highlight">',
      type: "removed",
    },
    {
      num: 4,
      content: '<div class="product-card out-of-stock">',
      type: "added",
    },
    { num: 5, content: "<!-- T-Shirt Green Kids -->", type: "comment" },
    { num: 6, content: "</div>", type: "normal" },
    {
      num: 7,
      content: '<div class="product-card out-of-stock">',
      type: "removed",
    },
    {
      num: 8,
      content: '<div class="product-card in-promotion">',
      type: "added",
    },
    { num: 9, content: "<!-- T-Shirt White Kids -->", type: "comment" },
    { num: 10, content: "</div>", type: "normal" },
    {
      num: 11,
      content: '<div class="product-card full-stock">',
      type: "removed",
    },
    {
      num: 12,
      content: '<div class="product-card full-stock">',
      type: "added",
    },
    { num: 13, content: "<!-- Sneakers White -->", type: "comment" },
    { num: 14, content: "</div>", type: "normal" },
    {
      num: 15,
      content: '<div class="product-card full-stock blue-jeans">',
      type: "removed",
    },
    {
      num: 16,
      content: "<!-- Move Blue Jeans to top position and highlight -->",
      type: "added",
    },
    {
      num: 17,
      content: '<div class="product-card full-stock blue-jeans recommended">',
      type: "added",
    },
    { num: 18, content: "<!-- Blue Jeans -->", type: "comment" },
    { num: 19, content: "</div>", type: "normal" },
  ];

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex flex-col w-full h-full">
        {/* Common Header - ZeroFlake as first hierarchy */}
        <Header></Header>

        {/* Second level with toggle button and sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar toggle button */}
          <div className="flex flex-col items-center border-r border-gray-200 bg-white">
            <button onClick={toggleSidebar} className="p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6 2V14M9.33333 6L11.3333 8L9.33333 10M3.33333 2H12.6667C13.403 2 14 2.59695 14 3.33333V12.6667C14 13.403 13.403 14 12.6667 14H3.33333C2.59695 14 2 13.403 2 12.6667V3.33333C2 2.59695 2.59695 2 3.33333 2Z"
                  stroke="#09090B"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Toggle visibility */}
            {isSidebarOpen && <Sidebar scriptLibrary={scriptLibrary} />}

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Panel - Test Case */}
              <div className="flex-1 overflow-y-auto border-r border-gray-200">
                <div className="p-4">
                  {/* Test Case Header */}
                  <div className="flex justify-between items-center mb-4">
                    {/* Left Column: Heading + Description */}
                    <div className="flex flex-col flex-1 pr-4">
                      <h2 className="text-text-text-foreground text-2xl font-semibold font-['Inter'] leading-loose">
                        {mainTest?.title || "Purchase a T-shirt"}
                      </h2>
                      <p className="text-text-text-muted-foreground text-base font-normal font-['Inter'] leading-7">
                        {mainTest?.description ||
                          "This test case covers the steps to add cart that appears first in the search list"}
                      </p>
                    </div>

                    {/* Right Column: Status Badges in Row */}
                    <StatusBadge steps={mainTest?.steps || []}></StatusBadge>
                  </div>

                  {/* Run All Button & URL */}
                  <div className="flex items-center mb-6 space-x-2">
                    <button
                      onClick={runTest}
                      className=" text-text-text-primary-foreground text-sm font-medium font-['Inter'] leading-tight bg-black text-white px-4 py-2 rounded flex items-center text-sm"
                    >
                      <Play size={16} className="mr-2" /> Run All Steps
                    </button>
                    <div className="px-3 py-2 bg-gray-50 rounded text-text-muted-foreground text-sm font-normal leading-tight">
                      {mainTest?.URL || "https://beta.jeter-clothe-shop.com"}
                    </div>
                  </div>

                  {/* Test Steps Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-100 text-[#71717A] text-base font-bold font-['Inter'] leading-7">
                          <th className="px-8 py-7 text-left">Step</th>
                          <th className="px-8 py-7 text-left">Test Result</th>
                          <th className="px-8 py-7 text-left">
                            Test Step Name
                          </th>
                          <th className="px-8 py-7 text-left">Instruction</th>
                          <th className="px-8 py-7 text-left">
                            Expected Result
                          </th>
                          <th className="px-8 py-7 text-left">
                            Smart Self-healing Result
                          </th>
                        </tr>
                      </thead>
                      <tbody className="font-['Inter']">
                        {mainTest?.steps?.map((step, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-50 "
                          >
                            <td className="px-8 py-7 align-top text-left">
                              {String(index + 1).padStart(2, "0")}
                            </td>
                            <td className="px-8 py-7 align-top text-left">
                              {(() => {
                                const status =
                                  step.status?.toLowerCase() || "not attempted";

                                if (
                                  running &&
                                  step.status === "Ready to test"
                                ) {
                                  return (
                                    <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                                  );
                                }

                                if (status === "passed") {
                                  return (
                                    <>
                                      <PassedBadge />
                                      <button
                                        className="block text-xs text-gray-600 hover:underline mt-2"
                                        onClick={openInspectPanel}
                                      >
                                        Inspect
                                      </button>
                                    </>
                                  );
                                }

                                if (status.includes("fail")) {
                                  return (
                                    <>
                                      <FailedBadge />

                                      <button
                                        className="block text-xs text-gray-600 hover:underline mt-2"
                                        onClick={openInspectPanel}
                                      >
                                        Inspect
                                      </button>
                                    </>
                                  );
                                }

                                return (
                                  <div className="font-bold text-sm">
                                    {step.status === "Ready to test" ? (
                                      <div className="flex items-center gap-2">
                                        <img
                                          src="src/assets/eyelook.svg"
                                          alt="Ready"
                                          className="w-4 h-4 animate-bounce"
                                        />
                                        <span>Ready</span>
                                      </div>
                                    ) : (
                                      step.status || "Not Attempted"
                                    )}
                                  </div>
                                );
                              })()}
                            </td>

                            <td className="px-8 py-7 align-top text-left">
                              {step.title}
                            </td>
                            <td className="px-8 py-7 align-top text-left">
                              {step.instruction}
                            </td>
                            <td className="px-8 py-7 align-top text-left">
                              {step.expected_result}
                            </td>
                            <td className="px-8 py-7 align-top text-left">
  {isHealing ? (
    // While healing is active, show a global spinner for all steps
    <div className="flex items-center gap-2">
      <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>
      <span className="text-sm text-gray-500">Healing...</span>
    </div>
  ) : step.ai_attempt ? (
    <div className="flex flex-col">
      <div
        className={`inline-flex items-center py-1 px-2 rounded-md ${
          step.ai_attempt.includes("Passed")
            ? "bg-green-100 text-green-700"
            : step.ai_attempt.includes("Error")
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        <Check size={14} className="mr-1" />
        {step.ai_attempt}
      </div>
      <button
        className="block text-xs text-blue-600 hover:underline mt-2"
        onClick={openInspectPanel}
      >
        Inspect
      </button>
    </div>
  ) : (
    <div className="inline-flex items-center py-1 px-2 ">
    <Check size={14} className="mr-1" />
    <PassedBadge></PassedBadge>
    <button
        className="block text-xs text-blue-600 hover:underline mt-2"
        onClick={openInspectPanel}
      >
        Inspect
      </button>
  </div>
  )}
</td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {hasFailedSteps && (
                  <div className=" flex items-center justify-center mt-15">
                    <div className="p-4 rounded-md shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10)] inline-flex justify-start items-center gap-24 bg-white">
                      <div className="self-stretch pl-6 pr-8 py-6 bg-background-bg-background rounded-md outline outline-1 outline-offset-[-1px] outline-border-border-border inline-flex flex-col justify-center items-start gap-5">
                        <div className="inline-flex justify-start items-start gap-2">
                          <img
                            className="w-10 h-10 glitter"
                            src="src/assets/selfheal.svg"
                          />
                          <div className="inline-flex flex-col justify-start items-start gap-1">
                            <div className="self-stretch justify-start text-text-text-foreground text-sm font-semibold font-['Inter'] leading-tight">
                              Self-healing Time
                            </div>
                            <div className="self-stretch justify-start text-text-text-foreground text-sm font-normal font-['Inter'] leading-tight">
                              Try to use Smart Self-healing to see if AI can fix
                              it!
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex justify-start items-start gap-2">
                          <button
                            onClick={() => {
                              setShowSelfHealing(false);
                              setIsInspectOpen(false);
                              setHealingStage(0);
                            }}
                            className="h-10 px-4 py-2 bg-gray-100 rounded-md flex justify-center items-center gap-2"
                          >
                            <div className="justify-start text-text-text-secondary-foreground text-sm font-medium font-['Inter'] leading-tight">
                              Cancel
                            </div>
                          </button>
                          <button
                            onClick={async () => {
                              setIsInspectOpen(true); // Open the sidebar
                              setHealingStage(1);
                              setShowSelfHealing(false);
                              setIsHealing(true);
                              await new Promise((resolve) =>
                                setTimeout(resolve, 10000)
                              );
                              setIsHealing(false);
                            }}
                            className="h-10 px-4 py-2 bg-black  rounded-md flex justify-center items-center gap-2"
                          >
                            <div className="justify-start text-white text-text-text-primary-foreground text-sm font-medium font-['Inter'] leading-tight">
                              Run Smart Self-healing
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Inspect Details */}
              {isInspectOpen && (
                <div className="w-80 bg-gray-50 overflow-y-auto flex flex-col">
                  {/* Healing Messages */}
                  {healingStage >= 1 && healingStage <= 3 && (
                    <div className="flex-1 flex justify-center items-center">
                      <HealingMessage stage={healingStage} />
                    </div>
                  )}

                  {/* Inspect Content: Only show when healingStage is 0 or done */}
                  {healingStage === 4 && (
                    <>
                      {/* Inspect Header */}
                      <div className="p-4 flex justify-between items-center border-b border-gray-200">
                        <h3 className="font-medium">Inspect</h3>
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={closeInspectPanel}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Tabs */}
                      <div className="flex border-b border-gray-200">
                        <button
                          className={`flex-1 py-3 text-sm font-medium ${
                            activeTab === "screenshot"
                              ? "text-gray-800 border-b-2 border-gray-800"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("screenshot")}
                        >
                          Screenshot
                        </button>
                        <button
                          className={`flex-1 py-3 text-sm font-medium ${
                            activeTab === "code"
                              ? "text-gray-800 border-b-2 border-gray-800"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("code")}
                        >
                          Code
                        </button>
                      </div>

                      {/* Content */}
                      {activeTab === "code" ? (
                        <div className="p-4">
                          {/* Your Code Lines */}
                          <div className="bg-white border border-gray-200 rounded overflow-y-auto max-h-96 text-xs font-mono">
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
                                  {line.type === "removed" && (
                                    <span className="text-red-600 mr-1">-</span>
                                  )}
                                  {line.type === "added" && (
                                    <span className="text-green-600 mr-1">
                                      +
                                    </span>
                                  )}
                                  {line.content}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Buttons */}
                          <div className="flex space-x-2 mt-8">
                            <button className="flex-1 bg-red-500 text-white py-2 rounded text-sm flex items-center justify-center">
                              <X size={16} className="mr-1" />
                              Reject Suggestion
                            </button>
                            <button className="flex-1 bg-green-500 text-white py-2 rounded text-sm flex items-center justify-center">
                              <Check size={16} className="mr-1" />
                              Update Test Spec
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4">
                          {/* Screenshot Content */}
                          <div className="grid grid-cols-3 gap-1 mb-4">
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={i}
                                className="bg-gray-200 aspect-square rounded overflow-hidden border relative"
                              >
                                {i === 0 && (
                                  <div className="absolute right-1 top-1">
                                    <ChevronRight
                                      size={16}
                                      className="text-gray-800"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
