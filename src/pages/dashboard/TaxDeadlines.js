import { Calendar, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";
import { fr } from "date-fns/locale";

const typeLabels = {
  tva: "TVA",
  is: "Impôt sur les sociétés",
  cvae: "CVAE",
  taxe_apprentissage: "Taxe d'apprentissage",
  formation: "Formation professionnelle",
  urssaf: "URSSAF",
  autre: "Autre",
};

const typeColors = {
  tva: "bg-blue-100 text-blue-700",
  is: "bg-purple-100 text-purple-700",
  cvae: "bg-amber-100 text-amber-700",
  taxe_apprentissage: "bg-green-100 text-green-700",
  formation: "bg-pink-100 text-pink-700",
  urssaf: "bg-indigo-100 text-indigo-700",
  autre: "bg-slate-100 text-slate-700",
};

export default function TaxDeadlines({ deadlines = [] }) {
  const upcomingDeadlines = deadlines
    .filter((d) => d.status === "upcoming")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  const getUrgencyLevel = (dueDate) => {
    const days = differenceInDays(new Date(dueDate), new Date());
    if (days < 0 || isPast(new Date(dueDate))) return "overdue";
    if (days <= 7) return "urgent";
    if (days <= 30) return "soon";
    return "normal";
  };

  return (
    <div className="p-6 border-0 bg-white shadow-sm shadow-sm hover:shadow-md rounded-xl ">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-slate-500">
            Échéances fiscales
          </h3>
          <p className="text-xs text-slate-400 mt-1">À venir</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-amber-600" />
        </div>
      </div>

      {upcomingDeadlines.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Aucune échéance à venir</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingDeadlines.map((deadline) => {
            const urgency = getUrgencyLevel(deadline.due_date);
            const daysLeft = differenceInDays(
              new Date(deadline.due_date),
              new Date()
            );

            return (
              <div
                key={deadline.id}
                className={`p-4 rounded-xl border-l-4 ${
                  urgency === "overdue"
                    ? "bg-red-50 border-red-500"
                    : urgency === "urgent"
                    ? "bg-amber-50 border-amber-500"
                    : "bg-slate-50 border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        variant="secondary"
                        className={`${
                          typeColors[deadline.type]
                        } border-0 text-xs`}
                      >
                        {typeLabels[deadline.type]}
                      </div>
                      {urgency === "overdue" && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      {urgency === "urgent" && (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <h4 className="font-medium text-slate-800 mt-2 text-sm">
                      {deadline.title}
                    </h4>
                    {deadline.description && (
                      <p className="text-xs text-slate-500 mt-1">
                        {deadline.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                      <span>
                        {format(new Date(deadline.due_date), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                      <span
                        className={
                          urgency === "overdue"
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {urgency === "overdue"
                          ? `En retard de ${Math.abs(daysLeft)} jour${
                              Math.abs(daysLeft) > 1 ? "s" : ""
                            }`
                          : `Dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>
                  {deadline.amount_estimated && (
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(deadline.amount_estimated)}
                      </p>
                      <p className="text-xs text-slate-500">Estimé</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
