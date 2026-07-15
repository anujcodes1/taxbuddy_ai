import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaLandmark, FaBars, FaTimes } from "react-icons/fa";

// The list of navigation links, so we don't repeat ourselves in the JSX below
const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/calculator", label: "Tax Calculator" },
  { path: "/income-tax-calculator", label: "Income Tax" },
  { path: "/compare-regimes", label: "Regimes" },
  { path: "/hra-calculator", label: "HRA" },
  { path: "/deduction-finder", label: "Deductions" },
  { path: "/itr-finder", label: "ITR Finder" },
  { path: "/chatbot", label: "AI Chatbot" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy/90 backdrop-blur-md border-b border-cream/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-cream shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center">
            <FaLandmark className="text-navy-dark text-sm" />
          </div>
          <span className="font-heading font-semibold text-lg leading-tight">TaxBuddy AI</span>
        </Link>

        {/* Desktop menu — pill-style active state */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium px-3.5 py-2 rounded-full transition-colors duration-200 ${
                  isActive ? "bg-saffron/15 text-saffron" : "text-cream/80 hover:text-cream hover:bg-cream/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-cream text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="lg:hidden bg-navy-dark flex flex-col px-4 py-3 gap-1 animate-fade-in-up">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-2.5 rounded-lg ${
                  isActive ? "bg-saffron/15 text-saffron" : "text-cream/90"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}

      {/* Soft gradient accent line — a quieter echo of the tricolor, not a hard stripe */}
      <div className="h-0.5 bg-gradient-to-r from-saffron via-cream/40 to-indiagreen" />
    </header>
  );
}

export default Navbar;
