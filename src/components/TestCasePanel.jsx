import StatusBadge from "./StatusBadge";

export default function TestCasePanel({ testSteps, animatePassed, animateFailed, openInspectPanel }) {
  return (
    <div className="flex-1 overflow-y-auto border-r border-gray-200 p-4">
      {/* ... header content ... */}
      {/* Test Steps Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#E3E3E7] text-[#71717A] text-base font-bold font-['Inter'] leading-7">
              <th className="w-16 p-4 text-left">Step</th>
              <th className="w-48 p-4 text-left">Test Result</th>
              <th className="w-64 p-4 text-left">Test Step Name</th>
              <th className="w-72 p-4 text-left">Instruction</th>
              <th className="w-72 p-4 text-left">Expected Result</th>
              <th className="p-4 text-left">Smart Self-healing Result</th>
            </tr>
          </thead>
          <tbody>
            {testSteps.map((step, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="pr-4 py-4 text-center align-top">{step.step}</td>
                <td className="pr-4 py-4 align-top w-36">
                  <div className="mb-2">
                    <StatusBadge
                      status={step.status}
                      animatePassed={animatePassed}
                      animateFailed={animateFailed}
                    />
                  </div>
                  {step.status !== "not-started" && (
                    <button className="text-xs text-blue-600 hover:underline text-center w-full" onClick={openInspectPanel}>
                      Inspect
                    </button>
                  )}
                </td>
                <td className="pr-4 py-4 align-top">{step.name}</td>
                <td className="pr-4 py-4 align-top">{step.instruction}</td>
                <td className="pr-4 py-4 align-top">{step.expectedResult}</td>
                <td className="pr-4 py-4 align-top">
                  {step.result === "passed" ? (
                    <StatusBadge status="passed" animatePassed={animatePassed} />
                  ) : (
                    <div className="text-center">—</div>
                  )}
                  {step.result === "passed" && (
                    <button className="text-xs text-blue-600 hover:underline text-center w-full mt-2" onClick={openInspectPanel}>
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
  );
}
