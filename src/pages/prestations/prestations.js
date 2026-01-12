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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">
            Prestations complémentaires
          </h1>
          <p className="text-slate-500 mt-1">
            Découvrez nos prestations et tarifs associés
          </p>
        </div>

        {/* Tabs + Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-slate-100 p-1 flex-wrap h-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                Tous
              </TabsTrigger>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-white"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une prestation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 border border-slate-200 rounded-md py-2"
            />
          </div>
        </div>

        {filteredPrestations.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800">
              Aucune prestation disponible
            </h3>
            <p className="text-slate-500 mt-1">
              Contactez-nous pour plus d'informations
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrestations.map((p) => {
              const Icon = categoryIcons[p.category];
              const colors = categoryColors[p.category];

              return (
                <div
                  key={p.id}
                  className="p-5 border-0 bg-white shadow-sm hover:shadow-md transition-all flex flex-col rounded-2xl "
                >
                  {/* Header avec icône et badge */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-base line-clamp-1">
                        {p.title}
                      </h3>
                      <div
                        variant="secondary"
                        className={`${colors.bg} ${colors.text} border-0 text-xs mt-1 inline-flex items-center
          px-3 py-1
          text-xs font-medium
          rounded-full
          whitespace-nowrap`}
                      >
                        {categoryLabels[p.category]}
                      </div>
                    </div>
                  </div>

                  {/* Description et durée */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {p.description}
                      </p>
                      {p.duration && (
                        <p className="text-xs text-slate-500 mb-3">
                          Durée : {p.duration}
                        </p>
                      )}
                    </div>

                    {/* Prix aligné en bas */}
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-xl font-bold text-[#840040]">
                        {getPriceDisplay(p)}
                      </span>
                    </div>
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
