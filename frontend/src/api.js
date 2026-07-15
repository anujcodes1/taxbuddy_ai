// api.js
// This file centralizes all calls to our FastAPI backend.
// Keeping API calls in one place makes it easy to change the backend URL later.

import axios from "axios";

// In development this falls back to your local FastAPI server.
// In production, set VITE_API_URL (in a .env file or your host's dashboard)
// to your deployed backend's URL, e.g. https://taxbuddy-api.onrender.com
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// AI Chatbot
export const sendChatMessage = (message) =>
  api.post("/api/chat", { message }).then((res) => res.data);

// Income Tax Calculator (Old Regime full calculator with deductions)
export const calculateTax = (payload) =>
  api.post("/api/calculate-tax", payload).then((res) => res.data);

// Simple Indian Income Tax Calculator (Annual Salary + Age -> Tax, Rebate, Cess, Final Tax)
export const calculateIncomeTax = (payload) =>
  api.post("/api/income-tax-calculator", payload).then((res) => res.data);

// Old vs New Regime Comparison
export const compareRegimes = (payload) =>
  api.post("/api/compare-regimes", payload).then((res) => res.data);

// HRA Calculator
export const calculateHRA = (payload) =>
  api.post("/api/hra-calculator", payload).then((res) => res.data);

// Deduction Finder
export const findDeductions = (payload) =>
  api.post("/api/deduction-finder", payload).then((res) => res.data);

// ITR Form Recommendation
export const recommendITR = (payload) =>
  api.post("/api/recommend-itr", payload).then((res) => res.data);

export default api;
