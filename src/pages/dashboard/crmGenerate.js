export function openCrmPresentation(indicators, results) {
  let r = {};
  try {
    if (typeof results === "string") {
      r = JSON.parse(results);
    } else if (Array.isArray(results)) {
      const textItem = results.find(
        (item) => item.type === "text" && item.text
      );
      if (textItem) r = JSON.parse(textItem.text);
    } else if (results && typeof results === "object") {
      r = results;
    }
  } catch (e) {
    console.error("Erreur parsing results", e);
  }

  const client = indicators?.client || {};
  const cr = indicators?.compte_de_resultat || {};
  const bilan = indicators?.bilan || {};
  const immobilisations = indicators?.immobilisations || [];
  const emprunts = indicators?.emprunts || [];
  const dsn = indicators?.dsn || {};
  const dsnEmployes = dsn?.employes || [];
  const dsnEffectif = dsn?.effectif || {};
  const dsnPeriode = dsn?.periode || {};

  const exerciceN = client.exercice_N || "N";
  const exerciceN1 = client.exercice_N1 || "N-1";
  const raisonSociale = client.raison_sociale || "";
  const formeJuridique = client.forme_juridique || "";
  const secteurActivite = client.secteur_activite || "";

  const caN = cr.ca_N || 0;
  const caN1 = cr.ca_N1 || 0;
  const caVarPct = cr.ca_var_pct || 0;
  const achatsN = cr.achats_N || 0;
  const achatsN1 = cr.achats_N1 || 0;
  const chargesNonStockeesN = cr.charges_non_stockees_N || 0;
  const chargesNonStockeesN1 = cr.charges_non_stockees_N1 || 0;
  const chargesExternesN = cr.charges_externes_N || 0;
  const chargesExternesN1 = cr.charges_externes_N1 || 0;
  const chargesFiscalesN = cr.charges_fiscales_N || 0;
  const chargesFiscalesN1 = cr.charges_fiscales_N1 || 0;
  const chargesPersonnelN = cr.charges_personnel_N || 0;
  const chargesPersonnelN1 = cr.charges_personnel_N1 || 0;
  const chargesPersonnelVarPct = cr.charges_personnel_var_pct || 0;
  const dotationsN = cr.dotations_amortissements_N || 0;
  const dotationsN1 = cr.dotations_amortissements_N1 || 0;
  const chargesGestionN = cr.charges_gestion_N || 0;
  const chargesGestionN1 = cr.charges_gestion_N1 || 0;
  const margeCommercialeN = cr.marge_commerciale_N || 0;
  const margeCommercialeN1 = cr.marge_commerciale_N1 || 0;
  const valeurAjouteeN = cr.valeur_ajoutee_N || 0;
  const valeurAjouteeN1 = cr.valeur_ajoutee_N1 || 0;
  const ebeN = cr.ebe_N || 0;
  const ebeN1 = cr.ebe_N1 || 0;
  const ebeVarPct = cr.ebe_var_pct || 0;
  const rexN = cr.rex_N || 0;
  const rexN1 = cr.rex_N1 || 0;
  const rexVarPct = cr.rex_var_pct || 0;
  const chargesFinancieresN = cr.charges_financieres_N || 0;
  const chargesFinancieresN1 = cr.charges_financieres_N1 || 0;
  const impotN = cr.impot_N || 0;
  const impotN1 = cr.impot_N1 || 0;
  const resultatNetN = cr.resultat_net_N || 0;
  const resultatNetN1 = cr.resultat_net_N1 || 0;
  const resultatNetVarPct = cr.resultat_net_var_pct || 0;

  const tresorerieN = bilan.tresorerie_N || 0;
  const tresorerieN1 = bilan.tresorerie_N1 || 0;
  const tresorerieVarPct = bilan.tresorerie_var_pct || 0;
  const dettesFournisseursN = bilan.dettes_fournisseurs_N || 0;
  const dettesFournisseursN1 = bilan.dettes_fournisseurs_N1 || 0;
  const immosBrutesN = bilan.immobilisations_brutes_N || 0;
  const immosBrutesN1 = bilan.immobilisations_brutes_N1 || 0;
  const cafN = bilan.caf_N || 0;
  const cafVarPct = bilan.caf_var_pct || 0;

  const totalEmprunts = emprunts.reduce(
    (sum, e) => sum + (e.capital_restant || 0),
    0
  );
  const totalEcheancesMensuelles = emprunts.reduce(
    (sum, e) => sum + (e.echeance_mensuelle || 0),
    0
  );
  const totalEcheancesAnnuelles = totalEcheancesMensuelles * 12;

  // ── Calculs DSN ──
  const dsnTotalBrut = dsnEmployes.reduce(
    (s, e) => s + (e.salaire_brut || 0),
    0
  );
  const dsnTotalCotisationsSal = dsnEmployes.reduce(
    (s, e) => s + (e.cotisations_salariales || 0),
    0
  );
  const dsnTotalCotisationsPat = dsnEmployes.reduce(
    (s, e) => s + (e.cotisations_patronales || 0),
    0
  );
  const dsnTotalNet = dsnEmployes.reduce((s, e) => s + (e.net_a_payer || 0), 0);
  const dsnTotalCoutEmployeur = dsnEmployes.reduce(
    (s, e) => s + (e.cout_employeur || 0),
    0
  );
  const dsnNbEmployes = dsnEmployes.length;
  const dsnCoutMoyenParEmploye =
    dsnNbEmployes > 0 ? dsnTotalCoutEmployeur / dsnNbEmployes : 0;
  const dsnTauxMoyenCotisations =
    dsnNbEmployes > 0
      ? dsnEmployes.reduce((s, e) => s + (e.taux_moyen_cotisations || 0), 0) /
        dsnNbEmployes
      : 0;
  const dsnEqtpPeriode = dsnEffectif?.eqtp_sur_periode || 0;
  const dsnEqtpDernierJour = dsnEffectif?.eqtp_dernier_jour_mois || 0;

  function esc(str) {
    return (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");
  }
  function fmt(v, d = 0) {
    return Number(v).toLocaleString("fr-FR", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }
  function fmtE(v) {
    return fmt(v) + " €";
  }
  function fmtPct(v) {
    return (v >= 0 ? "+" : "") + fmt(v, 1) + "%";
  }
  function deltaClass(v) {
    return v >= 0 ? "pos" : "neg";
  }
  function deltaArrow(v) {
    return v >= 0 ? "▲" : "▼";
  }
  function pctCA(val, ca) {
    if (!ca || ca === 0) return "—";
    return fmt((val / ca) * 100, 1) + "%";
  }

  const ebeKpi = ebeN >= 0 ? "kpi-green" : "kpi-red";
  const rnKpi = resultatNetN >= 0 ? "kpi-green" : "kpi-red";
  const tresoKpi = tresorerieN >= 0 ? "kpi-teal" : "kpi-red";
  const cafKpi = cafN >= 0 ? "kpi-green" : "kpi-red";

  const alertes = [];
  if (resultatNetN < 0) {
    alertes.push({
      type: "warn",
      title: "Résultat déficitaire",
      body: `Résultat net à ${fmtE(
        resultatNetN
      )} en ${exerciceN}. Amélioration de ${fmtPct(
        resultatNetVarPct
      )} vs ${exerciceN1}.`,
    });
  } else {
    alertes.push({
      type: "good",
      title: "Résultat positif",
      body: `Résultat net à ${fmtE(resultatNetN)} en ${exerciceN}, ${fmtPct(
        resultatNetVarPct
      )} vs ${exerciceN1}.`,
    });
  }
  if (ebeN < 0) {
    alertes.push({
      type: "warn",
      title: "EBE négatif",
      body: `EBE à ${fmtE(ebeN)}. Amélioration de ${fmtPct(
        ebeVarPct
      )} vs ${exerciceN1} (${fmtE(ebeN1)}).`,
    });
  } else {
    alertes.push({
      type: "good",
      title: "EBE positif",
      body: `EBE à ${fmtE(ebeN)}, ${fmtPct(ebeVarPct)} vs ${exerciceN1}.`,
    });
  }
  alertes.push({
    type: tresorerieVarPct < 0 ? "warn" : "good",
    title: tresorerieVarPct < 0 ? "Trésorerie en baisse" : "Trésorerie stable",
    body: `Trésorerie à ${fmtE(tresorerieN)} (${fmtPct(
      tresorerieVarPct
    )} vs ${exerciceN1} : ${fmtE(tresorerieN1)}).`,
  });

  const alertesHtml = alertes
    .slice(0, 3)
    .map(
      (a) => `
      <div class="alert-card ${a.type}">
        <div class="alert-dot"></div>
        <div><div class="alert-title">${a.title}</div><div class="alert-body">${a.body}</div></div>
      </div>`
    )
    .join("");

  function sigTr(label, n, n1, cls) {
    const v = n - n1;
    const p = n1 !== 0 ? ((v / Math.abs(n1)) * 100).toFixed(1) : "—";
    const sign = v >= 0 ? "+" : "";
    const vClass = v >= 0 ? "v-pos" : "v-neg";
    let trClass = cls === "group" ? "tr-g" : cls === "total" ? "tr-tot" : "";
    return `<tr class="${trClass}">
        <td>${label}</td>
        <td>${fmtE(n)}</td>
        <td>${fmtE(n1)}</td>
        <td class="${vClass}">${sign}${fmtE(v)}</td>
        <td class="${vClass}">${sign}${p}%</td>
      </tr>`;
  }

  const immoRows = immobilisations
    .map((immo) => {
      const amort = immo.valeur_entree - immo.vnc;
      return `<tr>
        <td>${immo.numero}</td>
        <td>${
          immo.designation
        }<br/><span style="font-size:10.5px;color:var(--muted)">${
        immo.compte
      }</span></td>
        <td>${immo.date_acquisition}</td>
        <td>${immo.duree}</td>
        <td>${fmtE(immo.valeur_entree)}</td>
        <td>${fmtE(amort)}</td>
        <td style="font-weight:600;color:var(--brand)">${fmtE(immo.vnc)}</td>
      </tr>`;
    })
    .join("");

  const empruntRows = emprunts
    .map(
      (emp) => `
      <tr>
        <td>${emp.nom}<br/><span style="font-size:10.5px;color:var(--muted)">${
        emp.banque
      }</span></td>
        <td>${fmtE(emp.montant_origine)}</td>
        <td>${emp.duree}</td>
        <td>${emp.date_debut}</td>
        <td style="font-weight:600;color:var(--brand)">${fmtE(
          emp.capital_restant
        )}</td>
        <td>${fmtE(emp.echeance_mensuelle)}/mois</td>
        <td>${emp.fin_contrat}</td>
      </tr>`
    )
    .join("");

  // ── Rows DSN employés ──
  const dsnEmployeRows = dsnEmployes
    .sort((a, b) => (b.cout_employeur || 0) - (a.cout_employeur || 0))
    .map(
      (emp) => `
      <tr>
        <td style="font-weight:500">${emp.nom} ${emp.prenom}</td>
        <td>${fmtE(emp.salaire_brut)}</td>
        <td>${fmtE(emp.cotisations_salariales)}</td>
        <td>${fmtE(emp.cotisations_patronales)}</td>
        <td>${fmtE(emp.net_a_payer)}</td>
        <td style="font-weight:600;color:var(--brand)">${fmtE(
          emp.cout_employeur
        )}</td>
        <td>${fmt(emp.taux_moyen_cotisations, 2)}%</td>
      </tr>`
    )
    .join("");

  const donutData = [
    Math.abs(achatsN),
    Math.abs(chargesExternesN + chargesNonStockeesN),
    Math.abs(chargesPersonnelN),
    Math.abs(chargesFiscalesN + chargesGestionN + dotationsN),
  ];
  const wfSoldeInitial = tresorerieN1;
  const wfCAF = cafN;
  const wfDettesVar = dettesFournisseursN - dettesFournisseursN1;
  const wfSoldeFinal = tresorerieN;

  // ── données pour graphe DSN par employé (chart.js) ──
  const dsnEmployesSorted = [...dsnEmployes].sort(
    (a, b) => (b.cout_employeur || 0) - (a.cout_employeur || 0)
  );
  const dsnChartLabels = dsnEmployesSorted.map((e) => `${e.nom} ${e.prenom}`);
  const dsnChartBrut = dsnEmployesSorted.map((e) => e.salaire_brut);
  const dsnChartNet = dsnEmployesSorted.map((e) => e.net_a_payer);
  const dsnChartCout = dsnEmployesSorted.map((e) => e.cout_employeur);

  const html = `<!DOCTYPE html>
  <html lang="fr">
  <head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CRM ${exerciceN} · ${formeJuridique} ${raisonSociale}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com/">
  <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
  :root {
    --brand:#7E1738; --brand-dark:#5E1028; --brand-mid:#9B1F44;
    --brand-light:rgba(126,23,56,.08); --brand-pill:rgba(126,23,56,.12);
    --bg:#F5F3F7; --white:#FFFFFF; --border:#E6E3EC; --border-light:#F0EDF4;
    --text:#1A1525; --text-2:#4A4460; --muted:#8A849A;
    --blue:#2563EB; --blue-bg:#EFF6FF; --blue-mid:#DBEAFE;
    --green:#16A34A; --green-bg:#F0FDF4; --green-mid:#DCFCE7;
    --amber:#D97706; --amber-bg:#FFFBEB; --amber-mid:#FEF3C7;
    --red:#DC2626; --red-bg:#FEF2F2; --red-mid:#FEE2E2;
    --purple:#7C3AED; --purple-bg:#F5F3FF; --purple-mid:#EDE9FE;
    --teal:#0891B2; --teal-bg:#ECFEFF; --teal-mid:#CFFAFE;
    --indigo:#4F46E5; --indigo-bg:#EEF2FF; --indigo-mid:#C7D2FE;
    --sb-w:220px; --font:'DM Sans',system-ui,sans-serif;
    --ease:cubic-bezier(.22,1,.36,1); --radius:10px;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;overflow:hidden;font-family:var(--font);color:var(--text);background:var(--brand);font-size:13px;-webkit-font-smoothing:antialiased}
  #app{display:flex;height:100vh;overflow:hidden}

  /* SIDEBAR */
  aside{width:var(--sb-w);flex-shrink:0;height:100vh;background:var(--brand);display:flex;flex-direction:column;overflow:hidden;position:relative}
  aside::after{content:'';position:absolute;top:0;right:0;width:1px;height:100%;background:rgba(0,0,0,.18)}
  .sb-brand{padding:20px 18px 18px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;gap:10px}
  .sb-logo{width:36px;height:36px;background:rgba(255,255,255,.15);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;font-weight:700;color:#fff;letter-spacing:-.01em}
  .sb-cabinet{font-size:12.5px;font-weight:600;color:rgba(255,255,255,.95);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .sb-type{font-size:10.5px;color:rgba(255,255,255,.4);font-weight:300}
  .sb-nav{flex:1;padding:12px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:1px}
  .sb-label{font-size:9.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:12px 10px 6px}
  .sb-item{display:flex;align-items:center;gap:9px;width:100%;height:40px;padding:0 10px;border:none;background:none;border-radius:8px;cursor:pointer;font-family:var(--font);font-size:13px;font-weight:400;color:rgba(255,255,255,.5);text-align:left;transition:background .15s,color .15s;position:relative}
  .sb-item:hover{background:rgba(255,255,255,.1);color:rgba(255,255,255,.85)}
  .sb-item.active{background:rgba(255,255,255,.15);color:#fff;font-weight:500}
  .sb-item.active::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:3px;background:#fff;border-radius:0 3px 3px 0;opacity:.9}
  .sb-icon{font-size:15px;width:18px;text-align:center;flex-shrink:0;opacity:.7}
  .sb-item.active .sb-icon{opacity:1}
  .sb-bottom{padding:14px 14px 18px;border-top:1px solid rgba(255,255,255,.1)}
  .sb-client-chip{background:rgba(255,255,255,.1);border-radius:8px;padding:10px 12px;margin-bottom:10px}
  .sb-client-name{font-size:12px;font-weight:600;color:rgba(255,255,255,.85);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .sb-client-meta{font-size:10.5px;color:rgba(255,255,255,.35);line-height:1.5}
  .sb-btn{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:9px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);border-radius:8px;font-family:var(--font);font-size:12px;font-weight:500;color:rgba(255,255,255,.65);cursor:pointer;transition:all .15s;letter-spacing:.04em}
  .sb-btn:hover{background:rgba(255,255,255,.2);color:#fff}

  /* MAIN */
  main{flex:1;height:100vh;overflow:hidden;background:var(--bg);border-radius:12px 0 0 12px;display:flex;flex-direction:column;min-width:0}
  .topbar{flex-shrink:0;height:54px;background:#fff;border-bottom:1px solid var(--border);padding:0 28px;display:flex;align-items:center;justify-content:space-between;border-radius:12px 0 0 0}
  .topbar-title{font-size:14px;font-weight:600;color:var(--text)}
  .topbar-title span{color:var(--brand)}
  .topbar-right{display:flex;align-items:center;gap:8px}
  .topbar-badge{font-size:11px;font-weight:500;padding:4px 10px;background:var(--brand-pill);color:var(--brand);border-radius:20px}
  .topbar-print{display:flex;align-items:center;gap:6px;padding:7px 16px;background:var(--brand);color:#fff;border:none;border-radius:8px;font-family:var(--font);font-size:12px;font-weight:500;cursor:pointer;transition:background .15s}
  .topbar-print:hover{background:var(--brand-mid)}
  .panels{flex:1;overflow:hidden;position:relative}

  /* PANELS */
  .panel{display:none;flex-direction:column;height:100%;overflow:hidden;animation:panelIn .2s var(--ease) forwards}
  .panel.active{display:flex}
  @keyframes panelIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .pb{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px 28px 32px;display:flex;flex-direction:column;gap:16px}

  /* KPI CARDS */
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  .kpi-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .kpi-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
  .kpi-card{background:var(--kpi-bg,var(--blue-bg));border:1px solid var(--kpi-mid,var(--blue-mid));border-radius:var(--radius);padding:16px 18px;display:flex;flex-direction:column;gap:3px;transition:transform .15s,box-shadow .15s}
  .kpi-card:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.07)}
  .kpi-icon-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
  .kpi-icon-wrap{width:32px;height:32px;border-radius:8px;background:var(--kpi-mid,var(--blue-mid));display:flex;align-items:center;justify-content:center;font-size:15px}
  .kpi-number{font-size:22px;font-weight:700;color:var(--kpi-color,var(--blue));line-height:1.1;letter-spacing:-.02em}
  .kpi-lbl{font-size:11px;font-weight:500;color:var(--kpi-color,var(--blue));opacity:.75;margin-top:1px}
  .kpi-delta{display:inline-flex;align-items:center;font-size:10.5px;font-weight:500;padding:2px 8px;border-radius:20px;margin-top:5px;width:fit-content}
  .kpi-delta.neg{background:rgba(220,38,38,.1);color:#B91C1C}
  .kpi-delta.pos{background:rgba(22,163,74,.1);color:#15803D}
  .kpi-delta.neu{background:rgba(100,100,120,.08);color:var(--text-2)}
  .kpi-blue{--kpi-bg:var(--blue-bg);--kpi-mid:var(--blue-mid);--kpi-color:var(--blue)}
  .kpi-green{--kpi-bg:var(--green-bg);--kpi-mid:var(--green-mid);--kpi-color:var(--green)}
  .kpi-amber{--kpi-bg:var(--amber-bg);--kpi-mid:var(--amber-mid);--kpi-color:var(--amber)}
  .kpi-red{--kpi-bg:var(--red-bg);--kpi-mid:var(--red-mid);--kpi-color:var(--red)}
  .kpi-purple{--kpi-bg:var(--purple-bg);--kpi-mid:var(--purple-mid);--kpi-color:var(--purple)}
  .kpi-teal{--kpi-bg:var(--teal-bg);--kpi-mid:var(--teal-mid);--kpi-color:var(--teal)}
  .kpi-indigo{--kpi-bg:var(--indigo-bg);--kpi-mid:var(--indigo-mid);--kpi-color:var(--indigo)}

  /* CARDS */
  .card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px}
  .card-sm{padding:14px 16px}
  .card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .card-title{font-size:12.5px;font-weight:600;color:var(--text)}
  .card-sub{font-size:11px;color:var(--muted)}
  .sec-label{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);padding:4px 0 10px;border-bottom:1px solid var(--border);margin-bottom:14px}

  /* LAYOUTS */
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
  .g-main{display:grid;grid-template-columns:3fr 2fr;gap:14px}
  .g-act{display:grid;grid-template-columns:3fr 2fr;gap:14px;align-items:start}

  /* TABLE */
  .tbl-wrap{overflow-x:auto;border-radius:8px;border:1px solid var(--border)}
  .tbl-scroll{overflow-y:auto;max-height:360px}
  table{width:100%;border-collapse:collapse;font-size:12.5px}
  thead th{background:var(--bg);color:var(--text-2);padding:9px 12px;text-align:left;font-size:11px;font-weight:600;letter-spacing:.04em;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:1;white-space:nowrap}
  thead th:not(:first-child){text-align:right}
  td{padding:9px 12px;color:var(--text-2);border-bottom:1px solid var(--border-light);vertical-align:middle}
  td:not(:first-child){text-align:right;font-variant-numeric:tabular-nums}
  tbody tr:last-child td{border-bottom:none}
  tbody tr:hover{background:var(--bg)}
  .tr-g td{background:#F0EDF4!important;color:var(--text);font-weight:600}
  .tr-tot td{background:var(--brand)!important;color:rgba(255,255,255,.95)!important;font-weight:600}
  .v-pos{color:var(--green)!important;font-weight:600}
  .v-neg{color:var(--red)!important;font-weight:600}

  /* TILES */
  .tile-analyse{background:var(--indigo-bg);border:1px solid var(--indigo-mid);border-left:3px solid var(--indigo);border-radius:var(--radius);padding:16px 18px}
  .tile-analyse-head{display:flex;align-items:center;gap:8px;margin-bottom:10px}
  .tile-analyse-lbl{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--indigo)}
  .tile-analyse p{font-size:12.5px;line-height:1.8;color:#3730A3;margin-bottom:6px}
  .tile-analyse p:last-child{margin-bottom:0}
  .tile-infos{background:#FDF0F3;border:1px solid #F2D0DA;border-left:3px solid var(--brand);border-radius:var(--radius);padding:16px 18px}
  .tile-infos-head{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--brand);margin-bottom:10px}
  .tile-infos p{font-size:12.5px;line-height:1.8;color:var(--text-2);margin-bottom:6px}
  .tile-infos p:last-child{margin-bottom:0}

  /* CHART */
  .chart-box{position:relative;min-height:0}
  .chart-box canvas{width:100%!important;display:block}

  /* ALERTS */
  .alert-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
  .alert-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;display:flex;gap:12px;align-items:flex-start}
  .alert-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
  .alert-card.warn .alert-dot{background:var(--amber)}
  .alert-card.info .alert-dot{background:var(--brand)}
  .alert-card.good .alert-dot{background:var(--green)}
  .alert-title{font-size:12px;font-weight:600;margin-bottom:3px}
  .alert-card.warn .alert-title{color:var(--amber)}
  .alert-card.info .alert-title{color:var(--brand)}
  .alert-card.good .alert-title{color:var(--green)}
  .alert-body{font-size:11.5px;color:var(--muted);line-height:1.6}

  /* CAF BOX */
  .caf-box{background:var(--brand);border-radius:var(--radius);padding:18px 20px}
  .caf-label-top{font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:12px}
  .caf-row{display:flex;justify-content:space-between;font-size:12.5px;color:rgba(255,255,255,.6);padding:7px 0;border-bottom:1px solid rgba(255,255,255,.08)}
  .caf-row-val{font-variant-numeric:tabular-nums}
  .caf-total{border-bottom:none!important;color:#fff!important;font-weight:700;padding-top:10px;margin-top:4px;border-top:1px solid rgba(255,255,255,.2)}
  .caf-total .caf-row-val{font-size:20px}

  /* BILAN ROW */
  .bilan-row{display:flex;justify-content:space-between;align-items:baseline;padding:7px 0;font-size:12.5px;border-bottom:1px solid var(--border-light)}
  .bilan-label{color:var(--muted)}
  .bilan-val{font-weight:600;color:var(--text);font-variant-numeric:tabular-nums}
  .bilan-total{padding-top:10px;margin-top:4px;border-top:2px solid var(--text);border-bottom:none}
  .bilan-total .bilan-label{font-weight:700;color:var(--text)}
  .bilan-total .bilan-val{font-size:18px;font-weight:700;color:var(--brand)}

  /* CA CHART SPECIFIQUE */
  .ca-chart-container{display:flex;flex-direction:column;gap:16px;padding:8px 0}
  .ca-bar-group{display:flex;flex-direction:column;gap:6px}
  .ca-bar-label{font-size:11px;font-weight:500;color:var(--text-2)}
  .ca-bar-track{height:32px;background:var(--border-light);border-radius:6px;overflow:hidden;position:relative}
  .ca-bar-fill{height:100%;border-radius:6px;display:flex;align-items:center;padding:0 10px;transition:width .6s var(--ease)}
  .ca-bar-val{font-size:11px;font-weight:600;color:#fff;white-space:nowrap}
  .ca-delta-row{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-top:4px}

  /* DSN BADGE */
  .dsn-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-mid)}
  .dsn-periode{font-size:11px;color:var(--muted);margin-top:2px}

.sb-btn-primary {
  margin-top: 12px;

  /* dégradé basé sur ta couleur */
  background: linear-gradient(135deg, #9f1d47, #5a0f28);
  
  color: #ffffff;
  border: none;
  font-weight: 600;
}

.sb-btn-primary .sb-btn-text {
  display: inline-block;
  line-height: 1.2;
}

.sb-btn-primary:hover {
  background: linear-gradient(135deg, #b02152, #4a0c21);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(126, 23, 56, 0.4);
}

@media print {
  html,body{overflow:visible;height:auto;background:#fff}
  #app{display:block}
  aside{display:none}
  main{height:auto;overflow:visible;border-radius:0;display:block}
  .topbar{border-radius:0;position:static;height:auto;padding:6px 16px;margin-bottom:10px}
  .topbar-title{font-size:12px}
  .topbar-badge,.topbar-print{display:none}
  .panels{height:auto;overflow:visible;display:block}

  .panel{display:none!important}
  #panel-overview{display:block!important}

  .pb{
    overflow:visible!important;
    height:auto!important;
    display:flex!important;
    flex-direction:column!important;
    gap:12px!important;
    padding:10px 16px 10px!important;
  }

  .kpi-grid{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:8px!important}
  .kpi-grid-2{display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:8px!important}
  .kpi-grid-3{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:8px!important}
  .g2{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}
  .g3{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;gap:10px!important}
  .g-main{display:grid!important;grid-template-columns:3fr 2fr!important;gap:10px!important}
  .g-act{display:grid!important;grid-template-columns:3fr 2fr!important;gap:10px!important;align-items:start!important}
  .alert-grid{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:8px!important}
  .overview-charts-grid{display:grid!important;grid-template-columns:3fr 2fr!important;gap:10px!important}
  .overview-right-col{display:flex!important;flex-direction:column!important;gap:10px!important}
  .tiles-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;align-items:start!important}

  .kpi-card{padding:10px 14px!important;gap:2px!important}
  .kpi-number{font-size:16px!important;line-height:1.1!important}
  .kpi-lbl{font-size:9.5px!important;margin-top:1px!important}
  .kpi-delta{font-size:8.5px!important;padding:2px 6px!important;margin-top:3px!important}

  .card{padding:10px 14px!important;border-radius:6px!important;break-inside:avoid;page-break-inside:avoid}
  .card-sm{padding:8px 12px!important}
  .card-head{margin-bottom:8px!important}
  .card-title{font-size:11px!important}
  .card-sub{font-size:9.5px!important}
  .sec-label{font-size:9px!important;padding:3px 0 7px!important;margin-bottom:10px!important}

  table{font-size:9.5px!important}
  thead th{padding:6px 8px!important;font-size:9px!important}
  td{padding:5px 8px!important}
  .tbl-wrap{overflow:visible!important;border-radius:4px!important}
  .tbl-scroll{max-height:none!important;overflow:visible!important}

  .alert-card{padding:8px 10px!important;gap:8px!important;break-inside:avoid}
  .alert-title{font-size:10px!important}
  .alert-body{font-size:9px!important;line-height:1.5!important}
  .alert-dot{width:7px!important;height:7px!important;margin-top:3px!important}

  .bilan-row{padding:5px 0!important;font-size:10.5px!important;display:flex!important}
  .bilan-val{font-size:10.5px!important}
  .bilan-total .bilan-val{font-size:13px!important}

  canvas{display:none!important}
  .chart-box{display:none!important}
  .chart-print-static{display:block!important}

  .tile-analyse,
  .tile-infos{
    padding:10px 14px!important;
    break-inside:avoid;
    page-break-inside:avoid;
    display:block!important;
  }
  .tile-analyse-head{margin-bottom:6px!important}
  .tile-analyse-lbl{font-size:9px!important}
  .tile-infos-head{font-size:9px!important;margin-bottom:6px!important}

  .tile-text-screen{display:none!important}
  .tile-text-print{
    display:block!important;
    font-size:9px!important;
    line-height:1.6!important;
    color:#3730A3!important;
    margin:0!important;
  }
  .tile-infos .tile-text-print{color:#4A4460!important}

  [style*="display:flex;flex-direction:column"]{display:flex!important}

  .chart-print-static > div{margin-bottom:10px!important}
  .chart-print-static > div > div:first-child{font-size:10px!important;margin-bottom:4px!important}

  /* CA static print */
  .ca-chart-container{display:block!important}
  .ca-bar-track{height:20px!important}
  .ca-bar-val{font-size:9px!important}
  .ca-bar-label{font-size:9px!important}
}
  </style>
  </head>
  <body>
  <div id="app">

  <!-- SIDEBAR -->
  <aside>
    <div class="sb-brand">
      <div class="sb-logo">αA</div>
      <div>
        <div class="sb-cabinet">Alfa Comptabilité</div>
        <div class="sb-type">Audit · Compte Rendu</div>
      </div>
    </div>
  <nav class="sb-nav">
    <div class="sb-label">Tableau de bord</div>
    <button class="sb-item active" data-panel="overview">
      <svg class="sb-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85"></rect><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".55"></rect><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".55"></rect><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".35"></rect></svg>
      Vue d'ensemble
    </button>
    <div class="sb-label" style="margin-top:8px">Exercice ${exerciceN}</div>
    <button class="sb-item" data-panel="activite">
      <svg class="sb-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="10" width="3" height="5" rx="1" fill="currentColor"></rect><rect x="6" y="7" width="3" height="8" rx="1" fill="currentColor"></rect><rect x="11" y="3" width="3" height="12" rx="1" fill="currentColor"></rect><path d="M2.5 5.5l4-3 5 2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>
      Activité
    </button>
    <button class="sb-item" data-panel="tresorerie">
      <svg class="sb-icon" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M4.5 6.5L8 3l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 14h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>
      Trésorerie
    </button>
    <button class="sb-item" data-panel="financement">
      <svg class="sb-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="9" width="14" height="5" rx="1.5" fill="currentColor" opacity=".4"></rect><rect x="3" y="5.5" width="10" height="3.5" rx="1" fill="currentColor" opacity=".65"></rect><rect x="6" y="2" width="4" height="3.5" rx="1" fill="currentColor"></rect></svg>
      Financement &amp; Invest.
    </button>
    <button class="sb-item" data-panel="social">
      <svg class="sb-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.8" fill="currentColor" opacity=".75"></circle><path d="M2.5 14c0-3 2.5-5.5 5.5-5.5S13.5 11 13.5 14" fill="currentColor" opacity=".4"></path></svg>
      Social &amp; Personnel
    </button>
    <button class="sb-item" data-panel="etat">
      <svg class="sb-icon" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="1" width="11" height="14" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="currentColor" opacity=".15"></rect><path d="M5 5h6M5 8h6M5 11h3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"></path></svg>
      État
    </button>
  </nav>
    <div class="sb-bottom">
      <div class="sb-client-chip">
        <div class="sb-client-name">${formeJuridique} ${raisonSociale}</div>
        <div class="sb-client-meta">${secteurActivite}<br/>Exercice clos ${exerciceN}</div>
      </div>
    <button class="sb-btn" onclick="window.print()">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M4 6V2h8v4M4 12H2V6h12v6h-2M4 9h8v5H4z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"></path></svg>
      Imprimer / PDF
    </button>
<button class="sb-btn sb-btn-primary" onclick="window.location.href='https://myalfa-link.vercel.app/home'">
  <span class="sb-btn-text">
    Retourner sur <br/>
    MyAlfa Link
  </span>
</button>
    </div>
  </aside>

  <!-- MAIN -->
  <main>
    <div class="topbar">
      <div class="topbar-title">Compte Rendu de Mission · <span>${formeJuridique} ${raisonSociale}</span></div>
      <div class="topbar-right">
        <span class="topbar-badge">Exercice ${exerciceN} / ${exerciceN1}</span>
      <button class="topbar-print" onclick="window.print()">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M4 6V2h8v4M4 12H2V6h12v6h-2M4 9h8v5H4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"></path></svg>
        Imprimer
      </button>
      </div>
    </div>

    <div class="panels">

<!-- ════ VUE D'ENSEMBLE ════ -->
<div id="panel-overview" class="panel active">
  <div class="pb">

    <!-- KPI GRID -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-blue">
        <div class="kpi-number">${fmtE(caN)}</div>
        <div class="kpi-lbl">Chiffre d'affaires</div>
        <span class="kpi-delta ${deltaClass(caVarPct)}">${deltaArrow(
    caVarPct
  )} ${fmtPct(caVarPct)} vs ${exerciceN1}</span>
      </div>
      <div class="kpi-card ${ebeKpi}">
        <div class="kpi-number">${fmtE(ebeN)}</div>
        <div class="kpi-lbl">EBE</div>
        <span class="kpi-delta ${deltaClass(ebeVarPct)}">${deltaArrow(
    ebeVarPct
  )} ${fmtPct(ebeVarPct)} vs ${exerciceN1}</span>
      </div>
      <div class="kpi-card ${rnKpi}">
        <div class="kpi-number">${fmtE(resultatNetN)}</div>
        <div class="kpi-lbl">Résultat net</div>
        <span class="kpi-delta ${deltaClass(resultatNetVarPct)}">${deltaArrow(
    resultatNetVarPct
  )} ${fmtPct(resultatNetVarPct)} vs ${exerciceN1}</span>
      </div>
      <div class="kpi-card ${tresoKpi}">
        <div class="kpi-number">${fmtE(tresorerieN)}</div>
        <div class="kpi-lbl">Trésorerie</div>
        <span class="kpi-delta ${deltaClass(tresorerieVarPct)}">${deltaArrow(
    tresorerieVarPct
  )} ${fmtPct(tresorerieVarPct)} vs ${exerciceN1}</span>
      </div>
    </div>

<!-- CHARTS ROW -->
<div class="overview-charts-grid" style="display:grid;grid-template-columns:3fr 2fr;gap:14px">

  <!-- CA Evolution chart gauche -->
  <div class="card">
    <div class="card-head">
      <div class="card-title">Évolution du Chiffre d'Affaires</div>
      <span class="card-sub">${exerciceN1} → ${exerciceN}</span>
    </div>
    <div class="chart-box" style="height:240px;position:relative">
      <canvas id="overviewBarChart"></canvas>
    </div>
    <div class="chart-print-static" style="display:none">
      ${(() => {
        const maxVal = Math.max(Math.abs(caN), Math.abs(caN1), 1);
        const pctN1 = ((Math.abs(caN1) / maxVal) * 100).toFixed(1);
        const pctN = ((Math.abs(caN) / maxVal) * 100).toFixed(1);
        const varAbs = caN - caN1;
        const varSign = varAbs >= 0 ? "+" : "";
        const varColor = varAbs >= 0 ? "#16A34A" : "#DC2626";
        return `
        <div class="ca-chart-container" style="padding:12px 0">
          <div class="ca-bar-group">
            <div class="ca-bar-label">${exerciceN1}</div>
            <div class="ca-bar-track">
              <div class="ca-bar-fill" style="width:${pctN1}%;background:#DDD8E8">
                <span class="ca-bar-val" style="color:#4A4460">${fmtE(
                  caN1
                )}</span>
              </div>
            </div>
          </div>
          <div class="ca-bar-group" style="margin-top:12px">
            <div class="ca-bar-label">${exerciceN}</div>
            <div class="ca-bar-track">
              <div class="ca-bar-fill" style="width:${pctN}%;background:#7E1738">
                <span class="ca-bar-val">${fmtE(caN)}</span>
              </div>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:12px;border-top:1px solid #E6E3EC">
            <span style="font-size:11px;color:#8A849A">Variation ${exerciceN1} → ${exerciceN}</span>
            <span style="font-size:13px;font-weight:700;color:${varColor}">${varSign}${fmtE(
          varAbs
        )} (${fmtPct(caVarPct)})</span>
          </div>
        </div>`;
      })()}
    </div>
  </div>

  <!-- Donut + Synthèse droite -->
  <div class="overview-right-col" style="display:flex;flex-direction:column;gap:14px">
    <div class="card">
      <div class="card-head">
        <div class="card-title">Répartition des charges ${exerciceN}</div>
      </div>
      <div class="chart-box" style="height:160px;position:relative">
        <canvas id="overviewDonutChart"></canvas>
      </div>
      <div class="chart-print-static" style="display:none;padding-top:4px">
        ${(() => {
          const total = donutData.reduce((a, b) => a + b, 0);
          const labels = [
            "Achats",
            "Ch. ext. + non stock.",
            "Personnel",
            "Fiscal + Gestion + Amort.",
          ];
          const colors = ["#7E1738", "#A52050", "#C85080", "#E0AABF"];
          return labels
            .map((lbl, i) => {
              const pct =
                total > 0 ? ((donutData[i] / total) * 100).toFixed(1) : 0;
              return `<div style="margin-bottom:8px">
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
                <span style="display:flex;align-items:center;gap:5px">
                  <span style="width:8px;height:8px;border-radius:50%;background:${
                    colors[i]
                  };display:inline-block;flex-shrink:0"></span>
                  ${lbl}
                </span>
                <span style="font-weight:600;color:#1A1525">${fmtE(
                  donutData[i]
                )} <span style="color:#8A849A;font-weight:400">(${pct}%)</span></span>
              </div>
              <div style="height:5px;background:#F0EDF4;border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${pct}%;background:${
                colors[i]
              };border-radius:3px"></div>
              </div>
            </div>`;
            })
            .join("");
        })()}
        <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:600;padding-top:8px;border-top:1px solid #E6E3EC;margin-top:4px">
          <span>Total charges</span>
          <span style="color:#7E1738">${fmtE(
            donutData.reduce((a, b) => a + b, 0)
          )}</span>
        </div>
      </div>
    </div>

    <div class="card card-sm">
      <div class="card-head" style="margin-bottom:8px">
        <div class="card-title">Synthèse financière</div>
      </div>
      <div class="bilan-row">
        <span class="bilan-label">CA ${exerciceN}</span>
        <span class="bilan-val">${fmtE(caN)}</span>
      </div>
      <div class="bilan-row">
        <span class="bilan-label">Marge commerciale</span>
        <span class="bilan-val">${fmtE(margeCommercialeN)}</span>
      </div>
      <div class="bilan-row">
        <span class="bilan-label">Valeur ajoutée</span>
        <span class="bilan-val">${fmtE(valeurAjouteeN)}</span>
      </div>
      <div class="bilan-row">
        <span class="bilan-label">CAF</span>
        <span class="bilan-val" style="color:${
          cafN >= 0 ? "var(--green)" : "var(--red)"
        }">${fmtE(cafN)}</span>
      </div>
      <div class="bilan-row" style="border-bottom:none">
        <span class="bilan-label">Trésorerie fin ${exerciceN}</span>
        <span class="bilan-val" style="color:var(--brand)">${fmtE(
          tresorerieN
        )}</span>
      </div>
    </div>
  </div>
</div>

    <!-- ALERTES -->
    <div class="alert-grid">${alertesHtml}</div>

<div class="tiles-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start">
  <div class="tile-analyse">
    <div class="tile-analyse-head">
      <span class="tile-analyse-lbl">Analyse</span>
    </div>
    <p class="tile-text-screen" style="display:-webkit-box;-webkit-line-clamp:8;-webkit-box-orient:vertical;overflow:hidden;">${esc(
      r.vue_ensemble?.analyse
    )}</p>
    <p class="tile-text-print" style="display:none">${esc(
      r.vue_ensemble?.analyse
    )}</p>
  </div>
  <div class="tile-infos">
    <div class="tile-infos-head">💬 Informations &amp; Recommandations</div>
    <p class="tile-text-screen" style="display:-webkit-box;-webkit-line-clamp:8;-webkit-box-orient:vertical;overflow:hidden;">${esc(
      r.vue_ensemble?.informations_recommandations
    )}</p>
    <p class="tile-text-print" style="display:none">${esc(
      r.vue_ensemble?.informations_recommandations
    )}</p>
  </div>
</div>

  </div>
</div>

<!-- ════ ACTIVITÉ ════ -->
<div id="panel-activite" class="panel">
  <div class="pb" style="padding:20px 28px;overflow:hidden;flex:1;display:flex;flex-direction:column">
    <div style="display:grid;grid-template-columns:60% 40%;gap:16px;flex:1;min-height:0;overflow:hidden">
      <div style="display:flex;flex-direction:column;min-height:0;overflow:hidden">
        <div class="tbl-wrap" style="flex:1;overflow-y:auto;border-radius:10px;border:1px solid var(--border)">
          <table>
            <thead>
              <tr>
                <th>Indicateur</th>
                <th>${exerciceN}</th>
                <th>${exerciceN1}</th>
                <th>Écart</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              ${sigTr("Chiffre d'affaires", caN, caN1, "group")}
              ${sigTr("Achats consommés", -achatsN, -achatsN1, "")}
              ${sigTr(
                "Marge commerciale",
                margeCommercialeN,
                margeCommercialeN1,
                "group"
              )}
              ${sigTr(
                "Charges non stockées",
                -chargesNonStockeesN,
                -chargesNonStockeesN1,
                ""
              )}
              ${sigTr(
                "Charges externes",
                -chargesExternesN,
                -chargesExternesN1,
                ""
              )}
              ${sigTr(
                "Valeur ajoutée",
                valeurAjouteeN,
                valeurAjouteeN1,
                "group"
              )}
              ${sigTr(
                "Charges de personnel",
                -chargesPersonnelN,
                -chargesPersonnelN1,
                ""
              )}
              ${sigTr(
                "Charges fiscales",
                -chargesFiscalesN,
                -chargesFiscalesN1,
                ""
              )}
              ${sigTr("EBE", ebeN, ebeN1, "group")}
              ${sigTr(
                "Dotations amortissements",
                -dotationsN,
                -dotationsN1,
                ""
              )}
              ${sigTr(
                "Charges de gestion",
                -chargesGestionN,
                -chargesGestionN1,
                ""
              )}
              ${sigTr("Résultat d'exploitation", rexN, rexN1, "group")}
              ${sigTr(
                "Charges financières",
                -chargesFinancieresN,
                -chargesFinancieresN1,
                ""
              )}
              ${sigTr("Impôt", impotN, impotN1, "")}
              ${sigTr("Résultat net", resultatNetN, resultatNetN1, "total")}
            </tbody>
          </table>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;overflow-y:auto;min-height:0;padding-right:2px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;flex-shrink:0">
          <div class="kpi-card ${ebeKpi}" style="padding:14px 16px">
            <div class="kpi-number" style="font-size:18px">${fmtE(ebeN)}</div>
            <div class="kpi-lbl" style="font-size:11px">EBE ${exerciceN}</div>
            <span class="kpi-delta ${deltaClass(
              ebeVarPct
            )}" style="font-size:10px">${deltaArrow(ebeVarPct)} ${fmtPct(
    ebeVarPct
  )}</span>
          </div>
          <div class="kpi-card kpi-blue" style="padding:14px 16px">
            <div class="kpi-number" style="font-size:18px">${pctCA(
              margeCommercialeN,
              caN
            )}</div>
            <div class="kpi-lbl" style="font-size:11px">Taux marge</div>
            <span class="kpi-delta neu" style="font-size:10px">vs ${pctCA(
              margeCommercialeN1,
              caN1
            )}</span>
          </div>
          <div class="kpi-card ${rnKpi}" style="padding:14px 16px">
            <div class="kpi-number" style="font-size:18px">${fmtE(
              resultatNetN
            )}</div>
            <div class="kpi-lbl" style="font-size:11px">Résultat net</div>
            <span class="kpi-delta ${deltaClass(
              resultatNetVarPct
            )}" style="font-size:10px">${deltaArrow(
    resultatNetVarPct
  )} ${fmtPct(resultatNetVarPct)}</span>
          </div>
          <div class="kpi-card kpi-purple" style="padding:14px 16px">
            <div class="kpi-number" style="font-size:18px">${pctCA(
              chargesPersonnelN,
              caN
            )}</div>
            <div class="kpi-lbl" style="font-size:11px">Personnel / CA</div>
            <span class="kpi-delta neu" style="font-size:10px">vs ${pctCA(
              chargesPersonnelN1,
              caN1
            )}</span>
          </div>
        </div>
        <div class="tile-analyse" style="flex-shrink:0">
          <div class="tile-analyse-head"><span class="tile-analyse-lbl">Analyse</span></div>
          <p>${esc(r.activite?.analyse)}</p>
        </div>
        <div class="tile-infos" style="flex-shrink:0">
          <div class="tile-infos-head">💬 Informations &amp; Recommandations</div>
          <p>${esc(r.activite?.informations_recommandations)}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ════ TRÉSORERIE ════ -->
<div id="panel-tresorerie" class="panel">
  <div class="pb">
    <div class="kpi-grid">
      <div class="kpi-card kpi-teal">
        <div class="kpi-number">${fmtE(tresorerieN1)}</div>
        <div class="kpi-lbl">Trésorerie début ${exerciceN}</div>
        <span class="kpi-delta neu">Solde ${exerciceN1}</span>
      </div>
      <div class="kpi-card ${cafKpi}">
        <div class="kpi-number">${fmtE(cafN)}</div>
        <div class="kpi-lbl">CAF ${exerciceN}</div>
        <span class="kpi-delta ${deltaClass(cafVarPct)}">${deltaArrow(
    cafVarPct
  )} ${fmtPct(cafVarPct)} vs ${exerciceN1}</span>
      </div>
      <div class="kpi-card kpi-amber">
        <div class="kpi-number">${fmtE(dettesFournisseursN)}</div>
        <div class="kpi-lbl">Dettes fournisseurs</div>
        <span class="kpi-delta neu">${exerciceN1} : ${fmtE(
    dettesFournisseursN1
  )}</span>
      </div>
      <div class="kpi-card ${tresoKpi}">
        <div class="kpi-number">${fmtE(tresorerieN)}</div>
        <div class="kpi-lbl">Trésorerie fin ${exerciceN}</div>
        <span class="kpi-delta ${deltaClass(tresorerieVarPct)}">${deltaArrow(
    tresorerieVarPct
  )} ${fmtPct(tresorerieVarPct)}</span>
      </div>
    </div>

    <div class="g-main" style="min-height:0">
      <div class="card" style="display:flex;flex-direction:column">
        <div class="card-head">
          <div class="card-title">Flux de trésorerie ${exerciceN}</div>
          <span class="card-sub">Waterfall</span>
        </div>
        <div class="chart-box" style="min-height:220px">
          <canvas id="tresoWaterfall"></canvas>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card">
          <div class="sec-label">Détail des flux</div>
          <table>
            <tbody>
              <tr><td>Trésorerie ${exerciceN1}</td><td class="v-pos">${fmtE(
    tresorerieN1
  )}</td></tr>
              <tr><td>CAF</td><td class="${
                cafN >= 0 ? "v-pos" : "v-neg"
              }">${fmtE(cafN)}</td></tr>
              <tr><td>Variation dettes fourn.</td><td class="${
                dettesFournisseursN - dettesFournisseursN1 >= 0
                  ? "v-pos"
                  : "v-neg"
              }">${fmtE(dettesFournisseursN - dettesFournisseursN1)}</td></tr>
              <tr class="tr-tot"><td>Trésorerie ${exerciceN}</td><td>${fmtE(
    tresorerieN
  )}</td></tr>
            </tbody>
          </table>
        </div>
        <div class="tile-analyse">
          <div class="tile-analyse-head"><span class="tile-analyse-lbl">Analyse</span></div>
          <p>${esc(r.tresorerie?.analyse)}</p>
        </div>
        <div class="tile-infos">
          <div class="tile-infos-head">💬 Informations &amp; Recommandations</div>
          <p>${esc(r.tresorerie?.informations_recommandations)}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ════ FINANCEMENT ════ -->
<div id="panel-financement" class="panel">
  <div class="pb">
    <div class="g3">
      <div class="kpi-card kpi-teal" style="padding:16px 18px">
        <div class="kpi-number" style="font-size:20px">${fmtE(
          totalEmprunts
        )}</div>
        <div class="kpi-lbl">Encours total emprunts</div>
        <span class="kpi-delta neu">${emprunts.length} ligne(s)</span>
      </div>
      <div class="kpi-card kpi-purple" style="padding:16px 18px">
        <div class="kpi-number" style="font-size:20px">${fmtE(cafN)}</div>
        <div class="kpi-lbl">Capacité d'autofinancement</div>
        <span class="kpi-delta ${deltaClass(cafVarPct)}">${deltaArrow(
    cafVarPct
  )} ${fmtPct(cafVarPct)} vs ${exerciceN1}</span>
      </div>
      <div class="kpi-card kpi-amber" style="padding:16px 18px">
        <div class="kpi-number" style="font-size:20px">${fmtE(
          totalEcheancesAnnuelles
        )}</div>
        <div class="kpi-lbl">Échéances annuelles estimées</div>
        <span class="kpi-delta neg">${fmtE(
          totalEcheancesMensuelles
        )}/mois</span>
      </div>
    </div>

    <div class="g2">
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card">
          <div class="sec-label">Emprunts en cours</div>
          <div class="tbl-wrap">
            <table>
              <thead><tr>
                <th>Prêt</th>
                <th>Montant origine</th>
                <th>Durée</th>
                <th>Début</th>
                <th>Capital restant</th>
                <th>Échéance</th>
                <th>Fin</th>
              </tr></thead>
              <tbody>
                ${empruntRows}
                <tr class="tr-tot">
                  <td colspan="4">Total</td>
                  <td>${fmtE(totalEmprunts)}</td>
                  <td>${fmtE(totalEcheancesMensuelles)}/mois</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card">
          <div class="sec-label">Immobilisations</div>
          <div class="tbl-wrap">
            <table>
              <thead><tr>
                <th>N°</th>
                <th>Désignation</th>
                <th>Date acq.</th>
                <th>Durée</th>
                <th>Valeur brute</th>
                <th>Amort. cumulés</th>
                <th>VNC</th>
              </tr></thead>
              <tbody>${immoRows}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="caf-box">
          <div class="caf-label-top">CAF — Capacité d'autofinancement ${exerciceN}</div>
          <div class="caf-row"><span>Résultat net ${exerciceN}</span><span class="caf-row-val">${fmtE(
    resultatNetN
  )}</span></div>
          <div class="caf-row"><span>+ Dotations amortissements</span><span class="caf-row-val">${fmtE(
            dotationsN
          )}</span></div>
          <div class="caf-row caf-total"><span>CAF ${exerciceN}</span><span class="caf-row-val">${fmtE(
    cafN
  )}</span></div>
        </div>
        <div class="card">
          <div class="sec-label">Immobilisations — Synthèse</div>
          <div class="bilan-row"><span class="bilan-label">Immo. brutes ${exerciceN}</span><span class="bilan-val">${fmtE(
    immosBrutesN
  )}</span></div>
          <div class="bilan-row"><span class="bilan-label">Immo. brutes ${exerciceN1}</span><span class="bilan-val" style="color:var(--muted)">${fmtE(
    immosBrutesN1
  )}</span></div>
          <div class="bilan-row bilan-total"><span class="bilan-label">Variation</span><span class="bilan-val" style="color:${
            immosBrutesN - immosBrutesN1 >= 0 ? "var(--green)" : "var(--red)"
          }">${fmtE(immosBrutesN - immosBrutesN1)}</span></div>
        </div>
        <div class="tile-analyse">
          <div class="tile-analyse-head"><span class="tile-analyse-lbl">Analyse</span></div>
          <p>${esc(r.financement_investissement?.analyse)}</p>
        </div>
        <div class="tile-infos">
          <div class="tile-infos-head">💬 Informations &amp; Recommandations</div>
          <p>${esc(
            r.financement_investissement?.informations_recommandations
          )}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ════ SOCIAL ════ -->
<div id="panel-social" class="panel">
  <div class="pb">

    <!-- En-tête DSN : entreprise + période -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">
          ${esc(dsn?.entreprise?.nom || "")}
          ${
            dsn?.entreprise?.siret
              ? `<span style="font-size:11px;font-weight:400;color:var(--muted);margin-left:8px">SIRET : ${esc(
                  dsn.entreprise.siret
                )}</span>`
              : ""
          }
        </div>
        ${
          dsnPeriode.debut
            ? `<div class="dsn-periode">Période DSN : ${esc(
                dsnPeriode.debut
              )} → ${esc(dsnPeriode.fin)}</div>`
            : ""
        }
      </div>
    </div>

    <!-- KPI GRID DSN -->
    <div class="kpi-grid">

      <!-- Nb salariés -->
      <div class="kpi-card kpi-blue">
        <div class="kpi-number">${dsnNbEmployes}</div>
        <div class="kpi-lbl">Salariés (DSN)</div>
        <span class="kpi-delta neu">EQTP période : ${fmt(
          dsnEqtpPeriode,
          2
        )}</span>
      </div>

      <!-- EQTP dernier jour -->
      <div class="kpi-card kpi-teal">
        <div class="kpi-number">${fmt(dsnEqtpDernierJour, 2)}</div>
        <div class="kpi-lbl">EQTP dernier jour</div>
        <span class="kpi-delta neu">EQTP sur période : ${fmt(
          dsnEqtpPeriode,
          2
        )}</span>
      </div>

      <!-- Masse salariale brute DSN -->
      <div class="kpi-card kpi-purple">
        <div class="kpi-number" style="font-size:18px">${fmtE(
          dsnTotalBrut
        )}</div>
        <div class="kpi-lbl">Masse salariale brute (DSN)</div>
        <span class="kpi-delta neu">Net à payer : ${fmtE(dsnTotalNet)}</span>
      </div>

      <!-- Coût employeur total DSN -->
      <div class="kpi-card kpi-amber">
        <div class="kpi-number" style="font-size:18px">${fmtE(
          dsnTotalCoutEmployeur
        )}</div>
        <div class="kpi-lbl">Coût employeur total (DSN)</div>
        <span class="kpi-delta neu">Moy./salarié : ${fmtE(
          dsnCoutMoyenParEmploye
        )}</span>
      </div>

    </div>

    <!-- Layout principal : tableau employés gauche | synthèse + analyse droite -->
    <div style="display:grid;grid-template-columns:62% 38%;gap:16px;align-items:start">

      <!-- COLONNE GAUCHE -->
      <div style="display:flex;flex-direction:column;gap:14px">

        <!-- Tableau détail par employé -->
        <div class="card" style="padding:0">
          <div class="card-head" style="padding:14px 18px 0">
            <div class="card-title">Détail par collaborateur — DSN</div>
            <span class="card-sub">${esc(dsnPeriode.debut)} → ${esc(
    dsnPeriode.fin
  )}</span>
          </div>
          <div class="tbl-wrap" style="border:none;border-radius:0 0 var(--radius) var(--radius)">
            <table>
              <thead>
                <tr>
                  <th>Collaborateur</th>
                  <th>Brut</th>
                  <th>Cotis. sal.</th>
                  <th>Cotis. pat.</th>
                  <th>Net à payer</th>
                  <th>Coût empl.</th>
                  <th>Tx moy. cotis.</th>
                </tr>
              </thead>
              <tbody>
                ${dsnEmployeRows}
                <tr class="tr-tot">
                  <td>Total</td>
                  <td>${fmtE(dsnTotalBrut)}</td>
                  <td>${fmtE(dsnTotalCotisationsSal)}</td>
                  <td>${fmtE(dsnTotalCotisationsPat)}</td>
                  <td>${fmtE(dsnTotalNet)}</td>
                  <td>${fmtE(dsnTotalCoutEmployeur)}</td>
                  <td>${fmt(dsnTauxMoyenCotisations, 2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tableau décomposition masse salariale -->
        <div class="card" style="padding:0">
          <div class="card-head" style="padding:14px 18px 0">
            <div class="card-title">Décomposition de la masse salariale</div>
          </div>
          <div class="tbl-wrap" style="border:none;border-radius:0 0 var(--radius) var(--radius)">
            <table>
              <thead>
                <tr>
                  <th>Nature</th>
                  <th>Montant</th>
                  <th>% du brut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Salaires bruts</td>
                  <td>${fmtE(dsnTotalBrut)}</td>
                  <td style="color:var(--muted)">100,0%</td>
                </tr>
                <tr>
                  <td>Cotisations salariales</td>
                  <td>${fmtE(dsnTotalCotisationsSal)}</td>
                  <td style="color:var(--muted)">${
                    dsnTotalBrut > 0
                      ? fmt((dsnTotalCotisationsSal / dsnTotalBrut) * 100, 1)
                      : "—"
                  }%</td>
                </tr>
                <tr>
                  <td>Net à payer</td>
                  <td>${fmtE(dsnTotalNet)}</td>
                  <td style="color:var(--muted)">${
                    dsnTotalBrut > 0
                      ? fmt((dsnTotalNet / dsnTotalBrut) * 100, 1)
                      : "—"
                  }%</td>
                </tr>
                <tr>
                  <td>Cotisations patronales</td>
                  <td>${fmtE(dsnTotalCotisationsPat)}</td>
                  <td style="color:var(--muted)">${
                    dsnTotalBrut > 0
                      ? fmt((dsnTotalCotisationsPat / dsnTotalBrut) * 100, 1)
                      : "—"
                  }%</td>
                </tr>
                <tr class="tr-tot">
                  <td>Coût employeur total</td>
                  <td>${fmtE(dsnTotalCoutEmployeur)}</td>
                  <td>${
                    dsnTotalBrut > 0
                      ? fmt((dsnTotalCoutEmployeur / dsnTotalBrut) * 100, 1)
                      : "—"
                  }%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Graphique coût par employé -->
        <div class="card">
          <div class="card-head">
            <div class="card-title">Coût employeur par collaborateur</div>
            <span class="card-sub">Brut vs Net vs Coût total</span>
          </div>
          <div class="chart-box" style="height:220px">
            <canvas id="dsnBarChart"></canvas>
          </div>
        </div>

      </div>

      <!-- COLONNE DROITE -->
      <div style="display:flex;flex-direction:column;gap:14px">

        <!-- KPI 2 colonnes : charges personnel comptable vs DSN -->
        <div class="kpi-grid-2">
          <div class="kpi-card kpi-blue" style="padding:14px 16px">
            <div class="kpi-number" style="font-size:18px">${fmtE(
              chargesPersonnelN
            )}</div>
            <div class="kpi-lbl" style="font-size:11px">Personnel bilan ${exerciceN}</div>
            <span class="kpi-delta ${deltaClass(
              chargesPersonnelVarPct
            )}" style="font-size:10px">${deltaArrow(
    chargesPersonnelVarPct
  )} ${fmtPct(chargesPersonnelVarPct)}</span>
          </div>
          <div class="kpi-card kpi-purple" style="padding:14px 16px">
            <div class="kpi-number" style="font-size:18px">${pctCA(
              chargesPersonnelN,
              caN
            )}</div>
            <div class="kpi-lbl" style="font-size:11px">% du CA ${exerciceN}</div>
            <span class="kpi-delta neu" style="font-size:10px">vs ${pctCA(
              chargesPersonnelN1,
              caN1
            )}</span>
          </div>
        </div>

        <!-- Synthèse effectif -->
        <div class="card card-sm">
          <div class="sec-label">Effectif — Synthèse DSN</div>
          <div class="bilan-row">
            <span class="bilan-label">Nombre de collaborateurs</span>
            <span class="bilan-val">${dsnNbEmployes}</span>
          </div>
          <div class="bilan-row">
            <span class="bilan-label">EQTP sur la période</span>
            <span class="bilan-val">${fmt(dsnEqtpPeriode, 2)}</span>
          </div>
          <div class="bilan-row">
            <span class="bilan-label">EQTP dernier jour du mois</span>
            <span class="bilan-val">${fmt(dsnEqtpDernierJour, 2)}</span>
          </div>
          <div class="bilan-row">
            <span class="bilan-label">Coût moyen / collaborateur</span>
            <span class="bilan-val">${fmtE(dsnCoutMoyenParEmploye)}</span>
          </div>
          <div class="bilan-row">
            <span class="bilan-label">Taux moyen cotisations</span>
            <span class="bilan-val">${fmt(dsnTauxMoyenCotisations, 2)}%</span>
          </div>
          <div class="bilan-row" style="border-bottom:none">
            <span class="bilan-label">Personnel / CA ${exerciceN}</span>
            <span class="bilan-val" style="color:var(--brand)">${pctCA(
              chargesPersonnelN,
              caN
            )}</span>
          </div>
        </div>

        <!-- Tableau comparatif charges personnel N vs N-1 -->
        <div class="card" style="padding:0">
          <div class="card-head" style="padding:14px 18px 0">
            <div class="card-title">Charges personnel bilan ${exerciceN1} / ${exerciceN}</div>
          </div>
          <div class="tbl-wrap" style="border:none;border-radius:0 0 var(--radius) var(--radius)">
            <table>
              <thead>
                <tr>
                  <th>Poste</th>
                  <th>${exerciceN}</th>
                  <th>${exerciceN1}</th>
                  <th>Évol.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Charges personnel</td>
                  <td>${fmtE(chargesPersonnelN)}</td>
                  <td style="color:var(--muted)">${fmtE(
                    chargesPersonnelN1
                  )}</td>
                  <td class="${deltaClass(chargesPersonnelVarPct)}">${fmtPct(
    chargesPersonnelVarPct
  )}</td>
                </tr>
                <tr class="tr-g">
                  <td>% CA</td>
                  <td>${pctCA(chargesPersonnelN, caN)}</td>
                  <td style="color:var(--muted)">${pctCA(
                    chargesPersonnelN1,
                    caN1
                  )}</td>
                  <td style="color:var(--muted)">—</td>
                </tr>
                <tr>
                  <td>% Valeur ajoutée</td>
                  <td>${pctCA(chargesPersonnelN, valeurAjouteeN)}</td>
                  <td style="color:var(--muted)">${pctCA(
                    chargesPersonnelN1,
                    valeurAjouteeN1
                  )}</td>
                  <td style="color:var(--muted)">—</td>
                </tr>
                <tr class="tr-tot">
                  <td>Variation absolue</td>
                  <td colspan="2" style="text-align:center">${fmtE(
                    Math.abs(chargesPersonnelN - chargesPersonnelN1)
                  )}</td>
                  <td>${fmtPct(chargesPersonnelVarPct)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tiles analyse + reco -->
        <div class="tile-analyse">
          <div class="tile-analyse-head">
            <span class="tile-analyse-lbl">Analyse</span>
          </div>
          <p>${esc(r.social_personnel?.analyse)}</p>
        </div>
        <div class="tile-infos">
          <div class="tile-infos-head">💬 Informations &amp; Recommandations</div>
          <p>${esc(r.social_personnel?.informations_recommandations)}</p>
        </div>

      </div>
    </div>

  </div>
</div>
 <!-- ════ ÉTAT ════ -->
  <div id="panel-etat" class="panel">
    <div class="pb">
      <div class="g2" style="max-width:960px">
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="card">
            <div class="sec-label">Impôt sur les Sociétés (IS)</div>
            <table>
              <thead><tr><th>Poste</th><th>${exerciceN}</th><th>${exerciceN1}</th></tr></thead>
              <tbody>
                <tr><td>IS constaté</td><td class="${
                  impotN < 0 ? "v-pos" : "v-neg"
                }">${fmtE(
    Math.abs(impotN)
  )}</td><td style="color:var(--muted)">${fmtE(Math.abs(impotN1))}</td></tr>
                <tr><td>Résultat d'exploitation</td><td class="${
                  rexN >= 0 ? "v-pos" : "v-neg"
                }">${fmtE(rexN)}</td><td style="color:var(--muted)">${fmtE(
    rexN1
  )}</td></tr>
                <tr class="tr-tot"><td>Résultat net</td><td>${fmtE(
                  resultatNetN
                )}</td><td>${fmtE(resultatNetN1)}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="kpi-grid-2">
            <div class="kpi-card kpi-blue" style="padding:14px 16px">
              <div class="kpi-number" style="font-size:20px">${fmtE(
                Math.abs(impotN)
              )}</div>
              <div class="kpi-lbl" style="font-size:11px">IS ${exerciceN}</div>
              ${
                impotN < 0
                  ? `<span class="kpi-delta pos" style="font-size:10px">Crédit d'impôt</span>`
                  : `<span class="kpi-delta neg" style="font-size:10px">Charge IS</span>`
              }
            </div>
            <div class="kpi-card kpi-green" style="padding:14px 16px">
              <div class="kpi-number" style="font-size:20px">${fmtE(
                chargesFiscalesN
              )}</div>
              <div class="kpi-lbl" style="font-size:11px">Charges fiscales ${exerciceN}</div>
              <span class="kpi-delta ${deltaClass(
                chargesFiscalesN1 - chargesFiscalesN
              )}" style="font-size:10px">vs ${fmtE(chargesFiscalesN1)}</span>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="card">
            <div class="sec-label">Charges fiscales &amp; taxes</div>
            <div class="bilan-row"><span class="bilan-label">Charges fiscales ${exerciceN}</span><span class="bilan-val">${fmtE(
    chargesFiscalesN
  )}</span></div>
            <div class="bilan-row"><span class="bilan-label">Charges fiscales ${exerciceN1}</span><span class="bilan-val" style="color:var(--muted)">${fmtE(
    chargesFiscalesN1
  )}</span></div>
            <div class="bilan-row"><span class="bilan-label">Charges de gestion ${exerciceN}</span><span class="bilan-val">${fmtE(
    chargesGestionN
  )}</span></div>
            <div class="bilan-row bilan-total"><span class="bilan-label">Total fiscal + gestion</span><span class="bilan-val">${fmtE(
              chargesFiscalesN + chargesGestionN
            )}</span></div>
          </div>
          ${
            impotN < 0
              ? `
          <div class="card card-sm" style="border-left:3px solid var(--blue)">
            <div style="font-size:11px;font-weight:600;color:var(--blue);margin-bottom:6px">ℹ️ Crédit d'impôt constaté</div>
            <div style="font-size:12px;color:var(--text-2);line-height:1.7">Crédit IS de ${fmtE(
              Math.abs(impotN)
            )} constaté en ${exerciceN}, résultant du déficit fiscal.</div>
          </div>`
              : ""
          }
        </div>
      </div>

      <div class="g2" style="max-width:960px">
        <div class="tile-analyse">
          <div class="tile-analyse-head"><span class="tile-analyse-lbl">Analyse</span></div>
          <p>${esc(r.etat?.analyse)}</p>
        </div>
        <div class="tile-infos">
          <div class="tile-infos-head">💬 Informations &amp; Recommandations</div>
          <p>${esc(r.etat?.informations_recommandations)}</p>
        </div>
      </div>

      <div class="card" style="max-width:960px">
        <div class="sec-label">Récapitulatif financier ${exerciceN} vs ${exerciceN1}</div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Indicateur</th><th>${exerciceN}</th><th>${exerciceN1}</th><th>Variation</th></tr></thead>
            <tbody>
              <tr><td>Chiffre d'affaires</td><td style="font-weight:600">${fmtE(
                caN
              )}</td><td style="color:var(--muted)">${fmtE(
    caN1
  )}</td><td class="${deltaClass(caVarPct)}">${fmtPct(caVarPct)}</td></tr>
              <tr><td>EBE</td><td style="font-weight:600">${fmtE(
                ebeN
              )}</td><td style="color:var(--muted)">${fmtE(
    ebeN1
  )}</td><td class="${deltaClass(ebeVarPct)}">${fmtPct(ebeVarPct)}</td></tr>
              <tr><td>Résultat d'exploitation</td><td style="font-weight:600">${fmtE(
                rexN
              )}</td><td style="color:var(--muted)">${fmtE(
    rexN1
  )}</td><td class="${deltaClass(rexVarPct)}">${fmtPct(rexVarPct)}</td></tr>
              <tr><td>IS</td><td style="font-weight:600">${fmtE(
                impotN
              )}</td><td style="color:var(--muted)">${fmtE(
    impotN1
  )}</td><td style="color:var(--muted)">—</td></tr>
              <tr class="tr-tot"><td>Résultat net</td><td>${fmtE(
                resultatNetN
              )}</td><td>${fmtE(resultatNetN1)}</td><td>${fmtPct(
    resultatNetVarPct
  )}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

    </div><!-- .panels -->
  </main>
  </div><!-- #app -->

  <script>
  Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = '#8A849A';

  const BR = '#7E1738', GL = '#E6E3EC', GR = '#16A34A', RD = '#DC2626';

  // Navigation sidebar
  const chartsInited = new Set();
  document.querySelectorAll('.sb-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.panel;
      document.querySelectorAll('.sb-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + id).classList.add('active');
      if (!chartsInited.has(id)) { initCharts(id); chartsInited.add(id); }
    });
  });

  function initCharts(panel) {

    if (panel === 'overview') {

      // ── CA Bar chart : uniquement le Chiffre d'Affaires N-1 vs N ──
      new Chart(document.getElementById('overviewBarChart'), {
        type: 'bar',
        data: {
          labels: ['${exerciceN1}', '${exerciceN}'],
          datasets: [
            {
              label: "Chiffre d'affaires",
              data: [${caN1}, ${caN}],
              backgroundColor: ['#DDD8E8', BR],
              borderRadius: 6,
              borderSkipped: false,
              barThickness: 180
            }
          ]
        },
        options: {
          layout: {
           padding: {
            top: 70 , // 🔥 espace au-dessus des barres
            left: 30,
          }
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ctx.parsed.y.toLocaleString('fr-FR') + ' €'
              }
            }
          },
            scales: {
              y: {
                grid: { color: GL },
                border: { display: false },
    ticks: {
      padding: 10,
      callback: v => v.toLocaleString('fr-FR') + ' €'
    },
        afterFit: scale => {
      scale.width = 80; // 🔥 augmente la largeur de la zone des ticks
    }
              },
              x: {
                grid: { display: false },
                border: { display: false }
              }
            },
          animation: {
            onComplete: function() {
              const chart = this;
              const ctx = chart.ctx;
              ctx.save();
              ctx.font = "600 12px 'DM Sans', sans-serif";
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              chart.data.datasets.forEach((dataset, i) => {
                chart.getDatasetMeta(i).data.forEach((bar, j) => {
                  const val = dataset.data[j];
                  ctx.fillStyle = j === 1 ? '#4A4460' : '#4A4460';
                  const yPos = bar.y - 6;
                  ctx.fillText(val.toLocaleString('fr-FR') + ' €', bar.x, yPos);
                });
              });
              ctx.restore();
            }
          }
        }
      });

      // ── Donut chart répartition charges ──
      new Chart(document.getElementById('overviewDonutChart'), {
        type: 'doughnut',
        data: {
          labels: ['Achats','Ch. ext. + non stock.','Personnel','Fiscal + Gestion + Amort.'],
          datasets: [{
            data: [${donutData[0]},${donutData[1]},${donutData[2]},${
    donutData[3]
  }],
            backgroundColor: [BR,'#A52050','#C85080','#E0AABF'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 9, padding: 10, font: { size: 10 } }
            },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
                  const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                  return ctx.label + ' : ' + ctx.parsed.toLocaleString('fr-FR') + ' € (' + pct + '%)';
                }
              }
            }
          }
        }
      });
    }

    if (panel === 'tresorerie') {
      const wfSoldeInitial = ${wfSoldeInitial};
      const wfCAF = ${wfCAF};
      const wfDettesVar = ${wfDettesVar};
      const wfSoldeFinal = ${wfSoldeFinal};
      const moves = [wfCAF, wfDettesVar];
      let acc = wfSoldeInitial;
      const floats = [[0, wfSoldeInitial]];
      const bgs = ['rgba(8,145,178,.2)'];
      const borders = ['#0891B2'];
      moves.forEach(m => {
        if (m >= 0) {
          floats.push([acc, acc + m]);
          bgs.push('rgba(22,163,74,.2)');
          borders.push(GR);
        } else {
          floats.push([acc + m, acc]);
          bgs.push('rgba(220,38,38,.15)');
          borders.push(RD);
        }
        acc += m;
      });
      floats.push([0, wfSoldeFinal]);
      bgs.push(wfSoldeFinal >= 0 ? 'rgba(8,145,178,.2)' : 'rgba(220,38,38,.15)');
      borders.push(wfSoldeFinal >= 0 ? '#0891B2' : RD);

      new Chart(document.getElementById('tresoWaterfall'), {
        type: 'bar',
        data: {
          labels: ['Tréso ${exerciceN1}', 'CAF ${exerciceN}', 'Var. dettes fourn.', 'Tréso ${exerciceN}'],
          datasets: [{
            data: floats,
            backgroundColor: bgs,
            borderColor: borders,
            borderWidth: 1.5,
            borderSkipped: false,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const [a, b] = ctx.raw;
                  return (b - a >= 0 ? '+' : '') + (b - a).toLocaleString('fr-FR') + ' €';
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: GL },
              border: { display: false },
              ticks: { callback: v => v.toLocaleString('fr-FR') + ' €' }
            },
            y: {
              grid: { display: false },
              border: { display: false }
            }
          }
        }
      });
    }

if (panel === 'social') {
      const dsnLabels = ${JSON.stringify(dsnChartLabels)};
      const dsnBrut   = ${JSON.stringify(dsnChartBrut)};
      const dsnNet    = ${JSON.stringify(dsnChartNet)};
      const dsnCout   = ${JSON.stringify(dsnChartCout)};

      new Chart(document.getElementById('dsnBarChart'), {
        type: 'bar',
        data: {
          labels: dsnLabels,
          datasets: [
            {
              label: 'Salaire brut',
              data: dsnBrut,
              backgroundColor: '#DDD8E8',
              borderRadius: 4
            },
            {
              label: 'Net à payer',
              data: dsnNet,
              backgroundColor: '#A52050',
              borderRadius: 4
            },
            {
              label: 'Coût employeur',
              data: dsnCout,
              backgroundColor: '#7E1738',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { boxWidth: 10, padding: 12, font: { size: 10 } }
            },
            tooltip: {
              callbacks: {
                label: ctx => ctx.dataset.label + ' : ' + ctx.parsed.y.toLocaleString('fr-FR') + ' €'
              }
            }
          },
          scales: {
            y: {
              grid: { color: GL },
              border: { display: false },
              ticks: { callback: v => v.toLocaleString('fr-FR') + ' €', font: { size: 10 } }
            },
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: {
                font: { size: 10 },
                maxRotation: 30,
                minRotation: 0
              }
            }
          }
        }
      });
    }
  }

  // Init overview au chargement
  chartsInited.add('overview');
  initCharts('overview');
  </script>
  </body>
  </html>`;

  const win = window.open("", "_blank");
  win.document.open();
  win.document.write(html);
  win.document.close();

  // setTimeout(() => {
  //   const blob = new Blob([html], { type: "text/html" });
  //   const url = URL.createObjectURL(blob);

  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "crm-presentation.html";
  //   a.click();

  //   URL.revokeObjectURL(url);
  // }, 300);
}
