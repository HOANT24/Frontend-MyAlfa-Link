import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function WelcomeHeader({ userName }) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour, vous êtes sur le dossier :";
    if (hour < 18) return "Bon après-midi, vous êtes sur le dossier :";
    return "Bonsoir, vous êtes sur le dossier :";
  };

  return (
    <div className="mb-5 sm:mb-8">
      {/* TITRE */}
      <h1 className="text-sm sm:text-xl lg:text-3xl font-light text-slate-800 leading-snug break-words">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span>{greeting()}</span>
          <span className="font-semibold text-[#840040] break-words">
            {userName}
          </span>
        </div>
      </h1>

      {/* DATE */}
      <p className="text-slate-400 mt-1 text-xs sm:text-sm">
        {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
      </p>
    </div>
  );
}
