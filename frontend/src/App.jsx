import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import IncomeTaxCalculator from "./pages/IncomeTaxCalculator";
import RegimeCompare from "./pages/RegimeCompare";
import HRACalculator from "./pages/HRACalculator";
import DeductionFinder from "./pages/DeductionFinder";
import ITRFinder from "./pages/ITRFinder";
import Chatbot from "./pages/Chatbot";

// This component defines the overall page layout:
// Navbar on top, page content in the middle (based on the URL route), Footer at the bottom.
// The floating ChatWidget is available on every page.
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/income-tax-calculator" element={<IncomeTaxCalculator />} />
          <Route path="/compare-regimes" element={<RegimeCompare />} />
          <Route path="/hra-calculator" element={<HRACalculator />} />
          <Route path="/deduction-finder" element={<DeductionFinder />} />
          <Route path="/itr-finder" element={<ITRFinder />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}

export default App;
