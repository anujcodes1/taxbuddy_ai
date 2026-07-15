import { useState } from "react";
import { FaCalculator } from "react-icons/fa";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { calculateTax } from "../api";

function Calculator() {
  // Form state — everything the user types/selects
  const [grossIncome, setGrossIncome] = useState("");
  const [regime, setRegime] = useState("new");
  const [deductions, setDeductions] = useState("");
  const [ageGroup, setAgeGroup] = useState("below60");

  // Result state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await calculateTax({
        gross_income: parseFloat(grossIncome) || 0,
        regime,
        deductions: parseFloat(deductions) || 0,
        age_group: ageGroup,
      });
      setResult(data);
    } catch (err) {
      setError("Could not calculate tax. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <PageHeader
        icon={<FaCalculator />}
        title="Income Tax Calculator"
        subtitle="Estimate your income tax liability for FY 2025-26."
      />

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gross annual income */}
          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">
              Gross Annual Income (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={grossIncome}
              onChange={(e) => setGrossIncome(e.target.value)}
              placeholder="e.g. 1200000"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          {/* Regime selector */}
          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">Tax Regime</label>
            <select
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            >
              <option value="new">New Regime</option>
              <option value="old">Old Regime</option>
            </select>
          </div>

          {/* Deductions — only relevant for old regime */}
          {regime === "old" && (
            <div>
              <label className="block text-sm font-medium text-navy-dark mb-1">
                Total Deductions (80C, 80D, HRA, etc.) (₹)
              </label>
              <input
                type="number"
                min="0"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>
          )}

          {/* Age group — affects old regime exemption limit */}
          {regime === "old" && (
            <div>
              <label className="block text-sm font-medium text-navy-dark mb-1">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
              >
                <option value="below60">Below 60 years</option>
                <option value="senior">60 - 80 years (Senior Citizen)</option>
                <option value="super_senior">Above 80 years (Super Senior)</option>
              </select>
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-cream font-semibold py-3 rounded-xl hover:bg-navy-light hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Calculating..." : "Calculate Tax"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        {result && (
          <div className="mt-8 border-t border-navy/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-navy/5 rounded-xl p-5">
              <p className="text-sm text-navy/60">Taxable Income</p>
              <p className="text-2xl font-heading font-bold text-navy-dark">
                ₹{result.taxable_income.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-saffron/10 rounded-xl p-5">
              <p className="text-sm text-navy/60">Total Tax Payable (incl. cess)</p>
              <p className="text-2xl font-heading font-bold text-indiagreen">
                ₹{result.tax_payable.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Calculator;
