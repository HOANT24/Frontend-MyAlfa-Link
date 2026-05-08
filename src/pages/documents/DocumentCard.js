import { FileText, Building2, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const folderLabels = {
  comptabilite: "Comptabilité",
  fiscal: "Fiscal",
  social: "Social",
  juridique: "Juridique",
  divers: "Divers",
};

const folderColors = {
  comptabilite: "bg-blue-100 text-blue-700",
  fiscal: "bg-emerald-100 text-emerald-700",
  social: "bg-violet-100 text-violet-700",
  juridique: "bg-amber-100 text-amber-700",
  divers: "bg-slate-100 text-slate-700",
};

export default function DocumentCard({ document }) {
  return (
    <div className="p-3 sm:p-4 hover:shadow-md transition-all duration-300 bg-white rounded-xl w-full overflow-hidden">
      <div className="flex items-start gap-2 sm:gap-3 min-w-0">
        <div className="p-2 sm:p-3 rounded-xl bg-slate-100 flex-shrink-0">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
        </div>

        {/* min-w-0 indispensable pour que truncate coupe au lieu de pousser */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-800 text-sm sm:text-base break-all line-clamp-1">
            {document.name}
          </h4>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span
              className={`${
                folderColors[document.folder]
              } text-xs px-2 py-0.5 rounded-md whitespace-nowrap`}
            >
              {folderLabels[document.folder]}
            </span>

            {document.year && (
              <span className="text-xs border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md whitespace-nowrap">
                {document.year}
              </span>
            )}

            <span className="flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
              {document.uploadedBy === "admin" ? (
                <>
                  <Building2 className="w-3 h-3" />
                  <span>Cabinet</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3" />
                  <span>Vous</span>
                </>
              )}
            </span>
          </div>

          {document.description && (
            <p className="hidden sm:block text-sm text-slate-500 mt-1.5 line-clamp-2 break-words">
              {document.description}
            </p>
          )}

          <p className="text-xs text-slate-400 mt-1.5">
            {format(new Date(document.createdDate), "d MMM yyyy", {
              locale: fr,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
