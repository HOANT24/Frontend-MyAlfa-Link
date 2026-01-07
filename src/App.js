import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Documents from "./pages/documents/documents";
import ProtectedRoute from "./pages/login/ProtectedRoute";
import { EtatGlobalProvider } from "./pages/EtatGlobal";

function App() {
  return (
    <EtatGlobalProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Pages protégées */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />

          {/* Page login accessible sans authentification */}
          <Route path="/login" element={<Login />} />

          {/* Route inconnue → home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </EtatGlobalProvider>
  );
}

export default App;
