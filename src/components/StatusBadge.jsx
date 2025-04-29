export default function StatusBadge({ steps = [] }) {
  const passedCount = steps.filter(
    (step) => step.status?.toLowerCase() === "passed"
  ).length;

  const failedCount = steps.filter(
    (step) => step.status?.toLowerCase().includes("fail")
  ).length;

  const notAttemptedCount = steps.filter(
    (step) =>
      !step.status ||
      step.status.toLowerCase() === "not attempted" ||
      step.status.toLowerCase() === "ready to test"
  ).length;

  return (
    <div className="flex justify-start items-center gap-4 p-3">
      {/* Passed */}
      <div className="px-2 py-1 rounded-full outline outline-1 outline-offset-[-1px] outline-border-border-border flex items-center gap-1">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-green-700 rounded-full" />
          <div className="text-text-text-muted-foreground text-sm font-medium font-['Inter'] leading-tight">
            Passed
          </div>
        </div>
        <div className="text-text-text-primary text-sm font-medium font-['Inter'] leading-none">
          {passedCount}
        </div>
      </div>

      {/* Failed */}
      <div className="px-2 py-1 rounded-full outline outline-1 outline-offset-[-1px] outline-border-border-border flex items-center gap-1">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
          <div className="text-text-text-muted-foreground text-sm font-medium font-['Inter'] leading-tight">
            Failure
          </div>
        </div>
        <div className="text-text-text-primary text-sm font-medium font-['Inter'] leading-none">
          {failedCount}
        </div>
      </div>

      {/* Not Attempted */}
      <div className="px-2 py-1 rounded-full outline outline-1 outline-offset-[-1px] outline-border-border-border flex items-center gap-1">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
          <div className="text-text-text-muted-foreground text-sm font-medium font-['Inter'] leading-tight">
            Not Attempted
          </div>
        </div>
        <div className="text-text-text-primary text-sm font-medium font-['Inter'] leading-none">
          {notAttemptedCount}
        </div>
      </div>
    </div>
  );
}
