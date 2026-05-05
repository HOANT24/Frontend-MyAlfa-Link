import React, { useMemo, useState, useEffect } from "react";
import { FileText, AlertCircle } from "lucide-react";
import PanelVueEnsemble from "./panels/PanelVueEnsemble";

export default function AnnualMetricsChart({ data = {} }) {
  const suiviBilans = useMemo(() => {
    return data?.suiviBilans || [];
  }, [data]);

  const annees = useMemo(() => {
    return [...new Set(suiviBilans.map((item) => item.annees))].sort(
      (a, b) => a - b
    );
  }, [suiviBilans]);

  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (annees.length > 0) {
      setSelectedYear(annees[0]); // année la plus ancienne
    }
  }, [annees]);

  const selectedData = useMemo(() => {
    return suiviBilans.find((item) => item.annees === selectedYear) || null;
  }, [selectedYear, suiviBilans]);

  const hasSelectedData = !!selectedData;
  const hasIndicators = !!selectedData?.indicators;

  // 🔴 CAS 1 : aucun bilan
  if (!suiviBilans.length) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
        <FileText className="w-10 h-10 text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm font-medium">
          Aucun compte rendu disponible
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Aucun bilan n’a encore été enregistré pour ce dossier.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 border-0 bg-white shadow-sm hover:shadow-md rounded-xl">
      {/* HEADER */}
      <div className="mb-2 flex items-center justify-between">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-500">
            Évolution Annuelle
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Chiffre d'affaires, Résultat et Trésorerie
          </p>
        </div>
      </div>

      {/* ⚠️ CAS : année sélectionnée sans data */}
      {hasSelectedData && !hasIndicators && (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm font-medium">
            Aucun compte rendu disponible pour cette année
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Les données pour l’année sélectionnée ne sont pas encore
            renseignées.
          </p>
        </div>
      )}

      {/* ✅ CAS NORMAL */}
      {hasIndicators && (
        <div className="flex w-full h-full">
          <PanelVueEnsemble
            indicators={selectedData.indicators}
            result={selectedData.result}
          />
        </div>
      )}
    </div>
  );
}
