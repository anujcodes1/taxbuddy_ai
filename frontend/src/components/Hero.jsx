import { Link } from "react-router-dom";
import { FaRobot, FaCalculator, FaMagic } from "react-icons/fa";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-light">
      {/* --- Drifting gradient blobs: a soft, blurred nod to the Indian tricolor --- */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-16 w-96 h-96 rounded-full bg-saffron/30 blur-3xl animate-blob" />
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-cream/20 blur-3xl animate-blob [animation-delay:4s]" />
        <div className="absolute -bottom-28 left-1/3 w-96 h-96 rounded-full bg-indiagreen/30 blur-3xl animate-blob [animation-delay:8s]" />
      </div>

      {/* --- Faint, slowly spinning chakra ring — motion with restraint --- */}
      <svg
        className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-[0.07] animate-spin-slow hidden md:block"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#FAF7F0"
      >
        <circle cx="50" cy="50" r="46" strokeWidth="0.6" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="4"
            strokeWidth="0.6"
            transform={`rotate(${i * 15} 50 50)`}
          />
        ))}
      </svg>

      <div className="max-w-6xl mx-auto px-6 py-24 md:py-28 relative z-10 text-center">
        <span className="inline-flex items-center gap-2 glass text-cream text-xs font-semibold tracking-wide px-4 py-1.5 rounded-full mb-6 animate-fade-in-up">
          <FaMagic className="text-saffron" /> AI-POWERED INCOME TAX ASSISTANCE
        </span>

        <h1 className="text-4xl md:text-6xl font-heading font-bold text-cream mb-5 leading-tight animate-fade-in-up [animation-delay:0.1s]">
          Taxes, finally <span className="text-saffron">simple</span>.
        </h1>

        <p className="text-cream/75 max-w-2xl mx-auto mb-10 text-base md:text-lg animate-fade-in-up [animation-delay:0.2s]">
          Calculate your tax, compare regimes, find deductions, and get ITR guidance —
          all in one clean, AI-powered portal built for every Indian taxpayer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:0.3s]">
          <Link
            to="/calculator"
            className="flex items-center justify-center gap-2 bg-saffron text-navy-dark font-semibold px-7 py-3.5 rounded-xl hover:bg-gold hover:-translate-y-0.5 hover:shadow-glow transition-all duration-300"
          >
            <FaCalculator /> Calculate My Tax
          </Link>
          <Link
            to="/chatbot"
            className="flex items-center justify-center gap-2 glass text-cream font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 hover:-translate-y-0.5 transition-all duration-300"
          >
            <FaRobot /> Ask TaxBuddy AI
          </Link>
        </div>
      </div>

      {/* Soft fade into the page background below */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-cream" />
    </section>
  );
}

export default Hero;
