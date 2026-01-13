import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, Upload, Search, FileX } from "lucide-react";

import FolderTabs from "./FolderTabs";
import DocumentCard from "./DocumentCard";
import UploadModal from "./UploadModal";
import DocumentTree from "./DocumentTree";
import DocumentViewer from "./DocumentViewer";

import { documentsData } from "./DocumentsData";

export default function Documents() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fake user (en attendant l'API)
      const fakeUser = {
        email: "client@test.com",
        name: "Client Test",
      };

      setUser(fakeUser);

      // Simulation d'un tri par date décroissante
      const sortedDocs = [...documentsData].sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      );

      setDocuments(sortedDocs);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (docData) => {
    const newDoc = {
      id: crypto.randomUUID(),
      created_date: new Date().toISOString(),
      uploaded_by: "client",
      ...docData,
    };

    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
  };

  const handleDelete = async (id) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const filteredDocuments = documents.filter((doc) => {
    // 1️⃣ Gestion du dossier / sous-dossier
    let matchesFolder = false;

    if (activeFolder === "all") {
      matchesFolder = true;
    } else if (activeFolder.includes("/")) {
      // Sous-dossier → match strict sur le path
      matchesFolder = doc.path === activeFolder;
    } else {
      // Dossier parent → match sur le folder
      matchesFolder = doc.folder === activeFolder;
    }

    // 2️⃣ Recherche texte
    const matchesSearch =
      !searchTerm ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFolder && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">
                Mes documents
              </h1>
              <p className="text-slate-500 mt-1">
                Gestion électronique de vos documents
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200"
                />
              </div>
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-[#840040] hover:bg-[#a00050] gap-2 "
                style={{ paddingLeft: "16px", paddingRight: "16px" }}
              >
                <Upload className="w-4 h-4" />
                Déposer
              </Button>
            </div>
          </div>

          {/* Folder Tabs - Full Width */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <FolderTabs
              value={activeFolder.split("/")[0]}
              onChange={setActiveFolder}
            />
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Left: Tree Navigation */}
          <div className="w-64 flex-shrink-0">
            <DocumentTree
              selectedFolder={activeFolder}
              onFolderSelect={setActiveFolder}
            />
          </div>

          {/* Middle: Document List */}
          <div className="flex-1 overflow-y-auto">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileX className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">
                  Aucun document
                </h3>
                <p className="text-slate-500 mt-1">
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
                      canDelete={doc.uploaded_by === "client"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Document Viewer */}
          <div className="w-96 flex-shrink-0">
            <DocumentViewer
              document={selectedDocument}
              onClose={() => setSelectedDocument(null)}
            />
          </div>
        </div>

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
