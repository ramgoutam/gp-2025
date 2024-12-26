import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import PatientProfile from "@/pages/PatientProfile";
import Login from "@/pages/Login";
import { FormBuilder } from "@/pages/FormBuilder";
import { FormBuilderEditor } from "@/pages/FormBuilderEditor";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Protected route - checking session:", currentSession ? "Authenticated" : "Not authenticated");
      
      if (!currentSession) {
        console.log("No active session, redirecting to login");
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
      }
    };

    checkAuth();
  }, [toast]);

  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("App level - Auth state changed:", event);
      console.log("App level - Session state:", session ? "Authenticated" : "Not authenticated");
    });

    return () => {
      console.log("Cleaning up auth subscription in App");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/patients" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/patient/:id" element={
                <ProtectedRoute>
                  <PatientProfile />
                </ProtectedRoute>
              } />
              <Route path="/form-builder" element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              } />
              <Route path="/form-builder/new" element={
                <ProtectedRoute>
                  <FormBuilderEditor />
                </ProtectedRoute>
              } />
              <Route path="/form-builder/:id" element={
                <ProtectedRoute>
                  <FormBuilderEditor />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </SessionContextProvider>
  );
}

export default App;