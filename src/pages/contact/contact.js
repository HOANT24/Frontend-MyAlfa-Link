import { Mail, Phone } from "lucide-react";

const team = [
  {
    initials: "MD",
    role: "Expert-Comptable",
    name: "Marie Dupont",
    email: "m.dupont@cabinet-alfa.fr",
    phone: "01 23 45 67 89",
    color: "bg-[#840040]",
  },
  {
    initials: "TR",
    role: "Collaborateur Comptable",
    name: "Thomas Renard",
    email: "t.renard@cabinet-alfa.fr",
    phone: "01 23 45 67 90",
    color: "bg-slate-700",
  },
  {
    initials: "SM",
    role: "Collaborateur Social",
    name: "Sophie Martin",
    email: "s.martin@cabinet-alfa.fr",
    phone: "01 23 45 67 91",
    color: "bg-purple-600",
  },
  {
    initials: "JB",
    role: "Secrétariat",
    name: "Julie Bernard",
    email: "secretariat@cabinet-alfa.fr",
    phone: "01 23 45 67 00",
    color: "bg-slate-500",
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-8 py-5 sm:py-8 pb-24">
      <h1 className="text-xl font-bold text-slate-800">Votre équipe</h1>
      <p className="text-slate-500 text-xs mt-1 mb-4 sm:hidden">Contact &gt; Intervenants</p>
      <p className="text-slate-500 text-xs mt-1 mb-4 hidden sm:block">Les intervenants sur votre dossier</p>

      <div className="space-y-4 max-w-2xl">
        {team.map((member) => (
          <div key={member.initials} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* ── Desktop : tout inline ── */}
            <div className="hidden sm:flex items-center gap-5 px-6 py-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${member.color}`}>
                <span className="text-white text-sm font-bold">{member.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{member.role}</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{member.name}</p>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  <a href={`mailto:${member.email}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#840040] transition-colors">
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </a>
                  <a href={`tel:${member.phone.replace(/\s/g, "")}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#840040] transition-colors">
                    <Phone className="w-3 h-3" />
                    {member.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* ── Mobile : avatar + role/nom, puis boutons split ── */}
            <div className="sm:hidden">
              <div className="flex items-center gap-3 p-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${member.color}`}>
                  <span className="text-white text-sm font-bold">{member.initials}</span>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{member.role}</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{member.name}</p>
                </div>
              </div>
              <div className="flex border-t border-slate-100 divide-x divide-slate-100">
                <a href={`mailto:${member.email}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#840040]" />
                  E-mail
                </a>
                <a href={`tel:${member.phone.replace(/\s/g, "")}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#840040]" />
                  {member.phone}
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      <p className="text-center sm:text-left text-sm text-slate-400 mt-8 max-w-2xl">
        Une question ? Contactez directement votre interlocuteur.
      </p>
    </div>
  );
}
