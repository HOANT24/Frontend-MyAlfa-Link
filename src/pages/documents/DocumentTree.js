import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";

const folderStructure = [
  {
    id: "comptabilite",
    name: "Comptabilité",
    children: [
      { id: "comptabilite/factures", name: "Factures" },
      { id: "comptabilite/releves", name: "Relevés bancaires" },
      { id: "comptabilite/grand_livre", name: "Grand livre" },
    ],
  },
  {
    id: "fiscal",
    name: "Fiscal",
    children: [
      { id: "fiscal/declarations", name: "Déclarations" },
      { id: "fiscal/tva", name: "TVA" },
      { id: "fiscal/is", name: "Impôt sur les sociétés" },
    ],
  },
  {
    id: "social",
    name: "Social",
    children: [
      { id: "social/bulletins", name: "Bulletins de paie" },
      { id: "social/declarations", name: "Déclarations sociales" },
      { id: "social/contrats", name: "Contrats de travail" },
    ],
  },
  {
    id: "juridique",
    name: "Juridique",
    children: [
      { id: "juridique/statuts", name: "Statuts" },
      { id: "juridique/pv", name: "PV d'assemblée" },
      { id: "juridique/contrats", name: "Contrats" },
    ],
  },
  {
    id: "divers",
    name: "Divers",
    children: [],
  },
];

export default function DocumentTree({ onFolderSelect, selectedFolder }) {
  const [expandedFolders, setExpandedFolders] = useState([
    "comptabilite",
    "fiscal",
  ]);

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleFolderClick = (folderId) => {
    onFolderSelect(folderId);
  };

  return (
    <div className="p-4 border-0 bg-white shadow-sm h-full overflow-y-auto">
      <h3 className="text-sm font-semibold text-slate-800 mb-3 px-2">
        Arborescence
      </h3>
      <div className="space-y-1">
        <button
          onClick={() => handleFolderClick("all")}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
            selectedFolder === "all"
              ? "bg-slate-100 text-slate-800 font-medium"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Tous les documents</span>
        </button>

        {folderStructure.map((folder) => (
          <div key={folder.id}>
            <div className="flex items-center">
              {folder.children.length > 0 && (
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  {expandedFolders.includes(folder.id) ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              )}
              <button
                onClick={() => handleFolderClick(folder.id)}
                className={`flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedFolder === folder.id
                    ? "bg-slate-100 text-slate-800 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                } ${folder.children.length === 0 ? "ml-5" : ""}`}
              >
                <Folder className="w-4 h-4" />
                <span>{folder.name}</span>
              </button>
            </div>

            {expandedFolders.includes(folder.id) &&
              folder.children.length > 0 && (
                <div className="ml-6 mt-1 space-y-1">
                  {folder.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleFolderClick(child.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedFolder === child.id
                          ? "bg-slate-100 text-slate-800 font-medium"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5" />
                      <span>{child.name}</span>
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
