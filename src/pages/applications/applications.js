import { useState } from "react";
import {
  Globe,
  Calculator,
  Users,
  Building2,
  CreditCard,
  Inbox,
} from "lucide-react";

import AppShortcutCard from "./AppShortcutCard";
import { appList } from "./appList";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

const categories = [
  { value: "all", label: "Tous", icon: Globe },
  { value: "fiscal", label: "Fiscal", icon: Calculator },
  { value: "social", label: "Social", icon: Users },
  { value: "bancaire", label: "Bancaire", icon: CreditCard },
  { value: "administratif", label: "Administratif", icon: Building2 },
];

export default function Applications() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredApps =
    activeCategory === "all"
      ? appList
      : appList.filter((app) => app.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">
            Applications
          </h1>
          <p className="text-slate-500 mt-1">
            Accès rapide à vos outils et services
          </p>
        </div>

        {/* Catégories (remplacement des Tabs) */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-slate-100 p-1 flex-wrap h-auto">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="data-[state=active]:bg-white gap-2"
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Liste des apps */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              Aucune application
            </h3>
            <p className="text-slate-500 mt-1">
              Aucun raccourci n'est disponible
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredApps.map((app) => (
              <AppShortcutCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
