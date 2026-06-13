import {
  Moon,
  Sun,
  LayoutDashboard,
  CheckSquare,
  Clock,
  LogOut,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import { cn } from "../lib/utils";

/**
 * Layout component that provides the main structure of the application.
 * It includes a responsive sidebar for desktop and a bottom tab bar for mobile.
 */
export default function Layout() {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Timer", path: "/timer", icon: Clock },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden relative font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <img
              src="../../assets/logo.png"
              alt="Logo"
              className="w-12 h-12 rounded-xl mx-auto mb-4"
            />

            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight leading-none">
                STUDY GENIE
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">
                Study Planner
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-6 border-t border-slate-800 bg-slate-950/50">
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700 space-y-4">
            <div className="flex w-full justify-between items-center px-1">
              <span className="text-sm font-bold text-slate-200 truncate">
                {user?.name}
              </span>
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-2 py-2 w-full text-left rounded-md text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-widest"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Mobile Header */}
        <header className="md:hidden h-20 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
              U
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              FocusFlow
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <Outlet />
        </div>

        {/* Mobile Tab Bar */}
        <nav className="md:hidden flex border-t border-slate-200 bg-white shrink-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] uppercase font-bold tracking-wider transition-colors",
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 hover:text-slate-600",
                )
              }
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.name}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] uppercase font-bold tracking-wider text-red-400 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5 mb-1" />
            Logout
          </button>
        </nav>
      </main>
    </div>
  );
}
