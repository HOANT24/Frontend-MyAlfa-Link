import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AnnualMetricsChart({ data = [] }) {
  // Group by year and aggregate
  const yearlyData = data.reduce((acc, item) => {
    const year = new Date(item.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = { year, ca: 0, result: 0, treasury: 0, count: 0 };
    }
    acc[year].ca += item.income || 0;
    acc[year].result += (item.income || 0) - (item.expenses || 0);
    acc[year].treasury = item.balance || 0; // Keep latest balance
    acc[year].count++;
    return acc;
  }, {});

  const formattedData = Object.values(yearlyData).sort(
    (a, b) => a.year - b.year
  );

  return (
    <div className="p-6 border-0 bg-white shadow-sm shadow-sm hover:shadow-md rounded-xl ">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-500">
          Évolution Annuelle
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Chiffre d'affaires, Résultat et Trésorerie
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [
              new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(value),
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            formatter={(value) => {
              if (value === "ca") return "Chiffre d'affaires";
              if (value === "result") return "Résultat";
              if (value === "treasury") return "Trésorerie";
              return value;
            }}
          />
          <Bar dataKey="ca" fill="#840040" radius={[4, 4, 0, 0]} />
          <Bar dataKey="result" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="treasury" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
