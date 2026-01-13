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
      <TabsList className="bg-slate-100 p-1 h-auto flex-wrap justify-start">
        {folders.map((folder) => (
          <TabsTrigger
            key={folder.value}
            value={folder.value}
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 px-4"
          >
            <folder.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{folder.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
