import React, { useEffect, useRef } from "react";

const PanelVueEnsemble = ({ indicators }) => {
  const barChartRef = useRef(null);
  const barInstance = useRef(null);

  const cr = indicators?.compte_de_resultat || {};
  const client = indicators?.client || {};

  const exerciceN = client.exercice_N || "N";
  const exerciceN1 = client.exercice_N1 || "N-1";
  const caN = cr.ca_N || 0;
  const caN1 = cr.ca_N1 || 0;

  useEffect(() => {
    let cancelled = false;

    const ensureChartJs = () =>
      new Promise((resolve, reject) => {
        if (window.Chart) return resolve(window.Chart);
        const existing = document.getElementById("chartjs-cdn");
        if (existing) {
          existing.addEventListener("load", () => resolve(window.Chart));
          existing.addEventListener("error", reject);
          return;
        }
        const s = document.createElement("script");
        s.id = "chartjs-cdn";
        s.src =
          "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
        s.async = true;
        s.onload = () => resolve(window.Chart);
        s.onerror = reject;
        document.head.appendChild(s);
      });

    ensureChartJs().then((Chart) => {
      if (cancelled || !Chart) return;

      Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
      Chart.defaults.font.size = 11;
      Chart.defaults.color = "#8A849A";

      if (barInstance.current) barInstance.current.destroy();

      if (barChartRef.current) {
        barInstance.current = new Chart(barChartRef.current, {
          type: "bar",
          data: {
            labels: [exerciceN1, exerciceN],
            datasets: [
              {
                label: "Chiffre d'affaires",
                data: [caN1, caN],
                backgroundColor: ["#DDD8E8", "#7E1738"],
                borderRadius: 8,
                borderSkipped: false,
                barPercentage: 0.45,
                categoryPercentage: 0.6,
              },
            ],
          },
          options: {
            layout: { padding: { top: 40, left: 8, right: 8, bottom: 4 } },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => ctx.parsed.y.toLocaleString("fr-FR") + " €",
                },
              },
            },
            scales: {
              y: {
                grid: { color: "#E6E3EC" },
                border: { display: false },
                ticks: {
                  callback: (v) => v.toLocaleString("fr-FR") + " €",
                  maxTicksLimit: 6,
                },
              },
              x: {
                grid: { display: false },
                border: { display: false },
                ticks: { font: { size: 13, weight: "600" } },
              },
            },
            animation: {
              onComplete: function () {
                const chart = this;
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = "600 12px 'DM Sans', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                chart.data.datasets.forEach((dataset, i) => {
                  chart.getDatasetMeta(i).data.forEach((bar, j) => {
                    const val = dataset.data[j];
                    ctx.fillStyle = "#4A4460";
                    ctx.fillText(
                      val.toLocaleString("fr-FR") + " €",
                      bar.x,
                      bar.y - 6
                    );
                  });
                });
                ctx.restore();
              },
            },
          },
        });
      }
    });

    return () => {
      cancelled = true;
      if (barInstance.current) {
        barInstance.current.destroy();
        barInstance.current = null;
      }
    };
  }, [caN, caN1, exerciceN, exerciceN1]);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <style>{`
        .ca-card {
          background: #fff;
          width: 100%;
          box-sizing: border-box;
        }
        .ca-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
        }
        .ca-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #1A1525;
        }
        .ca-card-sub {
          font-size: 12px;
          color: #8A849A;
          background: #F5F3FF;
          border: 1px solid #EDE9FE;
          border-radius: 20px;
          padding: 3px 10px;
        }
        .ca-chart-box {
          position: relative;
          width: 100%;
          height: 280px;
        }
        .ca-chart-box canvas {
          width: 100% !important;
          display: block;
        }

        @media (max-width: 640px) {
          .ca-card {
            border-radius: 10px;
          }
          .ca-card-title {
            font-size: 13px;
          }
          .ca-chart-box {
            height: 220px;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .ca-chart-box {
            height: 260px;
          }
        }
      `}</style>

      <div className="ca-card">
        <div className="ca-card-head"></div>
        <div className="ca-chart-box">
          <canvas ref={barChartRef} />
        </div>
      </div>
    </div>
  );
};

export default PanelVueEnsemble;
