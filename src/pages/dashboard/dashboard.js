import { useState, useContext } from "react";
import { Loader2 } from "lucide-react";

import WelcomeHeader from "./WelcomHeader";
import ActionStatsCard from "./ActionStatsCard";
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
      </div>
    </div>
  );
}
