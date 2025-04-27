import { Check, X, AlertCircle } from "lucide-react";

export default function StatusBadge() {
return( <div className="flex justify-start items-center gap-4 p-3">
  {/* Passed */}
  <div className="px-2 py-1 rounded-full outline outline-1 outline-offset-[-1px] outline-border-border-border flex items-center gap-1">
    <div className="flex items-center gap-1">
      <div className="w-2.5 h-2.5 bg-green-700 rounded-full" />
      <div className="text-text-text-muted-foreground text-sm font-medium font-['Inter'] leading-tight">
        Passed
      </div>
    </div>
    <div className="text-text-text-primary text-sm font-medium font-['Inter'] leading-none">
      0
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
      0
    </div>
  </div>

  {/* Ready */}
  <div className="px-2 py-1 rounded-full outline outline-1 outline-offset-[-1px] outline-border-border-border flex items-center gap-1">
    <div className="flex items-center gap-1">
      <div className="w-2.5 h-2.5 bg-background-bg-primary-20/20 rounded-full" />
      <div className="text-text-text-muted-foreground text-sm font-medium font-['Inter'] leading-tight">
        Ready
      </div>
    </div>
    <div className="text-text-text-primary text-sm font-medium font-['Inter'] leading-none">
      4
    </div>
  </div>
</div>)
}
