import { useState, useContext } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, Upload, Search, FileX, FolderOpen, X } from "lucide-react";

import FolderTabs from "./FolderTabs";
import DocumentCard from "./DocumentCard";
import UploadModal from "./UploadModal";
import DocumentTree from "./DocumentTree";
import DocumentViewer from "./DocumentViewer";

import { EtatGlobalContext } from "../EtatGlobal";

export default function Documents() {
  const { documents, setDocuments, loadingDocument } =
    useContext(EtatGlobalContext);

  const [user] = useState({ email: "client@test.com", name: "Client Test" });
  const [activeFolder, setActiveFolder] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showTree, setShowTree] = useState(false);

  const handleUpload = async (docData) => {
    const newDoc = {
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString(),
      uploadedBy: "client",
      ...docData,
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
  };

  const handleDelete = async (id) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const filteredDocuments = documents.filter((doc) => {
    let matchesFolder = false;
    if (activeFolder === "all") matchesFolder = true;
    else if (activeFolder.includes("/"))
      matchesFolder = doc.path === activeFolder;
    else matchesFolder = doc.folder === activeFolder;

    const matchesSearch =
      !searchTerm ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFolder && matchesSearch;
  });

  if (loadingDocument) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" color="#981845" />
      </div>
    );
  }

  return (
    // overflow-hidden sur le root pour couper tout débordement
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <div className="h-screen flex flex-col px-3 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-hidden">
        {/* ── Header ── */}
        <div className="mb-4 sm:mb-6 flex-shrink-0">
          <div className="flex items-start sm:items-center justify-between gap-2 mb-4 min-w-0">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 truncate">
                Mes documents
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Gestion électronique de vos documents
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative hidden sm:block w-40 lg:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 text-sm"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                className="lg:hidden border-slate-200"
                onClick={() => setShowTree(true)}
                aria-label="Dossiers"
              >
                <FolderOpen className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-[#840040] hover:bg-[#a00050] gap-2 text-sm px-3 sm:px-4 flex-shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Déposer</span>
              </Button>
            </div>
          </div>

          {/* Search bar mobile */}
          <div className="relative sm:hidden mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 text-sm w-full"
            />
          </div>

          {/* Folder Tabs — overflow-x-auto pour éviter le stretch */}
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4">
            <FolderTabs
              value={activeFolder.split("/")[0]}
              onChange={setActiveFolder}
            />
          </div>
        </div>

        {/* ── Grille principale ── */}
        <div className="flex-1 overflow-hidden min-h-0">
          <div
            className="h-full grid gap-4 lg:gap-6 overflow-hidden
            grid-cols-1
            md:grid-cols-[1fr_38%]
            lg:grid-cols-[220px_1fr_36%]
          "
          >
            {/* Tree — lg uniquement, largeur fixe en px pour ne pas gonfler */}
            <div className="hidden lg:flex flex-col overflow-y-auto min-w-0">
              <DocumentTree
                selectedFolder={activeFolder}
                onFolderSelect={setActiveFolder}
              />
            </div>

            {/* Liste documents */}
            <div className="overflow-y-auto min-w-0">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileX className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">
                    Aucun document
                  </h3>
                  <p className="text-slate-500 mt-1 text-sm">
                    {searchTerm
                      ? "Aucun document ne correspond à votre recherche"
                      : "Commencez par déposer un document"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className="cursor-pointer"
                    >
                      <DocumentCard
                        document={doc}
                        onDelete={handleDelete}
                        canDelete={doc.uploadedBy === "client"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Viewer — masqué sur mobile */}
            <div className="hidden md:flex flex-col overflow-y-auto min-w-0">
              <DocumentViewer
                document={selectedDocument}
                onClose={() => setSelectedDocument(null)}
              />
            </div>
          </div>
        </div>

        {/* ── Viewer overlay mobile ── */}
        {selectedDocument && (
          <div className="md:hidden fixed inset-0 z-40 bg-white flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
              <h2 className="font-semibold text-slate-800 text-sm truncate pr-4">
                {selectedDocument.name}
              </h2>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-1 rounded-lg hover:bg-slate-100 flex-shrink-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DocumentViewer
                document={selectedDocument}
                onClose={() => setSelectedDocument(null)}
              />
            </div>
          </div>
        )}

        {/* ── Drawer tree (mobile + tablette) ── */}
        {showTree && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowTree(false)}
            />
            <div className="relative z-10 w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                <span className="font-semibold text-slate-800 text-sm">
                  Dossiers
                </span>
                <button
                  onClick={() => setShowTree(false)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <DocumentTree
                  selectedFolder={activeFolder}
                  onFolderSelect={(folder) => {
                    setActiveFolder(folder);
                    setShowTree(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <UploadModal
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          userEmail={user?.email}
        />
      </div>
    </div>
  );
}
