import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Folder,
  Calculator,
  FileCheck,
  Users,
  Scale,
  Archive,
} from "lucide-react";

const folders = [
  { value: "all", label: "Tous", icon: Folder },
  { value: "comptabilite", label: "Comptabilité", icon: Calculator },
  { value: "fiscal", label: "Fiscal", icon: FileCheck },
  { value: "social", label: "Social", icon: Users },
  { value: "juridique", label: "Juridique", icon: Scale },
  { value: "divers", label: "Divers", icon: Archive },
];

export default function FolderTabs({ value, onChange }) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList
        className="
          bg-slate-100 p-1 h-auto
          flex flex-nowrap overflow-x-auto
          scrollbar-none
          justify-start
          gap-0.5
        "
      >
        {folders.map((folder) => (
          <TabsTrigger
            key={folder.value}
            value={folder.value}
            className="
              data-[state=active]:bg-white data-[state=active]:shadow-sm
              flex-shrink-0
              flex items-center gap-1.5
              px-2.5 sm:px-4
              py-1.5
              text-xs sm:text-sm
              whitespace-nowrap
            "
          >
            <folder.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            {/* Toujours visible mais taille réduite sur mobile */}
            <span className="hidden xs:inline sm:inline">{folder.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
