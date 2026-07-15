import { Link } from "react-router-dom";
import { FaRobot, FaCalculator, FaBalanceScale, FaHome, FaSearchDollar, FaFileAlt, FaRupeeSign } from "react-icons/fa";
import Hero from "../components/Hero";
import Card from "../components/Card";

// List of all features shown as cards on the homepage.
// Each has its own gradient — a small personality touch, like tool icons in a modern AI app.
const FEATURES = [
  {
    icon: <FaRobot />,
    title: "AI Tax Chatbot",
    desc: "Ask any Income Tax question in plain English and get instant, accurate answers.",
    path: "/chatbot",
    gradient: "from-navy to-navy-light",
  },
  {
    icon: <FaCalculator />,
    title: "Income Tax Calculator",
    desc: "Calculate your exact tax liability under the New or Old Regime in seconds.",
    path: "/calculator",
    gradient: "from-saffron to-gold",
  },
  {
    icon: <FaRupeeSign />,
    title: "Income Tax (Age-based)",
    desc: "Enter your salary and age to instantly see Tax, Rebate, Cess, and Final Tax.",
    path: "/income-tax-calculator",
    gradient: "from-indiagreen to-navy-light",
  },
  {
    icon: <FaBalanceScale />,
    title: "Old vs New Regime",
    desc: "Compare both tax regimes side-by-side and find out which saves you more.",
    path: "/compare-regimes",
    gradient: "from-navy-light to-indiagreen",
  },
  {
    icon: <FaHome />,
    title: "HRA Calculator",
    desc: "Find out exactly how much House Rent Allowance exemption you can claim.",
    path: "/hra-calculator",
    gradient: "from-gold to-saffron",
  },
  {
    icon: <FaSearchDollar />,
    title: "Deduction Finder",
    desc: "Answer a few quick questions to discover deductions you may be missing.",
    path: "/deduction-finder",
    gradient: "from-indiagreen to-gold",
  },
  {
    icon: <FaFileAlt />,
    title: "ITR Form Recommendation",
    desc: "Not sure which ITR form to file? We'll recommend the right one for you.",
    path: "/itr-finder",
    gradient: "from-navy to-indiagreen",
  },
];

function Home() {
  return (
    <div>
      <Hero />

      {/* Feature cards section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-navy-dark mb-3">
            Everything You Need for Tax Filing
          </h2>
          <p className="text-navy/60 max-w-xl mx-auto">
            Six powerful tools built to make Indian Income Tax simple, transparent, and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div key={feature.path} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <Link to={feature.path}>
                <Card className="h-full hover:-translate-y-1">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center text-xl mb-4 shadow-card`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-navy-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-navy/60">{feature.desc}</p>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / stats strip */}
      <section className="bg-white border-y border-navy/5 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in-up">
            <div className="w-11 h-11 rounded-xl bg-navy/5 text-navy flex items-center justify-center text-lg mx-auto mb-2">
              <FaFileAlt />
            </div>
            <p className="text-3xl font-heading font-bold text-navy">7+</p>
            <p className="text-sm text-navy/60">Smart Tax Tools</p>
          </div>
          <div className="animate-fade-in-up [animation-delay:0.1s]">
            <div className="w-11 h-11 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center text-lg mx-auto mb-2">
              <FaRobot />
            </div>
            <p className="text-3xl font-heading font-bold text-navy">AI</p>
            <p className="text-sm text-navy/60">Powered by Gemini</p>
          </div>
          <div className="animate-fade-in-up [animation-delay:0.2s]">
            <div className="w-11 h-11 rounded-xl bg-indiagreen/10 text-indiagreen flex items-center justify-center text-lg mx-auto mb-2">
              <FaBalanceScale />
            </div>
            <p className="text-3xl font-heading font-bold text-navy">24/7</p>
            <p className="text-sm text-navy/60">Always Available</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
