import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import PatientProfile from "./pages/PatientProfile";
import Index from "./pages/Index";
import Scripts from "./pages/Scripts";
import Reports from "./pages/Reports";
import Calendar from "./pages/Calendar";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/patient/:id" element={<PatientProfile />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;