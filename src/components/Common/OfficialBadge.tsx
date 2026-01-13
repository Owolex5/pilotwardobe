// components/Common/OfficialBadge.tsx
import React from "react";

interface OfficialBadgeProps {
  className?: string;
}

const OfficialBadge: React.FC<OfficialBadgeProps> = ({ className = "" }) => {
  return (
    <div
  className={`
    absolute top-3 left-3 z-20
    bg-gradient-to-br from-gray-900 to-gray-800
    text-cyan-300 text-xs font-bold
    px-3.5 py-1.5 rounded-full
    shadow-[0_0_15px_rgba(34,211,238,0.5)]
    flex items-center gap-1.5
    border border-cyan-500/40
    backdrop-blur-md
    ${className}
  `}
>
  <svg
    className="w-3.5 h-3.5 text-cyan-400"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
  PilotWardrobe
</div>
  );
};

export default OfficialBadge;