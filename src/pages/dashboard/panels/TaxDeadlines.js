import { FileText, CheckCircle, ExternalLink, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { openCrmPresentation } from "../crmGenerate";

export default function CompteRenduList({ data = {} }) {
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
    ].sort((a, b) => b - a);
  }, [suiviBilans]);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow:
          "0 1px 4px rgba(0,0,0,0.06), 0 4px 24px rgba(126,23,56,0.06)",
        border: "1px solid #F0EDF4",
      }}
    >
      {/* Header */}
      <div
        className="px-4 sm:px-6 py-3.5 sm:py-5 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, #7E1738 0%, #A52050 100%)",
        }}
      >
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wide">
            Comptes Rendus
          </h3>
          <p
            className="text-[10px] sm:text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Bilans annuels disponibles
          </p>
        </div>
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-5">
        {/* Empty state */}
        {annees.length === 0 ? (
          <div className="text-center py-6 sm:py-10 flex flex-col items-center gap-2 sm:gap-3">
            <div
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "#F0FDF4", border: "1px solid #DCFCE7" }}
            >
              <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-green-500" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Aucun compte rendu disponible
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                Les bilans apparaîtront ici une fois enregistrés
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {annees.map((annee, index) => {
              const item = suiviBilans.find(
                (b) => (b?.annee ?? b?.annees) === annee
              );
              const isLatest = index === 0;

              return (
                <div
                  key={annee}
                  className="flex items-center justify-between rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 transition-all duration-200"
                  style={{
                    background: isLatest ? "#FDF0F3" : "#F8F7FB",
                    border: isLatest
                      ? "1px solid #F2D0DA"
                      : "1px solid #EEEBF4",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(2px)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(126,23,56,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Left */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isLatest
                          ? "rgba(126,23,56,0.1)"
                          : "#EDEAF4",
                      }}
                    >
                      <TrendingUp
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        style={{ color: isLatest ? "#7E1738" : "#8A849A" }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <p
                          className="text-xs sm:text-sm font-semibold truncate"
                          style={{ color: "#1A1525" }}
                        >
                          Exercice {annee}
                        </p>
                        {isLatest && (
                          <span
                            className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              background: "rgba(126,23,56,0.1)",
                              color: "#7E1738",
                            }}
                          >
                            Récent
                          </span>
                        )}
                      </div>
                      <p
                        className="text-[10px] sm:text-xs mt-0.5"
                        style={{ color: "#8A849A" }}
                      >
                        Compte rendu annuel
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() =>
                      item && openCrmPresentation(item.indicators, item.result)
                    }
                    className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-200 flex-shrink-0 ml-2"
                    style={{
                      border: "1px solid #7E1738",
                      color: "#7E1738",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#7E1738";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(126,23,56,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#7E1738";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
