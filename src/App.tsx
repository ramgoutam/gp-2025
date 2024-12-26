import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import PatientProfile from "@/pages/PatientProfile";
import Scripts from "@/pages/Scripts";
import ReportCard from "@/pages/ReportCard";
import Manufacturing from "@/pages/Manufacturing";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Index />} />
          <Route path="/patient/:id" element={<PatientProfile />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/report-card" element={<ReportCard />} />
          <Route path="/manufacturing" element={<Manufacturing />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;