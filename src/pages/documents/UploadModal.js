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
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  console.log("Selected folder:", folder);
  console.log("Selected path:", path);
  console.log("Client ID:", clientSelect?.id);

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
      formData.append("uploadedBy", "admin");
      formData.append("clientId", clientSelect?.id);

      const response = await fetch(
        "https://backend-myalfa.vercel.app/api/documents-ged",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l’upload du document");
      }

      const result = await response.json();
      console.log("Document GED créé :", result);
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

  const handleDialogChange = (isOpen) => {
    if (!isOpen) handleClose();
  };

  const folderStructure = [
    {
      id: "comptabilite",
      name: "comptabilite",
      children: [
        { id: "comptabilite/factures", name: "Factures" },
        { id: "comptabilite/releves", name: "Relevés bancaires" },
        { id: "comptabilite/grand_livre", name: "Grand livre" },
      ],
    },
    {
      id: "fiscal",
      name: "fiscal",
      children: [
        { id: "fiscal/declarations", name: "Déclarations" },
        { id: "fiscal/tva", name: "TVA" },
        { id: "fiscal/is", name: "Impôt sur les sociétés" },
      ],
    },
    {
      id: "social",
      name: "social",
      children: [
        { id: "social/bulletins", name: "Bulletins de paie" },
        { id: "social/declarations", name: "Déclarations sociales" },
        { id: "social/contrats", name: "Contrats de travail" },
      ],
    },
    {
      id: "juridique",
      name: "juridique",
      children: [
        { id: "juridique/statuts", name: "Statuts" },
        { id: "juridique/pv", name: "PV d'assemblée" },
        { id: "juridique/contrats", name: "Contrats" },
      ],
    },
    {
      id: "divers",
      name: "divers",
      children: [],
    },
  ];

  const selectedFolder = folderStructure.find((f) => f.id === folder);
  const availablePaths = selectedFolder?.children || [];

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Déposer un document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-500">
                Cliquez pour sélectionner un fichier
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <label>Nom du document</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Facture électricité"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Folder */}
            <div className="space-y-2">
              <label>Dossier</label>
              <select
                value={folder}
                onChange={(e) => {
                  setFolder(e.target.value);
                  setPath("");
                }}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                {folderStructure.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Path */}
            <div className="space-y-2">
              <label>Sous-dossier</label>
              <select
                value={path}
                onChange={(e) => setPath(e.target.value)}
                disabled={availablePaths.length === 0}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-100"
              >
                <option value="">
                  {availablePaths.length === 0
                    ? "Aucun sous-dossier"
                    : "Sélectionner"}
                </option>

                {availablePaths.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="space-y-2 "
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "8%",
            }}
          >
            <label>Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajoutez une description..."
              rows={2}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
                padding: "0.5rem",
                fontSize: "0.875rem",
                width: "100%",
              }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!file || !name || uploading}
              className="flex-1 bg-[#840040] hover:bg-[#a00050]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
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
