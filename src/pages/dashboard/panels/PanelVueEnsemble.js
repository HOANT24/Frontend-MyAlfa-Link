import React, { useEffect, useMemo, useRef } from "react";

const PanelVueEnsemble = ({ indicators, result }) => {
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const barInstance = useRef(null);
  const donutInstance = useRef(null);

  // ── Parse result ──

  // ── Extraction des données ──
  const client = indicators?.client || {};
  const cr = indicators?.compte_de_resultat || {};
  const bilan = indicators?.bilan || {};

  const exerciceN = client.exercice_N || "N";
  const exerciceN1 = client.exercice_N1 || "N-1";

  const caN = cr.ca_N || 0;
  const caN1 = cr.ca_N1 || 0;
  const caVarPct = cr.ca_var_pct || 0;
  const achatsN = cr.achats_N || 0;
  const chargesNonStockeesN = cr.charges_non_stockees_N || 0;
  const chargesExternesN = cr.charges_externes_N || 0;
  const chargesFiscalesN = cr.charges_fiscales_N || 0;
  const chargesPersonnelN = cr.charges_personnel_N || 0;
  const dotationsN = cr.dotations_amortissements_N || 0;
  const chargesGestionN = cr.charges_gestion_N || 0;
  const margeCommercialeN = cr.marge_commerciale_N || 0;
  const valeurAjouteeN = cr.valeur_ajoutee_N || 0;
  const ebeN = cr.ebe_N || 0;
  const ebeN1 = cr.ebe_N1 || 0;
  const ebeVarPct = cr.ebe_var_pct || 0;
  const resultatNetN = cr.resultat_net_N || 0;

  const resultatNetVarPct = cr.resultat_net_var_pct || 0;

  const tresorerieN = bilan.tresorerie_N || 0;
  const tresorerieN1 = bilan.tresorerie_N1 || 0;
  const tresorerieVarPct = bilan.tresorerie_var_pct || 0;
  const cafN = bilan.caf_N || 0;

  const fmt = (v, d = 0) =>
    Number(v).toLocaleString("fr-FR", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  const fmtE = (v) => fmt(v) + " €";
  const fmtPct = (v) => (v >= 0 ? "+" : "") + fmt(v, 1) + "%";
  const deltaClass = (v) => (v >= 0 ? "pos" : "neg");
  const deltaArrow = (v) => (v >= 0 ? "▲" : "▼");

  const ebeKpi = ebeN >= 0 ? "kpi-green" : "kpi-red";
  const rnKpi = resultatNetN >= 0 ? "kpi-green" : "kpi-red";
  const tresoKpi = tresorerieN >= 0 ? "kpi-teal" : "kpi-red";

  // ── Alertes ──
  const alertes = useMemo(() => {
    const list = [];
    if (resultatNetN < 0) {
      list.push({
        type: "warn",
        title: "Résultat déficitaire",
        body: `Résultat net à ${fmtE(
          resultatNetN
        )} en ${exerciceN}. Amélioration de ${fmtPct(
          resultatNetVarPct
        )} vs ${exerciceN1}.`,
      });
    } else {
      list.push({
        type: "good",
        title: "Résultat positif",
        body: `Résultat net à ${fmtE(resultatNetN)} en ${exerciceN}, ${fmtPct(
          resultatNetVarPct
        )} vs ${exerciceN1}.`,
      });
    }
    if (ebeN < 0) {
      list.push({
        type: "warn",
        title: "EBE négatif",
        body: `EBE à ${fmtE(ebeN)}. Amélioration de ${fmtPct(
          ebeVarPct
        )} vs ${exerciceN1} (${fmtE(ebeN1)}).`,
      });
    } else {
      list.push({
        type: "good",
        title: "EBE positif",
        body: `EBE à ${fmtE(ebeN)}, ${fmtPct(ebeVarPct)} vs ${exerciceN1}.`,
      });
    }
    list.push({
      type: tresorerieVarPct < 0 ? "warn" : "good",
      title:
        tresorerieVarPct < 0 ? "Trésorerie en baisse" : "Trésorerie stable",
      body: `Trésorerie à ${fmtE(tresorerieN)} (${fmtPct(
        tresorerieVarPct
      )} vs ${exerciceN1} : ${fmtE(tresorerieN1)}).`,
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    resultatNetN,
    resultatNetVarPct,
    ebeN,
    ebeN1,
    ebeVarPct,
    tresorerieN,
    tresorerieN1,
    tresorerieVarPct,
    exerciceN,
    exerciceN1,
  ]);

  // ── Données donut (extraites pour satisfaire eslint-deps) ──
  const donut0 = Math.abs(achatsN);
  const donut1 = Math.abs(chargesExternesN + chargesNonStockeesN);
  const donut2 = Math.abs(chargesPersonnelN);
  const donut3 = Math.abs(chargesFiscalesN + chargesGestionN + dotationsN);

  const donutData = useMemo(
    () => [donut0, donut1, donut2, donut3],
    [donut0, donut1, donut2, donut3]
  );

  // ── Chargement Chart.js dynamique puis init des graphiques ──
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

      const BR = "#7E1738";
      const GL = "#E6E3EC";

      // Nettoie les instances existantes
      if (barInstance.current) barInstance.current.destroy();
      if (donutInstance.current) donutInstance.current.destroy();

      // ── Bar chart CA ──
      if (barChartRef.current) {
        barInstance.current = new Chart(barChartRef.current, {
          type: "bar",
          data: {
            labels: [exerciceN1, exerciceN],
            datasets: [
              {
                label: "Chiffre d'affaires",
                data: [caN1, caN],
                backgroundColor: ["#DDD8E8", BR],
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 180,
              },
            ],
          },
          options: {
            layout: { padding: { top: 70, left: 10 } },
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
                grid: { color: GL },
                border: { display: false },
                ticks: {
                  callback: (v) => v.toLocaleString("fr-FR") + " €",
                },
              },
              x: { grid: { display: false }, border: { display: false } },
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

      // ── Donut charges ──
      if (donutChartRef.current) {
        donutInstance.current = new Chart(donutChartRef.current, {
          type: "doughnut",
          data: {
            labels: [
              "Achats",
              "Ch. ext. + non stock.",
              "Personnel",
              "Fiscal + Gestion + Amort.",
            ],
            datasets: [
              {
                data: donutData,
                backgroundColor: [BR, "#A52050", "#C85080", "#E0AABF"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "62%",
            plugins: {
              legend: {
                position: "bottom",
                labels: { boxWidth: 9, padding: 10, font: { size: 10 } },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                    const pct =
                      total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                    return (
                      ctx.label +
                      " : " +
                      ctx.parsed.toLocaleString("fr-FR") +
                      " € (" +
                      pct +
                      "%)"
                    );
                  },
                },
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
      if (donutInstance.current) {
        donutInstance.current.destroy();
        donutInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caN, caN1, exerciceN, exerciceN1, donutData]);

  return (
    <div className="vue-ensemble-wrapper">
      <style>{`
        .vue-ensemble-wrapper {
          --brand:#7E1738; --brand-mid:#9B1F44;
          --border:#E6E3EC; --border-light:#F0EDF4;
          --text:#1A1525; --text-2:#4A4460; --muted:#8A849A;
          --blue:#2563EB; --blue-bg:#EFF6FF; --blue-mid:#DBEAFE;
          --green:#16A34A; --green-bg:#F0FDF4; --green-mid:#DCFCE7;
          --amber:#D97706; --amber-bg:#FFFBEB; --amber-mid:#FEF3C7;
          --red:#DC2626; --red-bg:#FEF2F2; --red-mid:#FEE2E2;
          --purple:#7C3AED; --purple-bg:#F5F3FF; --purple-mid:#EDE9FE;
          --teal:#0891B2; --teal-bg:#ECFEFF; --teal-mid:#CFFAFE;
          --indigo:#4F46E5; --indigo-bg:#EEF2FF; --indigo-mid:#C7D2FE;
          --radius:10px;
          font-family:'DM Sans',system-ui,sans-serif;
          color:var(--text);
          font-size:13px;
          display:flex;
          flex-direction:column;
          gap:16px;
        }
        .ve-kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .ve-kpi-card{background:var(--kpi-bg,var(--blue-bg));border:1px solid var(--kpi-mid,var(--blue-mid));border-radius:var(--radius);padding:16px 18px;display:flex;flex-direction:column;gap:3px;transition:transform .15s,box-shadow .15s}
        .ve-kpi-card:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.07)}
        .ve-kpi-number{font-size:22px;font-weight:700;color:var(--kpi-color,var(--blue));line-height:1.1;letter-spacing:-.02em}
        .ve-kpi-lbl{font-size:11px;font-weight:500;color:var(--kpi-color,var(--blue));opacity:.75;margin-top:1px}
        .ve-kpi-delta{display:inline-flex;align-items:center;font-size:10.5px;font-weight:500;padding:2px 8px;border-radius:20px;margin-top:5px;width:fit-content}
        .ve-kpi-delta.neg{background:rgba(220,38,38,.1);color:#B91C1C}
        .ve-kpi-delta.pos{background:rgba(22,163,74,.1);color:#15803D}
        .ve-kpi-delta.neu{background:rgba(100,100,120,.08);color:var(--text-2)}
        .kpi-blue{--kpi-bg:var(--blue-bg);--kpi-mid:var(--blue-mid);--kpi-color:var(--blue)}
        .kpi-green{--kpi-bg:var(--green-bg);--kpi-mid:var(--green-mid);--kpi-color:var(--green)}
        .kpi-red{--kpi-bg:var(--red-bg);--kpi-mid:var(--red-mid);--kpi-color:var(--red)}
        .kpi-teal{--kpi-bg:var(--teal-bg);--kpi-mid:var(--teal-mid);--kpi-color:var(--teal)}

        .ve-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px}
        .ve-card-sm{padding:14px 16px}
        .ve-card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
        .ve-card-title{font-size:12.5px;font-weight:600;color:var(--text)}
        .ve-card-sub{font-size:11px;color:var(--muted)}

        .ve-charts-grid{display:grid;grid-template-columns:3fr 2fr;gap:14px}
        .ve-right-col{display:flex;flex-direction:column;gap:14px}
        .ve-chart-box{position:relative;min-height:0}
        .ve-chart-box canvas{width:100%!important;display:block}

        .ve-alert-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .ve-alert-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;display:flex;gap:12px;align-items:flex-start}
        .ve-alert-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
        .ve-alert-card.warn .ve-alert-dot{background:var(--amber)}
        .ve-alert-card.info .ve-alert-dot{background:var(--brand)}
        .ve-alert-card.good .ve-alert-dot{background:var(--green)}
        .ve-alert-title{font-size:12px;font-weight:600;margin-bottom:3px}
        .ve-alert-card.warn .ve-alert-title{color:var(--amber)}
        .ve-alert-card.good .ve-alert-title{color:var(--green)}
        .ve-alert-body{font-size:11.5px;color:var(--muted);line-height:1.6}

        .ve-bilan-row{display:flex;justify-content:space-between;align-items:baseline;padding:7px 0;font-size:12.5px;border-bottom:1px solid var(--border-light)}
        .ve-bilan-label{color:var(--muted)}
        .ve-bilan-val{font-weight:600;color:var(--text);font-variant-numeric:tabular-nums}

        .ve-tile-analyse{background:var(--indigo-bg);border:1px solid var(--indigo-mid);border-left:3px solid var(--indigo);border-radius:var(--radius);padding:16px 18px}
        .ve-tile-analyse-head{display:flex;align-items:center;gap:8px;margin-bottom:10px}
        .ve-tile-analyse-lbl{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--indigo)}
        .ve-tile-analyse p{font-size:12.5px;line-height:1.8;color:#3730A3}
        .ve-tile-infos{background:#FDF0F3;border:1px solid #F2D0DA;border-left:3px solid var(--brand);border-radius:var(--radius);padding:16px 18px}
        .ve-tile-infos-head{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--brand);margin-bottom:10px}
        .ve-tile-infos p{font-size:12.5px;line-height:1.8;color:var(--text-2)}

        .ve-tiles-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}
      `}</style>

      {/* ── KPI GRID ── */}
      <div className="ve-kpi-grid">
        <div className="ve-kpi-card kpi-blue">
          <div className="ve-kpi-number">{fmtE(caN)}</div>
          <div className="ve-kpi-lbl">Chiffre d'affaires</div>
          <span className={`ve-kpi-delta ${deltaClass(caVarPct)}`}>
            {deltaArrow(caVarPct)} {fmtPct(caVarPct)} vs {exerciceN1}
          </span>
        </div>
        <div className={`ve-kpi-card ${ebeKpi}`}>
          <div className="ve-kpi-number">{fmtE(ebeN)}</div>
          <div className="ve-kpi-lbl">EBE</div>
          <span className={`ve-kpi-delta ${deltaClass(ebeVarPct)}`}>
            {deltaArrow(ebeVarPct)} {fmtPct(ebeVarPct)} vs {exerciceN1}
          </span>
        </div>
        <div className={`ve-kpi-card ${rnKpi}`}>
          <div className="ve-kpi-number">{fmtE(resultatNetN)}</div>
          <div className="ve-kpi-lbl">Résultat net</div>
          <span className={`ve-kpi-delta ${deltaClass(resultatNetVarPct)}`}>
            {deltaArrow(resultatNetVarPct)} {fmtPct(resultatNetVarPct)} vs{" "}
            {exerciceN1}
          </span>
        </div>
        <div className={`ve-kpi-card ${tresoKpi}`}>
          <div className="ve-kpi-number">{fmtE(tresorerieN)}</div>
          <div className="ve-kpi-lbl">Trésorerie</div>
          <span className={`ve-kpi-delta ${deltaClass(tresorerieVarPct)}`}>
            {deltaArrow(tresorerieVarPct)} {fmtPct(tresorerieVarPct)} vs{" "}
            {exerciceN1}
          </span>
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="ve-charts-grid">
        <div className="ve-card">
          <div className="ve-card-head">
            <div className="ve-card-title">Évolution du Chiffre d'Affaires</div>
            <span className="ve-card-sub">
              {exerciceN1} → {exerciceN}
            </span>
          </div>
          <div className="ve-chart-box" style={{ height: 240 }}>
            <canvas ref={barChartRef} />
          </div>
        </div>

        <div className="ve-right-col">
          <div className="ve-card">
            <div className="ve-card-head">
              <div className="ve-card-title">
                Répartition des charges {exerciceN}
              </div>
            </div>
            <div className="ve-chart-box" style={{ height: 160 }}>
              <canvas ref={donutChartRef} />
            </div>
          </div>

          <div className="ve-card ve-card-sm">
            <div className="ve-card-head" style={{ marginBottom: 8 }}>
              <div className="ve-card-title">Synthèse financière</div>
            </div>
            <div className="ve-bilan-row">
              <span className="ve-bilan-label">CA {exerciceN}</span>
              <span className="ve-bilan-val">{fmtE(caN)}</span>
            </div>
            <div className="ve-bilan-row">
              <span className="ve-bilan-label">Marge commerciale</span>
              <span className="ve-bilan-val">{fmtE(margeCommercialeN)}</span>
            </div>
            <div className="ve-bilan-row">
              <span className="ve-bilan-label">Valeur ajoutée</span>
              <span className="ve-bilan-val">{fmtE(valeurAjouteeN)}</span>
            </div>
            <div className="ve-bilan-row">
              <span className="ve-bilan-label">CAF</span>
              <span
                className="ve-bilan-val"
                style={{ color: cafN >= 0 ? "var(--green)" : "var(--red)" }}
              >
                {fmtE(cafN)}
              </span>
            </div>
            <div className="ve-bilan-row" style={{ borderBottom: "none" }}>
              <span className="ve-bilan-label">Trésorerie fin {exerciceN}</span>
              <span className="ve-bilan-val" style={{ color: "var(--brand)" }}>
                {fmtE(tresorerieN)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ALERTES ── */}
      <div className="ve-alert-grid">
        {alertes.slice(0, 3).map((a, i) => (
          <div key={i} className={`ve-alert-card ${a.type}`}>
            <div className="ve-alert-dot" />
            <div>
              <div className="ve-alert-title">{a.title}</div>
              <div className="ve-alert-body">{a.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TILES ANALYSE / RECO ── */}
      <div className="ve-tiles-grid gap-4">
        {/* ANALYSE */}
        <div
          className="rounded-md border-l-[3px] p-4"
          style={{ backgroundColor: "#EEF2FF", borderLeftColor: "#4F46E5" }}
        >
          <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-2">
            Analyse
          </p>

          <AutoTextarea
            value={result.vue_ensemble?.analyse || "Aucune analyse disponible."}
            className="text-indigo-900/80"
          />
        </div>

        {/* RECOMMANDATIONS */}
        <div
          className="rounded-md border-l-[3px] p-4"
          style={{ backgroundColor: "#FDF0F3", borderLeftColor: "#7E1738" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "#7E1738" }}
          >
            Informations & Recommandations
          </p>

          <AutoTextarea
            value={
              result.vue_ensemble?.informations_recommandations ||
              "Aucune information ou recommandation disponible."
            }
            className="text-slate-700"
          />
        </div>
      </div>
    </div>
  );
};

export default PanelVueEnsemble;

function AutoTextarea({ value, className }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      readOnly
      className={`w-full resize-none overflow-hidden bg-transparent border-none outline-none p-0 text-sm leading-relaxed ${className}`}
    />
  );
}
