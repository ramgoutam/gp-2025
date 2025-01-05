import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Marketing from "@/pages/Marketing";
import Leads from "@/pages/Leads";
import PatientProfile from "@/pages/PatientProfile";
import Login from "@/pages/Login";
import Scripts from "@/pages/Scripts";
import Manufacturing from "@/pages/Manufacturing";
import Reports from "@/pages/Reports";
import Consultations from "@/pages/Consultations";
import Calendar from "@/pages/Calendar";
import Inventory from "@/pages/Inventory";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  console.log("Protected route - session:", session);

  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <React.StrictMode>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto py-8 px-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketing"
                  element={
                    <ProtectedRoute>
                      <Marketing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leads"
                  element={
                    <ProtectedRoute>
                      <Leads />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consultations"
                  element={
                    <ProtectedRoute>
                      <Consultations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/:id"
                  element={
                    <ProtectedRoute>
                      <PatientProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scripts"
                  element={
                    <ProtectedRoute>
                      <Scripts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manufacturing"
                  element={
                    <ProtectedRoute>
                      <Manufacturing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute>
                      <Inventory />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
          <Toaster />
        </Router>
      </SessionContextProvider>
    </React.StrictMode>
  );
}

export default App;