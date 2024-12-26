import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import PatientProfile from "@/pages/PatientProfile";
import Login from "@/pages/Login";
import { FormBuilder } from "@/pages/FormBuilder";
import { FormBuilderEditor } from "@/pages/FormBuilderEditor";

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Index />} />
              <Route path="/patient/:id" element={<PatientProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/form-builder" element={<FormBuilder />} />
              <Route path="/form-builder/new" element={<FormBuilderEditor />} />
              <Route path="/form-builder/:id" element={<FormBuilderEditor />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </SessionContextProvider>
  );
}

export default App;