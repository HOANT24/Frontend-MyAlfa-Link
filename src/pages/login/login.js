import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EtatGlobalContext } from "../EtatGlobal";

function Login() {
  const { setClients, setClientSelect } = useContext(EtatGlobalContext);
  const navigate = useNavigate(); // <-- hook pour rediriger

  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // <-- nouvel état

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // <-- on active le loading

    try {
      const response = await fetch(
        "https://backend-myalfa.vercel.app/api/clients/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, mdp }),
        }
      );

      const data = await response.json();

      if (!data || data.length === 0) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      // On extrait uniquement [id, nom]
      const clientsTable = data.map((client) => ({
        id: client.id,
        nom: client.nom,
      }));

      // Stockage global (Context)
      setClients(clientsTable);

      // ✅ Sélection automatique du premier client
      setClientSelect(clientsTable[0] || null);

      // Stockage localStorage
      localStorage.setItem("clients", JSON.stringify(clientsTable));

      // ✅ Redirection automatique vers /home
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la connexion");
      setLoading(false); // <-- on désactive le loading
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 space-y-3 max-w-md mx-auto mt-20">
      <h2 className="text-sm font-medium text-gray-600">Connexion</h2>

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="col-span-1 md:col-span-1 px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
        />

        <input
          type="password"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          required
          className="col-span-1 md:col-span-1 px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
        />

        <button
          className="col-span-1 md:col-span-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          type="submit"
        >
          {loading ? "Connexion ..." : "Se connecter"}{" "}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
