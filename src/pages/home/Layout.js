import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Send,
  MessageSquare,
  Calendar,
  Briefcase,
  AppWindow,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Sparkles,
  Lock,
  X,
  Zap,
} from "lucide-react";

import Dashboard from "../dashboard/dashboard";
import Documents from "../documents/documents";
import Requests from "../demandes/demandes";
import Questionnaires from "../questionnaires/questionnaires";
import Appointments from "../rdv/rdv";
import Services from "../prestations/prestations";
import Apps from "../applications/applications";
import { EtatGlobalContext } from "../EtatGlobal";
import logo from "../../assets/images/logo.webp";

const navigation = [
  { name: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { name: "Documents", page: "Documents", icon: FolderOpen },
  { name: "Demandes", page: "Requests", icon: Send },
  { name: "Questionnaires", page: "Questionnaires", icon: MessageSquare },
  { name: "Rendez-vous", page: "Appointments", icon: Calendar },
  { name: "Prestations", page: "Services", icon: Briefcase },
  { name: "Applications", page: "Apps", icon: AppWindow, premium: true },
  {
    name: "MyALFA RHelp",
    page: "external",
    icon: ExternalLink,
    url: "https://myalfa-rhelp.fr",
    external: true,
    premium: true,
  },
];

// Pages qui déclenchent l'overlay premium
const PREMIUM_PAGES = ["Apps", "external"];

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [premiumOverlay, setPremiumOverlay] = useState(null); // { page, name, url?, external? }
  const [setBypassedPages] = useState([]); // pages débloquées en dev

  const IS_PREMIUM = false;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleResize = (e) => setSidebarCollapsed(e.matches);
    setSidebarCollapsed(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const {
    clients,
    clientSelect,
    setClientSelect,
    currentPage,
    setCurrentPage,
  } = useContext(EtatGlobalContext);

  if (clients.length === 0) {
    return (
      <div className="border-t border-slate-100 p-3">
        <p className="text-xs text-gray-400">Aucun client</p>
      </div>
    );
  }

  // dans handleNavClick
  const handleNavClick = (item) => {
    if (item.premium && !IS_PREMIUM) {
      setPremiumOverlay(item);
      return;
    }
    if (item.external) {
      window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }
    setCurrentPage(item.page);
  };

  const handleBypass = () => {
    if (!premiumOverlay) return;

    if (!IS_PREMIUM) {
      // Mode dev : on ferme l'overlay sans naviguer ni bypasser
      setPremiumOverlay(null);
      return;
    }

    // IS_PREMIUM = true : navigation normale
    setBypassedPages((prev) => [...prev, premiumOverlay.page]);
    if (premiumOverlay.external) {
      window.open(premiumOverlay.url, "_blank", "noopener,noreferrer");
    } else {
      setCurrentPage(premiumOverlay.page);
    }
    setPremiumOverlay(null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Documents":
        return <Documents />;
      case "Requests":
        return <Requests />;
      case "Questionnaires":
        return <Questionnaires />;
      case "Appointments":
        return <Appointments />;
      case "Services":
        return <Services />;
      case "Apps":
        return <Apps />;
      default:
        return <Dashboard />;
    }
  };

  const isCurrentPagePremiumLocked =
    PREMIUM_PAGES.includes(currentPage) && !IS_PREMIUM;

  // Nouvelle : détermine le contenu à afficher derrière l'overlay
  const getBlurredPreview = () => {
    if (premiumOverlay?.page === "Apps") return <Apps />;
    // Ajouter d'autres pages premium ici si besoin
    return null;
  };

  const blurredPreview = getBlurredPreview();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-50 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          {!sidebarCollapsed ? (
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
                <img src={logo} alt="Logo" className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-800">
                  MyALFA Link
                </h1>
              </div>
            </Link>
          ) : (
            <Link to="/dashboard" className="mx-auto">
              <div className="w-9 h-9 from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
                <img src={logo} alt="Logo" className="text-white" />
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = !item.external && currentPage === item.page;
            const isPremiumLocked = item.premium && !IS_PREMIUM;

            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-[#840040] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="flex-1 text-left">{item.name}</span>
                )}
                {/* Badge cadenas Premium */}
                {!sidebarCollapsed && isPremiumLocked && (
                  <span className="ml-auto flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-500 border border-amber-200">
                    <Lock className="w-2.5 h-2.5" />
                    Pro
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User / Clients */}
        <div className="border-t border-slate-100 p-3">
          <div className="space-y-1">
            {clients.map((client) => {
              const isSelected = clientSelect?.id === client.id;
              return (
                <div
                  key={client.id}
                  className={`w-full flex items-center justify-between rounded-lg text-sm font-medium transition
                    ${
                      sidebarCollapsed
                        ? "px-2 py-2 justify-center"
                        : "px-3 py-2.5"
                    }
                    ${
                      isSelected
                        ? "bg-[#840040] text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <button
                    onClick={() => setClientSelect(client)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected
                          ? "bg-slate-200 text-[#840040]"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    {!sidebarCollapsed && (
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-white" : "text-slate-700"
                        }`}
                      >
                        {client.nom}
                      </span>
                    )}
                  </button>
                  {!sidebarCollapsed && isSelected && (
                    <button
                      onClick={() => {
                        if (window.confirm("Voulez-vous vous déconnecter ?")) {
                          localStorage.removeItem("clients");
                          setClientSelect(null);
                          window.location.href = "/login";
                        }
                      }}
                      className="p-1"
                      title="Déconnexion"
                    >
                      <LogOut className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3 text-slate-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-slate-600" />
          )}
        </button>
      </aside>

      {/* Main */}
      <main
        className={`flex-1 p-2 transition-all relative ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Contenu normal (page courante) — flouté si page premium locked */}
        <div
          className="transition-all duration-300"
          style={{
            filter: isCurrentPagePremiumLocked ? "blur(6px)" : "none",
            pointerEvents: isCurrentPagePremiumLocked ? "none" : "auto",
            userSelect: isCurrentPagePremiumLocked ? "none" : "auto",
          }}
        >
          {renderContent()}
        </div>

        {/* Overlay Premium avec preview floutée derrière */}
        {premiumOverlay && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6">
            {/* Preview floutée de la page premium en arrière-plan */}
            {blurredPreview && (
              <div
                className="absolute inset-0"
                style={{
                  filter: "blur(2px)",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {blurredPreview}
              </div>
            )}

            {/* Fond semi-transparent par-dessus la preview */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}
            />

            {/* Carte overlay — z élevé pour passer au-dessus */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center">
              {/* Bouton X dev */}
              <button
                onClick={handleBypass}
                title="Dev — ignorer (à retirer)"
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Icône Premium */}
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                <Sparkles className="w-7 h-7 text-white" />
              </div>

              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 mb-3">
                <Zap className="w-3 h-3" />
                Fonctionnalité Premium
              </span>

              <h2 className="text-lg font-bold text-slate-800 mt-1 mb-2">
                Passez en Premium
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                L'accès à{" "}
                <span className="font-semibold text-slate-700">
                  {premiumOverlay.name}
                </span>{" "}
                est réservé aux abonnés Premium. Débloquez toutes les
                fonctionnalités avancées de MyALFA Link.
              </p>

              {/* Avantages */}
              <ul className="text-left space-y-2 mb-6">
                {[
                  "Applications tierces connectées",
                  "Support prioritaire RHelp",
                  "Accès illimité à tous les modules",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="#059669"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-orange-200 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Passer à Premium
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Layout;
