import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import Scripts from "@/pages/Scripts";
import Reports from "@/pages/Reports";
import Manufacturing from "@/pages/Manufacturing";
import PatientProfile from "@/pages/PatientProfile";
import FormBuilder from "@/pages/FormBuilder";
import FormBuilderEditor from "@/pages/FormBuilderEditor";
import ReportCard from "@/pages/ReportCard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/scripts" element={<Scripts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/manufacturing" element={<Manufacturing />} />
              <Route path="/patient/:id" element={<PatientProfile />} />
              <Route path="/form-builder" element={<FormBuilder />} />
              <Route path="/form-builder/:id" element={<FormBuilderEditor />} />
              <Route path="/report-card/:id" element={<ReportCard />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;