import { useState } from "react";
import { FaFileAlt, FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { recommendITR } from "../api";

// Simple yes/no questions about the kinds of income the person has,
// alongside the one numeric field (Salary).
const YES_NO_QUESTIONS = [
  { key: "has_business_income", label: "Do you have business or professional income?" },
  { key: "has_capital_gains", label: "Do you have capital gains (from shares, mutual funds, or property)?" },
  { key: "has_rental_income", label: "Do you earn rental income from a house property?" },
];

function ITRFinder() {
  const [salary, setSalary] = useState("");
  // null = not answered yet, true = Yes, false = No
  const [answers, setAnswers] = useState(
    Object.fromEntries(YES_NO_QUESTIONS.map((q) => [q.key, null]))
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const allAnswered = Object.values(answers).every((v) => v !== null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await recommendITR({
        salary: parseFloat(salary) || 0,
        has_business_income: Boolean(answers.has_business_income),
        has_capital_gains: Boolean(answers.has_capital_gains),
        has_rental_income: Boolean(answers.has_rental_income),
      });
      setResult(data);
    } catch (err) {
      setError("Could not fetch recommendation. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <PageHeader
        icon={<FaFileAlt />}
        title="ITR Form Recommendation"
        subtitle="Tell us about your income sources and we'll recommend the right ITR form — with reasons."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Salary input */}
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
              placeholder="e.g. 900000"
              className="w-full border border-navy/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          {/* Yes/No questions */}
          {YES_NO_QUESTIONS.map((q) => (
            <div
              key={q.key}
              className="flex items-center justify-between gap-4 border border-navy/10 rounded-lg px-4 py-3"
            >
              <span className="text-sm text-navy-dark">{q.label}</span>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setAnswer(q.key, true)}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    answers[q.key] === true
                      ? "bg-indiagreen text-white border-indiagreen"
                      : "bg-white text-navy-dark border-navy/20 hover:border-indiagreen"
                  }`}
                >
                  <FaCheck size={10} /> Yes
                </button>
                <button
                  type="button"
                  onClick={() => setAnswer(q.key, false)}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    answers[q.key] === false
                      ? "bg-navy text-cream border-navy"
                      : "bg-white text-navy-dark border-navy/20 hover:border-navy"
                  }`}
                >
                  <FaTimes size={10} /> No
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading || !allAnswered}
            className="w-full bg-navy text-cream font-semibold py-3 rounded-xl hover:bg-navy-light hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? "Checking..."
              : allAnswered
              ? "Recommend ITR Form"
              : "Please answer all questions above"}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </Card>

      {/* Result */}
      {result && (
        <div className="mt-8 space-y-5">
          <div className="bg-saffron/10 border border-saffron/30 rounded-2xl p-6 text-center">
            <p className="text-sm text-navy/60 mb-1">Recommended Form</p>
            <p className="text-3xl font-heading font-bold text-navy-dark">
              {result.recommended_form}
            </p>
          </div>

          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-navy/5 text-navy flex items-center justify-center shrink-0">
                <FaInfoCircle size={14} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-navy-dark mb-1">Why this form?</h3>
                <p className="text-sm text-navy/70 leading-relaxed">{result.reason}</p>
              </div>
            </div>
            <div className="border-t border-navy/10 pt-4">
              <h4 className="text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1">
                About {result.recommended_form}
              </h4>
              <p className="text-sm text-navy/70 leading-relaxed">{result.form_description}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ITRFinder;
