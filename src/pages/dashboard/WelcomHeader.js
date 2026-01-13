import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function WelcomeHeader({ userName }) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour, vous êtes sur le dossier : ";
    if (hour < 18) return "Bon après-midi, vous êtes sur le dossier :";
    return "Bonsoir, vous êtes sur le dossier :";
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-light text-slate-800">
        {greeting()}
        <span className="font-semibold">{userName}</span>
      </h1>
      <p className="text-slate-500 mt-1">
        {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
      </p>
    </div>
  );
}
