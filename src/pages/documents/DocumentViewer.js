import { Button } from "../../components/ui/button";
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Image as File,
} from "lucide-react";
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

export default function DocumentViewer({ document, onClose }) {
  if (!document) {
    return (
      <div className="p-6 border-0 bg-white shadow-sm h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            Sélectionnez un document pour le visualiser
          </p>
        </div>
      </div>
    );
  }

  const fileExtension = document.url?.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension);
  const isPdf = fileExtension === "pdf";

  return (
    <div className="border-0 bg-white shadow-sm h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">
            {document.name}
          </h3>
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
          </div>
          {document.description && (
            <p className="text-sm text-slate-600 mt-2">
              {document.description}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-2">
            Ajouté le{" "}
            {format(new Date(document.created_date), "dd MMMM yyyy", {
              locale: fr,
            })}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-slate-50 p-4">
        {isImage ? (
          <div className="flex items-center justify-center h-full">
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
        ) : isPdf ? (
          <iframe
            src={document.url}
            className="w-full h-full rounded-lg shadow-lg bg-white"
            title={document.name}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <File className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1">{document.name}</p>
            <p className="text-sm text-slate-500 mb-4">
              Prévisualisation non disponible
            </p>
            <Button
              onClick={() => window.open(document.url, "_blank")}
              className="gap-2"
              style={{ paddingLeft: "16px", paddingRight: "16px" }}
            >
              <ExternalLink className="w-4 h-4" />
              Ouvrir dans un nouvel onglet
            </Button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => window.open(document.url, "_blank")}
        >
          <Download className="w-4 h-4" />
          Télécharger
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => window.open(document.url, "_blank")}
        >
          <ExternalLink className="w-4 h-4" />
          Ouvrir
        </Button>
      </div>
    </div>
  );
}
