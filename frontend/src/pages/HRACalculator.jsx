import { useState } from "react";
import { FaHome, FaCheckCircle, FaLightbulb } from "react-icons/fa";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { calculateHRA } from "../api";

// Human-readable labels for the 3 conditions, matched to backend keys,
// so we can show all three side-by-side and highlight the winner.
const CONDITION_META = {
  actual_hra_received: { label: "Actual HRA Received" },
  rent_minus_10pct_basic: { label: "Rent Paid − 10% of Basic Salary" },
  pct_of_basic_salary: { label: "% of Basic Salary" },
};

function HRACalculator() {
  const [basicSalary, setBasicSalary] = useState("");
  const [hraReceived, setHraReceived] = useState("");
  const [rentPaid, setRentPaid] = useState("");
  const [isMetro, setIsMetro] = useState(true);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await calculateHRA({
        basic_salary: parseFloat(basicSalary) || 0,
        hra_received: parseFloat(hraReceived) || 0,
        rent_paid: parseFloat(rentPaid) || 0,
        is_metro: isMetro,
      });
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Could not calculate HRA. Please check if the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatRupees = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  // Which backend condition key matches the winning_condition label, so we can highlight it
  const winningKey = result
    ? Object.keys(CONDITION_META).find(
        (key) => CONDITION_META[key].label === result.winning_condition
      ) ||
      // fallback match since backend labels are slightly longer strings
      Object.keys(result.conditions).reduce((closest, key) =>
        result.conditions[key] === result.hra_exemption ? key : closest
      , null)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <PageHeader
        icon={<FaHome />}
        title="HRA Exemption Calculator"
        subtitle="Find out how much House Rent Allowance you can claim as exempt, with the full working shown."
      />

      {/* --- Input Form --- */}
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">
              Basic Salary (Annual) (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              placeholder="e.g. 600000"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">
              HRA Received (Annual) (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={hraReceived}
              onChange={(e) => setHraReceived(e.target.value)}
              placeholder="e.g. 240000"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">
              Rent Paid (Annual) (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={rentPaid}
              onChange={(e) => setRentPaid(e.target.value)}
              placeholder="e.g. 180000"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">City Type</label>
            <select
              value={isMetro ? "metro" : "non-metro"}
              onChange={(e) => setIsMetro(e.target.value === "metro")}
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            >
              <option value="metro">Metro (Delhi, Mumbai, Kolkata, Chennai)</option>
              <option value="non-metro">Non-Metro</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-cream font-semibold py-3 rounded-xl hover:bg-navy-light hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Calculating..." : "Calculate HRA Exemption"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </Card>

      {/* --- Results --- */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Top summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-2xl p-6 shadow-card bg-indiagreen/10 border-2 border-indiagreen">
              <p className="text-sm text-navy/60 mb-1">HRA Exemption (Tax-Free)</p>
              <p className="text-3xl font-heading font-bold text-indiagreen">
                {formatRupees(result.hra_exemption)}
              </p>
            </div>
            <div className="rounded-2xl p-6 shadow-card bg-white border border-navy/10">
              <p className="text-sm text-navy/60 mb-1">Taxable HRA</p>
              <p className="text-3xl font-heading font-bold text-navy-dark">
                {formatRupees(result.taxable_hra)}
              </p>
            </div>
          </div>

          {/* The three conditions, side by side, winner highlighted */}
          <Card>
            <h3 className="font-heading font-semibold text-navy-dark mb-4">
              The Three Conditions (exemption = the smallest of these)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(CONDITION_META).map(([key, meta]) => {
                const isWinner = key === winningKey;
                return (
                  <div
                    key={key}
                    className={`rounded-xl p-4 border-2 ${
                      isWinner ? "border-indiagreen bg-indiagreen/5" : "border-navy/10 bg-navy/5"
                    }`}
                  >
                    <p className="text-xs text-navy/60 mb-1">{meta.label}</p>
                    <p className="text-lg font-heading font-bold text-navy-dark">
                      {formatRupees(result.conditions[key])}
                    </p>
                    {isWinner && (
                      <span className="inline-flex items-center gap-1 text-indiagreen text-xs font-semibold mt-2">
                        <FaCheckCircle /> Lowest — this is the exemption
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Full step-by-step explanation from the backend */}
          <Card className="bg-navy/5">
            <div className="flex items-center gap-2 mb-4">
              <FaLightbulb className="text-saffron" />
              <h3 className="font-heading font-semibold text-navy-dark">Complete Calculation, Explained</h3>
            </div>
            <ol className="space-y-3">
              {result.explanation.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-navy-dark">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-navy text-cream text-xs flex items-center justify-center font-semibold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step.replace(/^Step \d+ — /, "")}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}
    </div>
  );
}

export default HRACalculator;
