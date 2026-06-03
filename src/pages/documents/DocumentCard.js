import { FileText, Building2, User, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const folderConfig = {
  comptabilite: { label: "Comptabilité", badge: "bg-blue-50 text-blue-700", icon: "bg-blue-50 text-blue-500" },
  fiscal:       { label: "Fiscal",        badge: "bg-emerald-50 text-emerald-700", icon: "bg-emerald-50 text-emerald-500" },
  social:       { label: "Social",        badge: "bg-violet-50 text-violet-700", icon: "bg-violet-50 text-violet-500" },
  juridique:    { label: "Juridique",     badge: "bg-amber-50 text-amber-700", icon: "bg-amber-50 text-amber-500" },
  divers:       { label: "Divers",        badge: "bg-slate-100 text-slate-600", icon: "bg-slate-100 text-slate-500" },
};

export default function DocumentCard({ document }) {
  const config = folderConfig[document.folder] || folderConfig.divers;

  return (
    <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 w-full" style={{ minWidth: 0 }}>
      {/* Icône */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.icon}`}>
        <FileText className="w-5 h-5" />
      </div>

      {/* Contenu — min-w-0 obligatoire pour que truncate fonctionne */}
      <div className="flex-1 overflow-hidden" style={{ minWidth: 0 }}>
        <p className="text-sm font-semibold text-slate-800 truncate">
          {document.name}
        </p>
        <div className="flex items-center gap-2 mt-1" style={{ minWidth: 0 }}>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${config.badge}`}>
            {config.label}
          </span>
          <span className="text-[11px] text-slate-400 truncate flex-1">
            {format(new Date(document.createdDate), "d MMM yyyy", { locale: fr })}
          </span>
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
    </div>
  );
}
