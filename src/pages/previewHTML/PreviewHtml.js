import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";

function PreviewHtml() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");

  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
