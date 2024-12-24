import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import PatientProfile from "@/pages/PatientProfile";
import Scripts from "@/pages/Scripts";
import Reports from "@/pages/Reports";
import Calendar from "@/pages/Calendar";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/patient/:id" element={<PatientProfile />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;