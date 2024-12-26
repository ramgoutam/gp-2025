import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import Scripts from "@/pages/Scripts";
import Reports from "@/pages/Reports";
import Manufacturing from "@/pages/Manufacturing";
import PatientProfile from "@/pages/PatientProfile";
import { FormBuilder } from "@/pages/FormBuilder";
import { FormBuilderEditor } from "@/pages/FormBuilderEditor";
import ReportCard from "@/pages/ReportCard";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("Auth state changed:", _event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[]}
          />
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <Navigation session={session} />
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