import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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

  if (loading) return <div>Chargement...</div>;
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
