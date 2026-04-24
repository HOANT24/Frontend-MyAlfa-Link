import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Loader2, ShieldCheck, CheckCircle, User, Mail } from "lucide-react";

function PreviewHtml() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  const { id } = useParams();

  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        if (!url) {
          setError("URL manquante");
          setLoading(false);
          return;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Impossible de charger le fichier HTML");
        }

        const data = await response.text();
        setHtml(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHtml();
  }, [url]);

  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      try {
        const res = await fetch(
          `https://backend-myalfa.vercel.app/api/clients/${id}`
        );

        const clientData = await res.json();

        if (clientData) {
          setUserInfo({
            nom: clientData.nom,
            email: clientData.email,
          });

          setShowNotif(true);

          setTimeout(() => {
            setShowNotif(false);
          }, 5000);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchClient();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-[400px] text-center space-y-6">
          {/* Icône principale */}
          <div className="flex justify-center">
            <div className="bg-[#840040]/10 p-4 rounded-full">
              <ShieldCheck className="w-10 h-10 text-[#840040]" />
            </div>
          </div>

          {/* Titre */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Vérification en cours
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Nous vérifions vos informations utilisateur...
            </p>
          </div>

          {/* Loader */}
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-[#840040] animate-spin" />
          </div>
        </div>
      </div>
    );
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {showNotif && userInfo && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className="relative group overflow-hidden bg-emerald-600 border border-emerald-500/50 shadow-[0_10px_40px_rgba(16,185,129,0.3)] rounded-xl p-3.5 w-[280px] transition-all hover:scale-[1.02]">
            {/* Effet de brillance / Gradient de profondeur */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              {/* Icone principale - Plus petite et blanche pour le contraste sur fond vert */}
              <div className="flex-shrink-0 bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                <CheckCircle className="text-white w-5 h-5" />
              </div>

              {/* Content - Texte en blanc pour lisibilité maximale sur fond foncé */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight tracking-wide">
                  Connexion réussie
                </p>

                <div className="mt-1 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 opacity-90">
                    <User className="w-3 h-3 text-emerald-100" />
                    <span className="text-[11px] font-medium text-white truncate">
                      {userInfo.nom}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 opacity-80">
                    <Mail className="w-3 h-3 text-emerald-200" />
                    <span className="text-[10px] text-emerald-50 truncate">
                      {userInfo.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de progression - On garde ta variable de couleur #840040 pour le rappel de marque */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/10">
              <div className="h-full bg-[#840040] animate-progress origin-left shadow-[0_0_8px_#840040]" />
            </div>
          </div>
        </div>
      )}

      <iframe
        title="preview-html"
        srcDoc={html}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}

export default PreviewHtml;
