export default function FailedBadge() {
    return (
      <div className="self-stretch px-3 py-1 bg-red-500 rounded-full inline-flex justify-center items-center gap-1">
        <img className="w-5 h-5 glitter" src="src/assets/fail.svg" alt="Failed Icon" />
        <div className="justify-start text-white text-sm font-bold font-['Inter'] leading-tight">
          Failed
        </div>
      </div>
    );
  }
  