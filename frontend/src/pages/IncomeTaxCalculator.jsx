import { useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { calculateIncomeTax } from "../api";

// A focused, simple calculator: just Annual Salary + Age as inputs,
// and Tax / Rebate / Cess / Final Tax as outputs.
function IncomeTaxCalculator() {
  const [annualSalary, setAnnualSalary] = useState("");
  const [age, setAge] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await calculateIncomeTax({
        annual_salary: parseFloat(annualSalary) || 0,
        age: parseInt(age) || 0,
      });
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Could not calculate tax. Please check if the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <PageHeader
        icon={<FaRupeeSign />}
        title="Indian Income Tax Calculator"
        subtitle="Enter your annual salary and age to see your tax, rebate, cess, and final tax payable."
      />

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
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
              placeholder="e.g. 800000"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">Age (years)</label>
            <input
              type="number"
              required
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 30"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

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
          <div className="mt-8 border-t border-navy/10 pt-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-navy/5 rounded-xl p-5">
                <p className="text-sm text-navy/60">Tax (before rebate)</p>
                <p className="text-xl font-heading font-bold text-navy-dark">
                  ₹{result.tax.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-indiagreen/10 rounded-xl p-5">
                <p className="text-sm text-navy/60">Rebate (Sec 87A)</p>
                <p className="text-xl font-heading font-bold text-indiagreen">
                  ₹{result.rebate.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-navy/5 rounded-xl p-5">
                <p className="text-sm text-navy/60">Cess (4%)</p>
                <p className="text-xl font-heading font-bold text-navy-dark">
                  ₹{result.cess.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-saffron/10 rounded-xl p-5">
                <p className="text-sm text-navy/60">Final Tax Payable</p>
                <p className="text-xl font-heading font-bold text-navy-dark">
                  ₹{result.final_tax.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <p className="text-xs text-navy/50 text-center">
              Taxable income after standard deduction: ₹{result.taxable_income.toLocaleString("en-IN")}
              {" "}(Old Regime slabs, age-based exemption limit applied)
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default IncomeTaxCalculator;
