import { Button } from "../../components/ui/button";
import { FileText, Download, Trash2, Building2, User } from "lucide-react";
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

export default function DocumentCard({
  document,
  onDelete,
  canDelete = false,
}) {
  const handleDownload = () => {
    window.open(document.url, "_blank");
  };

  return (
    <div className="p-4 hover:shadow-md transition-all duration-300 border-0 bg-white group">
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-xl bg-slate-100 flex-shrink-0">
          <FileText className="w-5 h-5 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-800 truncate">
            {document.name}
          </h4>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div
              variant="secondary"
              className={`${folderColors[document.folder]} border-0 text-xs`}
              style={{ padding: "0.3% 1%", borderRadius: "5px" }}
            >
              {folderLabels[document.folder]}
            </div>
            {document.year && (
              <div variant="outline" className="text-xs border-slate-200">
                {document.year}
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-slate-500">
              {document.uploaded_by === "admin" ? (
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
            </div>
          </div>
          {document.description && (
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">
              {document.description}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-2">
            {format(new Date(document.created_date), "d MMMM yyyy", {
              locale: fr,
            })}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8 text-slate-500 hover:text-blue-600"
          >
            <Download className="w-4 h-4" />
          </Button>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(document.id)}
              className="h-8 w-8 text-slate-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
