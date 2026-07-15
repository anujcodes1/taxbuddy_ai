import { useState } from "react";
import { FaSearchDollar, FaLightbulb, FaCheck, FaTimes } from "react-icons/fa";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { findDeductions } from "../api";

// Each question maps to a boolean field expected by the backend.
// Written as simple yes/no questions, in plain conversational language.
const QUESTIONS = [
  { key: "has_life_insurance", label: "Do you pay premiums for a life insurance policy?" },
  { key: "has_ppf_or_elss", label: "Do you invest in PPF, EPF, or ELSS mutual funds?" },
  { key: "has_health_insurance", label: "Do you pay premiums for a health insurance policy?" },
  { key: "has_home_loan", label: "Are you currently repaying a home loan?" },
  { key: "has_nps", label: "Do you contribute to NPS (National Pension System)?" },
  { key: "has_education_loan", label: "Are you repaying an education loan?" },
];

function DeductionFinder() {
  // null = not answered yet, true = Yes, false = No
  const [answers, setAnswers] = useState(
    Object.fromEntries(QUESTIONS.map((q) => [q.key, null]))
  );
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // The form is complete once every question has a Yes/No answer
  const allAnswered = Object.values(answers).every((v) => v !== null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuggestions(null);
    setLoading(true);

    try {
      // Convert null-safe answers to plain booleans before sending
      const payload = Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [key, Boolean(value)])
      );
      const data = await findDeductions(payload);
      setSuggestions(data.suggestions);
    } catch (err) {
      setError("Could not fetch suggestions. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <PageHeader
        icon={<FaSearchDollar />}
        title="Deduction Finder"
        subtitle="Answer a few simple Yes/No questions to discover deductions you may be eligible for."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {QUESTIONS.map((q) => (
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
              ? "Finding Deductions..."
              : allAnswered
              ? "Find My Deductions"
              : "Please answer all questions above"}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </Card>

      {/* Results: one explanation card per applicable deduction */}
      {suggestions && (
        <div className="mt-8 space-y-4">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-white border border-indiagreen/30 rounded-2xl p-6 shadow-card">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-indiagreen/10 text-indiagreen flex items-center justify-center">
                    <FaLightbulb size={14} />
                  </div>
                  <h3 className="font-heading font-semibold text-navy-dark">{s.title}</h3>
                </div>
                <span className="text-xs font-medium text-indiagreen bg-indiagreen/10 px-3 py-1 rounded-full">
                  {s.limit}
                </span>
              </div>
              <p className="text-sm text-navy/70 leading-relaxed pl-11">{s.simple_explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeductionFinder;
