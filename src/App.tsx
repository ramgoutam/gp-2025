import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Scripts from "@/pages/Scripts";
import Reports from "@/pages/Reports";
import Calendar from "@/pages/Calendar";
import PatientProfile from "@/pages/PatientProfile";
import Login from "@/pages/Login";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/patient/:id" element={<PatientProfile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;