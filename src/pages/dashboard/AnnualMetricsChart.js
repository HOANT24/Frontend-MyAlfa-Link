import React, { useMemo, useState, useEffect } from "react";
import { FileText, AlertCircle } from "lucide-react";
import PanelVueEnsemble from "./panels/PanelVueEnsemble";

export default function AnnualMetricsChart({ data = {} }) {
  const suiviBilans = useMemo(() => {
    const bilans = data?.suiviBilans;
    if (!Array.isArray(bilans)) return [];
    return bilans;
  }, [data]);

  const annees = useMemo(() => {
    return [
      ...new Set(
        suiviBilans
          .map((item) => item?.annee ?? item?.annees)
          .filter((a) => a !== undefined && a !== null)
      ),
    ].sort((a, b) => a - b);
  }, [suiviBilans]);

  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (annees.length > 0) {
      setSelectedYear(annees[0]); // année la plus ancienne
    }
  }, [annees]);

  const selectedData = useMemo(() => {
    return (
      suiviBilans.find(
        (item) => (item?.annee ?? item?.annees) === selectedYear
      ) || null
    );
  }, [selectedYear, suiviBilans]);

  const hasSelectedData = !!selectedData;
  const hasIndicators = !!selectedData?.indicators;

  // CAS : aucun bilan
  if (!suiviBilans.length) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center text-center min-h-[160px]">
        <FileText className="w-10 h-10 text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm font-medium">
          Aucun compte rendu disponible
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Aucun bilan n'a encore été enregistré pour ce dossier.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 border-0 bg-white shadow-sm hover:shadow-md rounded-xl w-full">
      {/* HEADER */}
      <div className="mb-0 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-slate-500">
            Évolution Annuelle
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Chiffre d'affaires, Résultat et Trésorerie
          </p>
        </div>

        {/* YEAR SELECTOR — scrollable sur mobile */}
        {/* {annees.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {annees.map((annee) => {
              const isActive = annee === selectedYear;
              return (
                <button
                  key={annee}
                  onClick={() => setSelectedYear(annee)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    background: isActive ? "#7E1738" : "#F3F4F6",
                    color: isActive ? "#fff" : "#6B7280",
                    border: isActive
                      ? "1px solid #7E1738"
                      : "1px solid transparent",
                  }}
                >
                  {annee}
                </button>
              );
            })}
          </div>
        )} */}
      </div>

      {/* CAS : année sélectionnée sans indicateurs */}
      {hasSelectedData && !hasIndicators && (
        <div className="flex flex-col items-center justify-center text-center py-10 min-h-[120px]">
          <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm font-medium">
            Aucun compte rendu disponible pour cette année
          </p>
        </div>
      )}

      {/* CAS NORMAL */}
      {hasIndicators && (
        <div className="w-full overflow-x-auto">
          <PanelVueEnsemble
            indicators={selectedData.indicators}
            result={selectedData.result}
          />
        </div>
      )}
    </div>
  );
}
