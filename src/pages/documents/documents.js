import { useState, useContext } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, Upload, Search, FileX, FolderOpen, X, SlidersHorizontal, Check, ChevronRight } from "lucide-react";

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
  const [mobileFolderView, setMobileFolderView] = useState(true);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [tempActiveFolder, setTempActiveFolder] = useState("all");

  const mobileFolders = [
    { value: "all", label: "Tous les dossiers" },
    { value: "comptabilite", label: "Comptabilité" },
    { value: "fiscal", label: "Fiscal" },
    { value: "social", label: "Social" },
    { value: "juridique", label: "Juridique" },
    { value: "divers", label: "Divers" },
  ];

  const folderBreadcrumb = {
    all: "Tous les documents",
    comptabilite: "Comptabilite",
    fiscal: "Fiscal",
    social: "Social",
    juridique: "Juridique",
    divers: "Divers",
  };

  const activeFilterCount = (activeFolder !== "all" ? 1 : 0) + (searchTerm ? 1 : 0);

  const openFilterModal = () => {
    setTempSearchTerm(searchTerm);
    setTempActiveFolder(activeFolder);
    setFilterModalOpen(true);
  };

  const applyFilters = () => {
    setSearchTerm(tempSearchTerm);
    setActiveFolder(tempActiveFolder);
    setFilterModalOpen(false);
  };

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
    <>
      {/* ══ VUE 1 : Liste des dossiers (mobile uniquement, vue initiale) ══ */}
      {mobileFolderView && (
        <div className="sm:hidden min-h-screen bg-slate-50 px-4 pt-5 pb-24">
          <div className="flex items-start justify-between mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Mes documents</h1>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-[#840040] hover:bg-[#a00050] gap-2 text-sm px-4 rounded-xl"
            >
              <Upload className="w-4 h-4" />
              Déposer
            </Button>
          </div>
          <p className="text-slate-500 text-sm mb-4">Mes documents &gt; Dossiers</p>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un dossier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 text-sm w-full rounded-xl bg-white"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
            {[
              { value: "all", label: "Tous les documents", color: "text-slate-400" },
              { value: "comptabilite", label: "Comptabilité", color: "text-blue-500" },
              { value: "fiscal", label: "Fiscal", color: "text-green-500" },
              { value: "social", label: "Social", color: "text-purple-500" },
              { value: "juridique", label: "Juridique", color: "text-orange-500" },
              { value: "divers", label: "Divers", color: "text-slate-400" },
            ].map((folder) => {
              const count = folder.value === "all"
                ? documents.length
                : documents.filter(d => d.folder === folder.value).length;
              return (
                <button
                  key={folder.value}
                  onClick={() => { setActiveFolder(folder.value); setMobileFolderView(false); }}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-slate-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <FolderOpen className={`w-5 h-5 flex-shrink-0 ${folder.color}`} />
                  <span className="flex-1 text-left text-sm font-semibold text-slate-800">{folder.label}</span>
                  <span className="text-sm text-slate-400 mr-2">{count}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ VUE 2 : Liste des documents (desktop toujours + mobile après clic dossier) ══ */}
      <div className={`min-h-screen bg-slate-50 overflow-hidden ${mobileFolderView ? "hidden sm:block" : "block"}`}>
      <div className="h-screen flex flex-col px-3 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-hidden">
        {/* ── Header ── */}
        <div className="mb-4 sm:mb-6 flex-shrink-0">
          <div className="flex items-start sm:items-center justify-between gap-2 mb-4 min-w-0">
            <div className="min-w-0">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 truncate">
                  Mes documents
                </h1>
                <p className="text-slate-500 mt-1 text-sm sm:hidden">
                  Mes documents &gt; {folderBreadcrumb[activeFolder.split("/")[0]] || "Tous les documents"}
                </p>
                <p className="text-slate-500 mt-1 text-sm hidden sm:block">
                  Gestion électronique de vos documents
                </p>
              </div>
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
                className="hidden md:flex lg:hidden border-slate-200"
                onClick={() => setShowTree(true)}
                aria-label="Dossiers"
              >
                <FolderOpen className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-[#840040] hover:bg-[#a00050] gap-2 text-sm px-4 flex-shrink-0 rounded-xl"
              >
                <Upload className="w-4 h-4" />
                <span>Déposer</span>
              </Button>
            </div>
          </div>

          {/* Mobile : chips actifs + bouton Filtres */}
          <div className="sm:hidden flex items-center gap-2 flex-wrap">
            {activeFolder !== "all" && (
              <span className="flex items-center gap-1.5 text-sm font-medium bg-rose-50 text-[#840040] border border-rose-200 px-3 py-1 rounded-full">
                {mobileFolders.find(f => f.value === activeFolder)?.label}
                <button onClick={() => setActiveFolder("all")}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {searchTerm && (
              <span className="flex items-center gap-1.5 text-sm font-medium bg-rose-50 text-[#840040] border border-rose-200 px-3 py-1 rounded-full">
                "{searchTerm}"
                <button onClick={() => setSearchTerm("")}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            <button
              onClick={openFilterModal}
              className={`flex items-center gap-2 text-sm font-medium border px-3 py-1.5 rounded-lg ${
                activeFilterCount > 0 ? "border-[#840040] text-[#840040]" : "border-slate-200 text-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#840040] text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop folder tabs */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-sm p-3 sm:p-4">
            <FolderTabs value={activeFolder.split("/")[0]} onChange={setActiveFolder} />
          </div>
        </div>

        {/* ── Grille principale ── */}
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="h-full grid gap-4 lg:gap-6 overflow-hidden grid-cols-1 md:grid-cols-[1fr_38%] lg:grid-cols-[220px_1fr_36%]">
            <div className="hidden lg:flex flex-col overflow-y-auto min-w-0">
              <DocumentTree selectedFolder={activeFolder} onFolderSelect={setActiveFolder} />
            </div>
            <div className="overflow-y-auto overflow-x-hidden min-w-0">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileX className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">Aucun document</h3>
                  <p className="text-slate-500 mt-1 text-sm">
                    {searchTerm ? "Aucun document ne correspond à votre recherche" : "Déposez un document"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} onClick={() => setSelectedDocument(doc)} className="cursor-pointer overflow-hidden">
                      <DocumentCard document={doc} onDelete={handleDelete} canDelete={doc.uploadedBy === "client"} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden md:flex flex-col overflow-y-auto min-w-0">
              <DocumentViewer document={selectedDocument} onClose={() => setSelectedDocument(null)} />
            </div>
          </div>
        </div>

        {/* Viewer overlay mobile */}
        {selectedDocument && (
          <div className="md:hidden fixed inset-0 z-[60] bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0">
              <div className="min-w-0 flex-1 pr-3">
                <h2 className="font-semibold text-slate-800 text-sm truncate">{selectedDocument.name}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-px rounded ${{ comptabilite: "bg-blue-100 text-blue-700", fiscal: "bg-emerald-100 text-emerald-700", social: "bg-violet-100 text-violet-700", juridique: "bg-amber-100 text-amber-700", divers: "bg-slate-100 text-slate-700" }[selectedDocument.folder]}`}>
                    {{ comptabilite: "Comptabilité", fiscal: "Fiscal", social: "Social", juridique: "Juridique", divers: "Divers" }[selectedDocument.folder]}
                  </span>
                  {selectedDocument.year && (
                    <span className="text-[10px] border border-slate-200 text-slate-500 px-1.5 py-px rounded">{selectedDocument.year}</span>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedDocument(null)} className="p-1.5 rounded-lg hover:bg-slate-100 flex-shrink-0">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <DocumentViewer document={selectedDocument} onClose={() => setSelectedDocument(null)} hideHeader />
            </div>
          </div>
        )}

        {/* Drawer tree */}
        {showTree && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowTree(false)} />
            <div className="relative z-10 w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                <span className="font-semibold text-slate-800 text-sm">Dossiers</span>
                <button onClick={() => setShowTree(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <DocumentTree selectedFolder={activeFolder} onFolderSelect={(folder) => { setActiveFolder(folder); setShowTree(false); }} />
              </div>
            </div>
          </div>
        )}

        <UploadModal open={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={handleUpload} userEmail={user?.email} />

        {/* Filter Modal mobile */}
        {filterModalOpen && (
          <div className="sm:hidden fixed inset-0 z-[70] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFilterModalOpen(false)} />
            <div className="relative z-10 bg-white rounded-t-2xl shadow-xl flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-800">Filtrer les documents</h2>
                <button onClick={() => setFilterModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                {/* Recherche */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Recherche</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Nom ou description..."
                      value={tempSearchTerm}
                      onChange={(e) => setTempSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 text-sm w-full"
                    />
                  </div>
                </div>

                {/* Dossier */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Dossier</p>
                  <div className="space-y-1">
                    {mobileFolders.map((folder) => (
                      <button
                        key={folder.value}
                        onClick={() => setTempActiveFolder(folder.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                          tempActiveFolder === folder.value
                            ? "bg-rose-50 text-[#840040] font-medium"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {folder.label}
                        {tempActiveFolder === folder.value && (
                          <Check className="w-4 h-4 text-[#840040]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Appliquer */}
              <div className="px-5 py-4 border-t border-slate-100">
                <button
                  onClick={applyFilters}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[#840040] hover:bg-[#a00050] transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
