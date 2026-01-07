import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
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
  Building2,
  User,
  LogOut,
} from "lucide-react";

import Dashboard from "../login/login";
import Documents from "../documents/documents";
import Requests from "../demandes/demandes";
import Questionnaires from "../questionnaires/questionnaires";
import Appointments from "../rdv/rdv";
import Services from "../prestations/prestations";
import Apps from "../applications/applications";
import { EtatGlobalContext } from "../EtatGlobal";

const navigation = [
  { name: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { name: "Documents", page: "Documents", icon: FolderOpen },
  { name: "Demandes", page: "Requests", icon: Send },
  { name: "Questionnaires", page: "Questionnaires", icon: MessageSquare },
  { name: "Rendez-vous", page: "Appointments", icon: Calendar },
  { name: "Prestations", page: "Services", icon: Briefcase },
  { name: "Applications", page: "Apps", icon: AppWindow },
  {
    name: "MyALFA RHelp",
    page: "external",
    icon: ExternalLink,
    url: "https://myalfa-rhelp.fr",
    external: true,
  },
];

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("Documents");
  const { clients, clientSelect, setClientSelect } =
    useContext(EtatGlobalContext);

  if (clients.length === 0) {
    return (
      <div className="border-t border-slate-100 p-3">
        <p className="text-xs text-gray-400">Aucun client</p>
      </div>
    );
  }

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
              <div className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-800">
                  MyALFA Link
                </h1>
                <p className="text-xs text-slate-500">Cabinet Expert</p>
              </div>
            </Link>
          ) : (
            <Link to="/dashboard" className="mx-auto">
              <div className="w-9 h-9 bg-gradient-to-br from-[#840040] to-[#a00050] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navigation.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  <item.icon className="w-5 h-5" />
                  {!sidebarCollapsed && item.name}
                </a>
              );
            }

            const isActive = currentPage === item.page;

            return (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-[#840040] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && item.name}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-slate-100 p-3">
          <div className="space-y-1">
            {clients.map((client) => {
              const isSelected = clientSelect?.id === client.id;

              return (
                <div
                  key={client.id}
                  className={`w-full flex items-center justify-between rounded-lg text-sm font-medium transition
            ${sidebarCollapsed ? "px-2 py-2 justify-center" : "px-3 py-2.5"} 
            ${
              isSelected
                ? "bg-[#840040] text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
                >
                  {/* Client info */}
                  <button
                    onClick={() => setClientSelect(client)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center
                ${
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

                  {/* Bouton Logout uniquement si client sélectionné */}
                  {!sidebarCollapsed && isSelected && (
                    <button
                      onClick={() => {
                        if (window.confirm("Voulez-vous vous déconnecter ?")) {
                          localStorage.removeItem("clients");
                          setClientSelect(null);
                          window.location.href = "/login";
                        }
                      }}
                      className="p-1" // plus discret, pas de hover
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
        className={`flex-1 p-6 transition-all ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {renderContent()}
      </main>
    </div>
  );
}

export default Layout;
