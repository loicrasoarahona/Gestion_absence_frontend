import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ServiceSelector from "../../core/ServiceSelector";

function Navbar() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    ServiceSelector.authService.logout();
    setMenuOpen(false);
    navigate("/login");
  }

  const initials = user
    ? `${user.name.charAt(0)}${user.surname.charAt(0)}`.toUpperCase()
    : "";

  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="container mx-auto flex items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/ptitpre.png"
            alt="Logo"
            className="w-9 h-9 object-contain"
          />
          <span className="font-semibold text-slate-800">
            Gestion des absences
          </span>
        </Link>

        {user ? (
          <div
            className="relative"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setMenuOpen(false);
              }
            }}
          >
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-slate-100 transition"
            >
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
                {initials}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {user.name} {user.surname}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border border-slate-200 bg-white shadow-lg py-1">
                <p className="px-4 py-2 text-xs text-slate-400 truncate">
                  {user.email}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 transition"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            Se connecter
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
