import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
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

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [animatePassed, setAnimatePassed] = useState(false);
  const [animateFailed, setAnimateFailed] = useState(false);

  // Animation effect
  useEffect(() => {
    // Initial animation
    setAnimatePassed(true);
    setAnimateFailed(true);

    // Set an interval to periodically animate the indicators
    const interval = setInterval(() => {
      setAnimatePassed(true);
      setTimeout(() => setAnimateFailed(true), 1000);

      setTimeout(() => {
        setAnimatePassed(false);
        setAnimateFailed(false);
      }, 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testSteps = [
    {
      step: "1",
      name: "Search and Select Product",
      instruction: 'Enter "t-shirt" in the search bar and press enter.',
      expectedResult:
        "A list of t-shirts appears. Select one from the list to view its details.",
      status: "passed",
      result: "—",
    },
    {
      step: "2",
      name: "Search and Select Product",
      instruction:
        'On the product detail page, select a size and click "Add to Cart."',
      expectedResult:
        'On the product detail page, select a medium size and click "Add to Cart."',
      status: "failed",
      result: "passed",
    },
    {
      step: "3",
      name: "Search and Select Product",
      instruction: 'Click on the cart icon, then click "Proceed to Checkout."',
      expectedResult:
        "The checkout page loads with the t-shirt details, and user can proceed.",
      status: "not-started",
      result: "—",
    },
    {
      step: "4",
      name: "Search and Select Product",
      instruction:
        'Fill in shipping and payment info, then click "Place Order."',
      expectedResult:
        "Order is successfully placed, and confirmation message is received.",
      status: "not-started",
      result: "—",
    },
  ];

  const scriptLibrary = [
    {
      name: "Purchase a t-shirt",
      lastModified: "April 11, 2025",
    },
    {
      name: "Coupon-redeem",
      lastModified: "April 11, 2025",
    },
    {
      name: "Payment",
      lastModified: "April 11, 2025",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openInspectPanel = () => {
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
            {isSidebarOpen && (
             <Sidebar scriptLibrary={scriptLibrary} />
            )}

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
                        Purchase a t-shirt
                      </h2>
                      <p className="text-text-text-muted-foreground text-base font-normal font-['Inter'] leading-7">
                        This test case covers the steps to purchase a t-shirt
                        online, from searching and selecting the item to
                        completing checkout and receiving order confirmation.
                      </p>
                    </div>

                    {/* Right Column: Status Badges in Row */}
                   <StatusBadge></StatusBadge>
                  </div>

                  {/* Run All Button & URL */}
                  <div className="flex items-center mb-6 space-x-2">
                    <button className=" text-text-text-primary-foreground text-sm font-medium font-['Inter'] leading-tight bg-black text-white px-4 py-2 rounded flex items-center text-sm">
                      <Play size={16} className="mr-2" /> Run All Steps
                    </button>
                    <div className="px-3 py-2 bg-gray-50 rounded text-text-muted-foreground text-sm font-normal leading-tight">https://beta.jeter-clothe-shop.com</div>
                  
                  </div>

                  {/* Test Steps Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                    <tr className="border-b border-[#E3E3E7] text-[#71717A] text-base font-bold font-['Inter'] leading-7">
  <th className="w-16 p-4 text-left">Step</th>
  <th className="w-48 p-4 text-left">Test Result</th>
  <th className="w-64 p-4 text-left">Test Step Name</th>
  <th className="w-72 p-4 text-left">Instruction</th>
  <th className="w-72 p-4 text-left">Expected Result</th>
  <th className="p-4 text-left">Smart Self-healing Result</th>
</tr>

                      <tbody>
                        {testSteps.map((step, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="pr-4 py-4 text-center align-top">
                              {step.step}
                            </td>
                            <td className="pr-4 py-4 align-top w-36">
                              <div className="mb-2">
                                {getStatusBadge(step.status)}
                              </div>
                              {step.status !== "not-started" && (
                                <button
                                  className="text-xs text-blue-600 hover:underline text-center w-full"
                                  onClick={openInspectPanel}
                                >
                                  Inspect
                                </button>
                              )}
                            </td>
                            <td className="pr-4 py-4 align-top">{step.name}</td>
                            <td className="pr-4 py-4 align-top">
                              {step.instruction}
                            </td>
                            <td className="pr-4 py-4 align-top">
                              {step.expectedResult}
                            </td>
                            <td className="pr-4 py-4 align-top">
                              {step.result === "passed" ? (
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
                              ) : (
                                <div className="text-center">—</div>
                              )}
                              {step.result === "passed" && (
                                <button
                                  className="text-xs text-blue-600 hover:underline text-center w-full mt-2"
                                  onClick={openInspectPanel}
                                >
                                  Inspect
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Panel - Inspect Details */}
              {isInspectOpen && (
                <div className="w-80 bg-gray-50 overflow-y-auto">
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

                  {activeTab === "code" ? (
                    <div className="p-4">
                      <div className="flex justify-between mb-4">
                        <div className="flex space-x-2">
                          <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-xs">10</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span className="text-xs">10</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1">
                            <Copy size={14} />
                          </button>
                          <button className="p-1">
                            <Filter size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-2 mb-4">
                        <button className="flex items-center border border-gray-300 rounded px-2 py-1 text-xs">
                          <FileText size={14} className="mr-1" />
                          Check in Midscene
                        </button>
                      </div>

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
                                <span className="text-green-600 mr-1">+</span>
                              )}
                              {line.content}
                            </div>
                          </div>
                        ))}
                      </div>

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
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <Check size={16} className="text-gray-500 mr-2" />
                          <h4 className="text-sm font-medium">
                            Smart Self-healing Suggestion
                          </h4>
                        </div>
                      </div>

                      {/* T-shirt Images */}
                      <div className="bg-black text-white text-xs py-1 px-2 mb-1">
                        <span>Subject</span>
                      </div>

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

                      {/* Original */}
                      <div className="mt-6 mb-2">
                        <div className="flex items-center mb-2">
                          <FileText size={16} className="text-gray-500 mr-2" />
                          <h4 className="text-sm font-medium">Original</h4>
                        </div>
                      </div>

                      <div className="bg-black text-white text-xs py-1 px-2 mb-1">
                        <span>Subject</span>
                      </div>

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

                      {/* Check in Midscene Button */}
                      <div className="flex justify-center mt-6 mb-4">
                        <button className="border border-gray-300 rounded px-4 py-2 text-sm flex items-center">
                          <FileText size={16} className="mr-2" />
                          Check in Midscene
                        </button>
                      </div>

                      {/* Bottom Buttons */}
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
