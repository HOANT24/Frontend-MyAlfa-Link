import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Send,
  MessageSquare,
  AppWindow,
  LogOut,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Briefcase,
  ExternalLink,
  Menu,
  X,
  PhoneCall,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { name: "Documents", page: "Documents", icon: FolderOpen },
  { name: "Demandes", page: "Requests", icon: Send },
  { name: "Questionnaires", page: "Questionnaires", icon: MessageSquare },
  { name: "Rendez-vous", page: "Appointments", icon: Calendar },
  { name: "Prestations", page: "Services", icon: Briefcase },
  { name: "Applications", page: "Apps", icon: AppWindow },
  { name: "Contact", page: "Contact", icon: PhoneCall },
  {
    name: "MyALFA RHelp",
    page: "external",
    icon: ExternalLink,
    url: "https://myalfa-rhelp.fr",
    external: true,
  },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const isActive = (pageName) => currentPageName === pageName;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar — desktop only */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-50 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          {!sidebarCollapsed && (
            <Link
              to={createPageUrl("Dashboard")}
              className="flex items-center gap-3"
            >
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
          )}
          {sidebarCollapsed && (
            <Link to={createPageUrl("Dashboard")} className="mx-auto">
              <div className="w-9 h-9 bg-gradient-to-br from-[#840040] to-[#a00050] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </a>
              );
            }
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.page)
                    ? "bg-[#840040] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-100 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  sidebarCollapsed ? "px-2" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {user?.full_name || "Client"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 md:${
          sidebarCollapsed ? "ml-20" : "ml-64"
        } ml-0`}
      >
        {children}
      </main>

      {/* Mobile FAB + Menu */}
      <div className="md:hidden">
        {/* Backdrop */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Menu items fanning out above the FAB */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
              {/* User info */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: navigation.length * 0.04 }}
                className="flex items-center gap-2 bg-white rounded-xl shadow-lg px-3 py-2 border border-slate-100"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-800">
                    {user?.full_name || "Client"}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {[...navigation].reverse().map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 40, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.8 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm font-medium text-white bg-slate-800/80 px-2.5 py-1 rounded-lg shadow backdrop-blur-sm">
                    {item.name}
                  </span>
                  {item.external ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-11 h-11 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center"
                    >
                      <item.icon className="w-5 h-5 text-slate-600" />
                    </a>
                  ) : (
                    <Link
                      to={createPageUrl(item.page)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-11 h-11 rounded-full shadow-lg border flex items-center justify-center transition-colors ${
                        isActive(item.page)
                          ? "bg-[#840040] border-[#840040] text-white"
                          : "bg-white border-slate-100 text-slate-600"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* FAB Button */}
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-[#840040] shadow-xl flex items-center justify-center text-white"
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: mobileMenuOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
