import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import Patient from '@/pages/Patient';
import Admin from '@/pages/Admin';
import Lab from '@/pages/Lab';
import LabRequest from '@/pages/LabRequest';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto py-6">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/patients/:id" element={<Patient />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/lab" element={<Lab />} />
                  <Route path="/lab/:id" element={<LabRequest />} />
                </Routes>
              </main>
              <Toaster />
            </div>
          </BrowserRouter>
        </SessionContextProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;