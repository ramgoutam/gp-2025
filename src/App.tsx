import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import PatientProfile from "@/pages/PatientProfile";
import Login from "@/pages/Login";
import Scripts from "@/pages/Scripts";
import ReportCard from "@/pages/ReportCard";
import Manufacturing from "@/pages/Manufacturing";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <main className="container mx-auto py-8 px-4">
                    <Dashboard />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <main className="container mx-auto py-8 px-4">
                    <Index />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/:id"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <main className="container mx-auto py-8 px-4">
                    <PatientProfile />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scripts"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <main className="container mx-auto py-8 px-4">
                    <Scripts />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-card"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <main className="container mx-auto py-8 px-4">
                    <ReportCard />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manufacturing"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <main className="container mx-auto py-8 px-4">
                    <Manufacturing />
                  </main>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </SessionContextProvider>
  );
}

export default App;