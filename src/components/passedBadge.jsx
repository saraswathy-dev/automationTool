export default function PassedBadge() {
    return (
      <div
        style={{ backgroundColor: '#14B8A6' }} // Tailwind teal-500 equivalent
        className="self-stretch px-3 py-1 rounded-full inline-flex justify-center items-center gap-1"
      >
        <img className="w-5 h-5 glitter" src="src/assets/pass.svg" />
        <div className="justify-start text-white text-sm font-bold font-['Inter'] leading-tight">
          Passed
        </div>
      </div>
    );
  }
  
  