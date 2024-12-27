import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Scripts from "./pages/Scripts";
import Calendar from "./pages/Calendar";
import Manufacturing from "./pages/Manufacturing";
import Reports from "./pages/Reports";
import PatientProfile from "./pages/PatientProfile";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/manufacturing" element={<Manufacturing />} />
          <Route path="/patient/:id" element={<PatientProfile />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;