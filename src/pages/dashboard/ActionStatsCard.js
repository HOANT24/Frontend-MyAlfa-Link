import React, { useContext } from "react";
import { ChevronRight } from "lucide-react";
import { EtatGlobalContext } from "../EtatGlobal";

export default function ActionStatsCard({
  icon: Icon,
  title,
  description,
  page,
  count = 0,
  countLabel = "éléments",
  color = "bg-blue-50",
  iconColor = "text-blue-600",
}) {
  const { setCurrentPage } = useContext(EtatGlobalContext);

  const handleClick = () => {
    if (setCurrentPage) {
      setCurrentPage(page); // on met à jour l'état global avec le nom de la page
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-5 bg-white shadow-sm hover:shadow-md rounded-xl transition-all duration-300 flex flex-col justify-between h-full cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="bg-slate-100 text-slate-700 text-sm font-semibold px-2 py-1 rounded-md">
          {count}
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-3">{description}</p>
      </div>
      <div className="flex items-center text-[#840040] text-sm font-medium gap-1 transition-all group-hover:gap-2">
        <span>Accéder</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
