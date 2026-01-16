import { useState, useContext } from "react";
import { Loader2 } from "lucide-react";

import WelcomeHeader from "./WelcomHeader";
import ActionStatsCard from "./ActionStatsCard";
import AnnualMetricsChart from "./AnnualMetricsChart";
import TaxDeadlines from "./TaxDeadlines";

import { FolderOpen, Send, MessageSquare, Calendar } from "lucide-react";

import { EtatGlobalContext } from "../EtatGlobal";

export default function Dashboard() {
  const { clientSelect } = useContext(EtatGlobalContext);
  // Données statiques pour le moment

  const [documents] = useState([
    {
      id: 1,
      name: "Document 1",
      uploadedBy: "cabinet",
      createdDate: "2026-01-01",
    },
    {
      id: 2,
      name: "Document 2",
      uploadedBy: "client",
      createdDate: "2026-01-05",
    },
  ]);

  const [requests] = useState([
    { id: 1, type: "kbis", status: "pending", createdDate: "2026-01-03" },
    { id: 2, type: "other", status: "completed", createdDate: "2026-01-06" },
  ]);

  const [questionnaires] = useState([
    { id: 1, status: "pending" },
    { id: 2, status: "completed" },
  ]);

  const [loading] = useState(false); // pas besoin de loader réel pour les données statiques

  const [financialData] = useState([
    { date: "2022-02-15", income: 50000, expenses: 30000, balance: 20000 },
    { date: "2022-06-10", income: 70000, expenses: 40000, balance: 50000 },
    { date: "2022-11-22", income: 60000, expenses: 35000, balance: 75000 },

    { date: "2023-01-12", income: 80000, expenses: 45000, balance: 110000 },
    { date: "2023-05-18", income: 90000, expenses: 50000, balance: 150000 },
    { date: "2023-09-30", income: 85000, expenses: 42000, balance: 193000 },

    { date: "2024-03-05", income: 95000, expenses: 50000, balance: 238000 },
    { date: "2024-07-21", income: 100000, expenses: 55000, balance: 283000 },
    { date: "2024-12-11", income: 105000, expenses: 60000, balance: 328000 },

    { date: "2025-02-15", income: 110000, expenses: 65000, balance: 373000 },
    { date: "2025-06-20", income: 115000, expenses: 70000, balance: 418000 },
    { date: "2025-10-30", income: 120000, expenses: 75000, balance: 463000 },
  ]);

  const [taxDeadlines] = useState([
    {
      id: 1,
      type: "tva",
      title: "Déclaration mensuelle de TVA",
      description: "TVA à déclarer pour le mois de janvier 2026",
      due_date: "2026-01-20",
      amount_estimated: 4200,
      status: "upcoming",
    },
    {
      id: 2,
      type: "is",
      title: "Paiement de l'impôt sur les sociétés",
      description: "1er acompte de l'année fiscale 2026",
      due_date: "2026-02-15",
      amount_estimated: 15000,
      status: "upcoming",
    },
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const pendingQuestionnaires = questionnaires.filter(
    (q) => q.status === "pending"
  ).length;
  const pendingRequests = requests.filter(
    (r) => r.status === "pending" || r.status === "in_progress"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeHeader userName={clientSelect.nom || "Client"} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <ActionStatsCard
            icon={FolderOpen}
            title="Documents"
            description="Consulter vos documents"
            page="Documents"
            count={documents.length}
            color="bg-blue-100"
            iconColor="text-blue-600"
          />
          <ActionStatsCard
            icon={Send}
            title="Nouvelle demande"
            description="Faire une demande rapide"
            page="Requests"
            count={pendingRequests}
            color="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <ActionStatsCard
            icon={MessageSquare}
            title="Questionnaires"
            description="Répondre aux questionnaires"
            page="Questionnaires"
            count={pendingQuestionnaires}
            color="bg-amber-100"
            iconColor="text-amber-600"
          />
          <ActionStatsCard
            icon={Calendar}
            title="Prendre RDV"
            description="Réserver un rendez-vous"
            page="Appointments"
            count={0}
            color="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>
        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <AnnualMetricsChart data={financialData} />
          </div>
          <TaxDeadlines deadlines={taxDeadlines} />
        </div>
      </div>
    </div>
  );
}
