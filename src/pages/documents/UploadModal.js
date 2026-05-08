import { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Upload, Loader2, FileText, X } from "lucide-react";
import { EtatGlobalContext } from "../EtatGlobal";

export default function UploadModal({ open, onClose }) {
  const { clientSelect, fetchDocuments } = useContext(EtatGlobalContext);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [folder, setFolder] = useState("comptabilite");
  const [path, setPath] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async () => {
    if (!file || !name || !folder) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("name", name);
      formData.append("folder", folder);
      formData.append("path", path || folder);
      formData.append("description", description);
      formData.append("uploadedBy", "user");
      formData.append("clientId", clientSelect?.id);
      const response = await fetch(
        "https://backend-myalfa.vercel.app/api/documents-ged",
        { method: "POST", body: formData }
      );
      if (!response.ok) throw new Error("Erreur lors de l'upload");
      await response.json();
      fetchDocuments(clientSelect?.id);
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setName("");
    setFolder("divers");
    setDescription("");
    onClose();
  };

  const folderStructure = [
    {
      id: "comptabilite",
      name: "Comptabilité",
      children: [
        { id: "comptabilite/factures", name: "Factures" },
        { id: "comptabilite/releves", name: "Relevés" },
        { id: "comptabilite/grand_livre", name: "Grand livre" },
      ],
    },
    {
      id: "fiscal",
      name: "Fiscal",
      children: [
        { id: "fiscal/declarations", name: "Déclarations" },
        { id: "fiscal/tva", name: "TVA" },
        { id: "fiscal/is", name: "IS" },
      ],
    },
    {
      id: "social",
      name: "Social",
      children: [
        { id: "social/bulletins", name: "Bulletins" },
        { id: "social/declarations", name: "Déclarations" },
        { id: "social/contrats", name: "Contrats" },
      ],
    },
    {
      id: "juridique",
      name: "Juridique",
      children: [
        { id: "juridique/statuts", name: "Statuts" },
        { id: "juridique/pv", name: "PV" },
        { id: "juridique/contrats", name: "Contrats" },
      ],
    },
    { id: "divers", name: "Divers", children: [] },
  ];

  const availablePaths =
    folderStructure.find((f) => f.id === folder)?.children || [];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="w-[calc(100vw-24px)] max-w-sm max-h-[85dvh] p-3 sm:p-4 overflow-y-auto rounded-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-sm">Déposer un document</DialogTitle>
        </DialogHeader>

        <div className="space-y-2.5">
          {/* Zone fichier */}
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-colors">
              <Upload className="w-5 h-5 text-slate-400 mb-0.5" />
              <span className="text-[11px] text-slate-500">
                Sélectionner un fichier
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
              <div className="p-1 bg-white rounded-lg flex-shrink-0">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-slate-800 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-0.5 rounded hover:bg-slate-200 flex-shrink-0"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            </div>
          )}

          {/* Nom */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">
              Nom
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Facture électricité"
              className="h-8 text-xs"
            />
          </div>

          {/* Dossier + Sous-dossier */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">
                Dossier
              </label>
              <select
                value={folder}
                onChange={(e) => {
                  setFolder(e.target.value);
                  setPath("");
                }}
                className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px]"
              >
                {folderStructure.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">
                Sous-dossier
              </label>
              <select
                value={path}
                onChange={(e) => setPath(e.target.value)}
                disabled={availablePaths.length === 0}
                className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {availablePaths.length === 0 ? "Aucun" : "Choisir…"}
                </option>
                {availablePaths.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-700">
              Description <span className="text-slate-400">(optionnel)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajoutez une description..."
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-8 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!file || !name || uploading}
              className="flex-1 h-8 text-xs bg-[#840040] hover:bg-[#a00050]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Envoi…
                </>
              ) : (
                "Déposer"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
