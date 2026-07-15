import { Link } from "react-router-dom";
import { FaLandmark } from "react-icons/fa";

const QUICK_LINKS = [
  { path: "/income-tax-calculator", label: "Income Tax Calculator" },
  { path: "/compare-regimes", label: "Old vs New Regime" },
  { path: "/hra-calculator", label: "HRA Calculator" },
  { path: "/deduction-finder", label: "Deduction Finder" },
];

function Footer() {
  return (
    <footer className="bg-navy-dark text-cream mt-16">
      <div className="h-0.5 bg-gradient-to-r from-saffron via-cream/40 to-indiagreen" />
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaLandmark className="text-saffron text-xl" />
            <h3 className="font-heading font-semibold text-lg">TaxBuddy AI</h3>
          </div>
          <p className="text-sm text-cream/70">
            An AI-powered assistant to help you understand Indian Income Tax rules,
            calculate your tax, and file with confidence.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
          <ul className="text-sm text-cream/70 space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-saffron transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-3">Disclaimer</h4>
          <p className="text-sm text-cream/70">
            This is a demo educational project. Figures are simplified and should
            not be treated as official tax advice. Please consult a qualified
            Chartered Accountant or refer to incometax.gov.in for filing purposes.
          </p>
        </div>
      </div>
      <div className="text-center text-xs text-cream/50 py-4 border-t border-cream/10">
        © {new Date().getFullYear()} TaxBuddy AI — Built for learning purposes.
      </div>
    </footer>
  );
}

export default Footer;
