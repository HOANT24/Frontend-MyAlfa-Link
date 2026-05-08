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
      <div className="bg-white shadow-sm h-full flex items-center justify-center rounded-xl">
        <div className="text-center p-3">
          <FileText className="w-6 h-6 text-slate-300 mx-auto mb-1" />
          <p className="text-slate-400 text-[11px]">Sélectionnez un document</p>
        </div>
      </div>
    );
  }

  const fileExtension = document.url?.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension);
  const isPdf = fileExtension === "pdf";

  return (
    <div className="bg-white shadow-sm h-full flex flex-col overflow-hidden rounded-xl">
      {/* ── Header ── */}
      <div className="px-2 py-1 border-b border-slate-100 flex items-center gap-1 min-w-0 flex-shrink-0">
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-[11px] font-semibold text-slate-800 truncate leading-tight">
            {document.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5 overflow-hidden">
            <span
              className={`${
                folderColors[document.folder]
              } text-[9px] px-1 py-px rounded shrink-0`}
            >
              {folderLabels[document.folder]}
            </span>
            {document.year && (
              <span className="text-[9px] border border-slate-200 text-slate-500 px-1 py-px rounded shrink-0">
                {document.year}
              </span>
            )}
            <span className="text-[9px] text-slate-400 truncate">
              {format(new Date(document.createdDate), "dd MMM yy", {
                locale: fr,
              })}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-0.5 rounded hover:bg-slate-100 text-slate-400"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* ── Contenu — hauteur fixe et réduite ── */}
      <div
        className="bg-slate-50 overflow-hidden flex-shrink-0"
        style={{ height: "65vh" }}
      >
        {isImage ? (
          <div className="flex items-center justify-center h-full p-1">
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-full object-contain rounded"
            />
          </div>
        ) : isPdf ? (
          <iframe
            src={document.url}
            className="w-full h-full bg-white"
            title={document.name}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-1">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <File className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-500">
              Prévisualisation non disponible
            </p>
            <Button
              size="sm"
              onClick={() => window.open(document.url, "_blank")}
              className="gap-1 text-[10px] h-6 px-2"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              Ouvrir
            </Button>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-2 py-1 border-t border-slate-100 flex gap-1 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1 text-[10px] h-6 px-2"
          onClick={() => window.open(document.url, "_blank")}
        >
          <Download className="w-2.5 h-2.5 flex-shrink-0" />
          <span className="truncate">Télécharger</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1 text-[10px] h-6 px-2"
          onClick={() => window.open(document.url, "_blank")}
        >
          <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
          <span className="truncate">Ouvrir</span>
        </Button>
      </div>
    </div>
  );
}
