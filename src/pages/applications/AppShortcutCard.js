import {
  ExternalLink,
  Globe,
  Calculator,
  Users,
  Building2,
  CreditCard,
  FileText,
} from "lucide-react";

const iconMap = {
  Globe,
  Calculator,
  Users,
  Building2,
  CreditCard,
  FileText,
};

const categoryColors = {
  fiscal: { bg: "bg-emerald-50", text: "text-emerald-600" },
  social: { bg: "bg-violet-50", text: "text-violet-600" },
  bancaire: { bg: "bg-blue-50", text: "text-blue-600" },
  administratif: { bg: "bg-amber-50", text: "text-amber-600" },
  autre: { bg: "bg-slate-50", text: "text-slate-600" },
};

export default function AppShortcutCard({ app }) {
  const Icon = iconMap[app.icon] || Globe;
  const colors = categoryColors[app.category] || categoryColors.autre;

  return (
    <div
      onClick={() => window.open(app.url, "_blank")}
      className="p-5 bg-white rounded-2xl cursor-pointer border border-slate-100
                   hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
      </div>

      <h3 className="font-semibold text-slate-800 mt-4">{app.name}</h3>

      {app.description && (
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
          {app.description}
        </p>
      )}
    </div>
  );
}
