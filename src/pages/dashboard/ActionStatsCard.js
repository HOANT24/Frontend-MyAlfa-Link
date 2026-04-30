import React, { useContext } from "react";
import { ChevronRight } from "lucide-react";
import { EtatGlobalContext } from "../EtatGlobal";

export default function ActionStatsCard({
  icon: Icon,
  title,
  description,
  page,
  count = 0,
  color = "bg-blue-50",
  iconColor = "text-blue-600",
}) {
  const { setCurrentPage } = useContext(EtatGlobalContext);

  const handleClick = () => {
    if (setCurrentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
      w-1/2 lg:w-full min-w-0
      p-3 sm:p-4 lg:p-5
      bg-white shadow-sm hover:shadow-md
      rounded-lg sm:rounded-xl
      transition-all duration-300
      flex flex-col justify-between
      h-full cursor-pointer
    "
    >
      {/* TOP */}
      <div className="flex items-start justify-between mb-2 sm:mb-3 min-w-0">
        <div
          className={`
            w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12
            ${color}
            rounded-lg sm:rounded-xl
            flex items-center justify-center
            flex-shrink-0
          `}
        >
          <Icon
            className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${iconColor}`}
          />
        </div>

        <div className="bg-slate-100 text-slate-700 text-[10px] sm:text-xs lg:text-sm font-semibold px-2 py-0.5 rounded-md">
          {count}
        </div>
      </div>

      {/* CONTENT */}
      <div>
        <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-slate-800 mb-1">
          {title}
        </h3>

        <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 mb-2 sm:mb-3 leading-snug">
          {description}
        </p>
      </div>

      {/* ACTION */}
      <div className="flex items-center text-[#840040] text-xs sm:text-sm font-medium gap-1">
        <span>Accéder</span>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform" />
      </div>
    </div>
  );
}
