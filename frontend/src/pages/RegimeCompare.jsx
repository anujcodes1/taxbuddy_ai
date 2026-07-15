import { useState } from "react";
import { FaBalanceScale, FaCheckCircle, FaPiggyBank, FaLandmark, FaTrophy } from "react-icons/fa";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { compareRegimes } from "../api";

function RegimeCompare() {
  // --- Form inputs ---
  const [salary, setSalary] = useState("");
  const [section80c, setSection80c] = useState("");
  const [section80d, setSection80d] = useState("");
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
      const data = await compareRegimes({
        salary: parseFloat(salary) || 0,
        section_80c: parseFloat(section80c) || 0,
        section_80d: parseFloat(section80d) || 0,
        hra_received: parseFloat(hraReceived) || 0,
        rent_paid: parseFloat(rentPaid) || 0,
        is_metro: isMetro,
      });
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Could not compare regimes. Please check if the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatRupees = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <PageHeader
        icon={<FaBalanceScale />}
        title="Old vs New Regime Comparison"
        subtitle="Enter your salary and deductions to see which regime saves you more."
      />

      {/* --- Input Form --- */}
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">
              Annual Salary (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 1200000"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">
              Section 80C Investments (₹)
            </label>
            <input
              type="number"
              min="0"
              value={section80c}
              onChange={(e) => setSection80c(e.target.value)}
              placeholder="e.g. 150000 (PPF, ELSS, LIC...)"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">
              Section 80D — Health Insurance (₹)
            </label>
            <input
              type="number"
              min="0"
              value={section80d}
              onChange={(e) => setSection80d(e.target.value)}
              placeholder="e.g. 25000"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">
              HRA Received (₹ per year)
            </label>
            <input
              type="number"
              min="0"
              value={hraReceived}
              onChange={(e) => setHraReceived(e.target.value)}
              placeholder="e.g. 240000"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">
              Rent Paid (₹ per year)
            </label>
            <input
              type="number"
              min="0"
              value={rentPaid}
              onChange={(e) => setRentPaid(e.target.value)}
              placeholder="e.g. 300000"
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
              {loading ? "Comparing..." : "Compare Regimes"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </Card>

      {/* --- Result Cards --- */}
      {result && (
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Old Regime Tax card */}
            <div
              className={`rounded-2xl p-6 shadow-card transition-all ${
                result.recommended_regime === "Old Regime"
                  ? "bg-white border-2 border-indiagreen"
                  : "bg-white border border-navy/10"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-navy/5 text-navy flex items-center justify-center text-lg mb-3">
                <FaLandmark />
              </div>
              <p className="text-sm text-navy/60 mb-1">Old Regime Tax</p>
              <p className="text-2xl font-heading font-bold text-navy-dark">
                {formatRupees(result.old_regime_tax)}
              </p>
            </div>

            {/* New Regime Tax card */}
            <div
              className={`rounded-2xl p-6 shadow-card transition-all ${
                result.recommended_regime === "New Regime"
                  ? "bg-white border-2 border-indiagreen"
                  : "bg-white border border-navy/10"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-navy/5 text-navy flex items-center justify-center text-lg mb-3">
                <FaLandmark />
              </div>
              <p className="text-sm text-navy/60 mb-1">New Regime Tax</p>
              <p className="text-2xl font-heading font-bold text-navy-dark">
                {formatRupees(result.new_regime_tax)}
              </p>
            </div>

            {/* Savings card */}
            <div className="rounded-2xl p-6 shadow-card bg-saffron/10 border border-saffron/30">
              <div className="w-11 h-11 rounded-xl bg-saffron/20 text-saffron flex items-center justify-center text-lg mb-3">
                <FaPiggyBank />
              </div>
              <p className="text-sm text-navy/60 mb-1">You Save</p>
              <p className="text-2xl font-heading font-bold text-navy-dark">
                {formatRupees(result.savings)}
              </p>
            </div>

            {/* Recommended Regime card */}
            <div className="rounded-2xl p-6 shadow-card bg-indiagreen/10 border border-indiagreen/30">
              <div className="w-11 h-11 rounded-xl bg-indiagreen/20 text-indiagreen flex items-center justify-center text-lg mb-3">
                <FaTrophy />
              </div>
              <p className="text-sm text-navy/60 mb-1">Recommended</p>
              <p className="text-2xl font-heading font-bold text-indiagreen">
                {result.recommended_regime}
              </p>
            </div>
          </div>

          {/* Summary strip */}
          <div className="mt-6 bg-navy rounded-2xl p-6 text-center">
            <p className="text-cream flex items-center justify-center gap-2 flex-wrap">
              <FaCheckCircle className="text-saffron" />
              The <span className="font-bold text-saffron">{result.recommended_regime}</span> saves you{" "}
              <span className="font-bold">{formatRupees(result.savings)}</span> compared to the other
              regime.
            </p>
          </div>

          {/* Breakdown details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <Card>
              <h3 className="font-heading font-semibold text-navy-dark mb-3">Old Regime Breakdown</h3>
              <ul className="text-sm text-navy/70 space-y-2">
                <li>Taxable Income: {formatRupees(result.old_regime_details.taxable_income)}</li>
                <li>HRA Exemption Applied: {formatRupees(result.old_regime_details.hra_exemption)}</li>
                <li>Total Deductions (incl. std. deduction): {formatRupees(result.old_regime_details.total_deductions + 50000)}</li>
              </ul>
            </Card>
            <Card>
              <h3 className="font-heading font-semibold text-navy-dark mb-3">New Regime Breakdown</h3>
              <ul className="text-sm text-navy/70 space-y-2">
                <li>Taxable Income: {formatRupees(result.new_regime_details.taxable_income)}</li>
                <li>Standard Deduction Applied: {formatRupees(75000)}</li>
                <li className="text-navy/50 italic">80C, 80D, and HRA are not available in this regime.</li>
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegimeCompare;
