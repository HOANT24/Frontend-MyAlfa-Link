import React, { useMemo, useState, useEffect } from "react";
import { FileText, AlertCircle, Download } from "lucide-react";
import PanelVueEnsemble from "./panels/PanelVueEnsemble";
import { openCrmDownload } from "./crmDownload";

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
        <h3 className="text-sm font-medium text-slate-500">
          Compte Rendu annuel - {selectedYear}
        </h3>

        <div className="flex gap-2">
          {annees.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                selectedYear === year
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* DOWNLOAD */}
      {hasIndicators && (
        <div className="mb-4 mt-4 flex items-center gap-4 w-full justify-end">
          <button
            onClick={() => {
              openCrmDownload(selectedData.indicators, selectedData.result);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 shadow-sm"
            style={{ borderColor: "#7E1738", color: "#7E1738" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#7E1738";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#7E1738";
            }}
          >
            <Download className="w-4 h-4" />
            Télécharger le Compte Rendu complet
          </button>
        </div>
      )}

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
