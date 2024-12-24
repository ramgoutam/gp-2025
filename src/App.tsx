import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Scripts from "@/pages/Scripts";
import Reports from "@/pages/Reports";
import Calendar from "@/pages/Calendar";
import PatientProfile from "@/pages/PatientProfile";
import Login from "@/pages/Login";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto py-8 px-4">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/scripts" element={<Scripts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/patient/:id" element={<PatientProfile />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;