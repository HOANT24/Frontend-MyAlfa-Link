import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { prestations } from "./prestationsData";
import {
  Briefcase,
  Calculator,
  FileText,
  Users,
  Scale,
  TrendingUp,
  Search,
} from "lucide-react";

const categoryLabels = {
  comptabilite: "Comptabilité",
  fiscal: "Fiscal",
  social: "Social",
  juridique: "Juridique",
  conseil: "Conseil",
  autre: "Autre",
};

const categoryIcons = {
  comptabilite: Calculator,
  fiscal: FileText,
  social: Users,
  juridique: Scale,
  conseil: TrendingUp,
  autre: Briefcase,
};

const categoryColors = {
  comptabilite: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: "text-blue-600",
  },
  fiscal: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: "text-emerald-600",
  },
  social: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    icon: "text-violet-600",
  },
  juridique: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: "text-amber-600",
  },
  conseil: { bg: "bg-pink-100", text: "text-pink-700", icon: "text-pink-600" },
  autre: { bg: "bg-slate-100", text: "text-slate-700", icon: "text-slate-600" },
};

export default function Prestations() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrestations = prestations.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categoryLabels[p.category] &&
        categoryLabels[p.category]
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getPriceDisplay = (prestation) => {
    if (prestation.price_type === "sur_devis") return "Sur devis";
    if (!prestation.price) return "Nous contacter";
    const price = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(prestation.price);
    if (prestation.price_type === "horaire") return `${price} / heure`;
    if (prestation.price_type === "forfait") return `${price} / forfait`;
    return price;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-3 sm:mb-8">
          <h1 className="text-base sm:text-2xl font-semibold text-slate-800">
            Prestations complémentaires
          </h1>
          <p className="text-xs sm:text-base text-slate-500 mt-0.5 hidden sm:block">
            Découvrez nos prestations et tarifs associés
          </p>
        </div>

        {/* Filtres + Search */}
        <div className="bg-white rounded-2xl shadow-sm p-2 sm:p-4 mb-3 sm:mb-6">
          {/* Mobile : select natif — pas de scroll horizontal */}
          <div className="block sm:hidden mb-2">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#840040]"
            >
              <option value="all">Toutes les catégories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop : tabs normaux */}
          <div className="hidden sm:block">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="bg-slate-100 p-1 flex-wrap h-auto">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white text-sm px-3 py-1.5"
                >
                  Tous
                </TabsTrigger>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-white text-sm px-3 py-1.5"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Search */}
          <div className="relative mt-2 sm:mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 border border-slate-200 rounded-xl py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#840040]"
            />
          </div>
        </div>

        {/* Empty state */}
        {filteredPrestations.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-800">
              Aucune prestation
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Contactez-nous pour plus d'informations
            </p>
          </div>
        ) : (
          /* 2 colonnes sur mobile et tablette, 3 sur desktop */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {filteredPrestations.map((p) => {
              const Icon = categoryIcons[p.category];
              const colors = categoryColors[p.category];

              return (
                <div
                  key={p.id}
                  className="p-2.5 sm:p-5 bg-white shadow-sm hover:shadow-md transition-all flex flex-col rounded-xl sm:rounded-2xl"
                >
                  {/* Icône + badge */}
                  <div className="flex items-start gap-2 mb-2">
                    <div
                      className={`w-7 h-7 sm:w-10 sm:h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${colors.icon}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-[11px] sm:text-base leading-tight line-clamp-2">
                        {p.title}
                      </h3>
                    </div>
                  </div>

                  {/* Badge catégorie */}
                  <span
                    className={`${colors.bg} ${colors.text} text-[9px] sm:text-xs mb-2 self-start inline-flex items-center px-1.5 sm:px-3 py-0.5 sm:py-1 font-medium rounded-full whitespace-nowrap`}
                  >
                    {categoryLabels[p.category]}
                  </span>

                  {/* Description */}
                  <p className="text-slate-500 text-[10px] sm:text-sm line-clamp-2 flex-1 mb-2">
                    {p.description}
                  </p>

                  {/* Durée */}
                  {p.duration && (
                    <p className="text-[9px] sm:text-xs text-slate-400 mb-1.5">
                      Durée : {p.duration}
                    </p>
                  )}

                  {/* Prix */}
                  <div className="pt-1.5 sm:pt-3 border-t border-slate-100 mt-auto">
                    <span className="text-sm sm:text-xl font-bold text-[#840040]">
                      {getPriceDisplay(p)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
