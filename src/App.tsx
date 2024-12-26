import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import PatientProfile from "@/pages/PatientProfile";
import Login from "@/pages/Login";
import Scripts from "@/pages/Scripts";
import ReportCard from "@/pages/ReportCard";
import Manufacturing from "@/pages/Manufacturing";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth status:", error);
          toast({
            title: "Authentication Error",
            description: "Please try logging in again",
            variant: "destructive",
          });
          setIsAuthenticated(false);
          // Clear any existing session on error
          await supabase.auth.signOut();
        } else {
          console.log("Protected route - session check:", currentSession?.user?.id);
          setIsAuthenticated(!!currentSession);
          
          if (!currentSession) {
            console.log("No active session found");
            // Ensure clean logout if no session exists
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        setIsAuthenticated(false);
        // Clear session on any error
        await supabase.auth.signOut();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up real-time auth state monitoring
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          console.log("User signed out or deleted");
          setIsAuthenticated(false);
          // Clear any remaining session data
          await supabase.auth.signOut({ scope: 'local' });
        } else if (event === 'SIGNED_IN') {
          console.log("User signed in");
          setIsAuthenticated(true);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (!isAuthenticated) {
    console.log("No authenticated session found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
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
                path="/report-card"
                element={
                  <ProtectedRoute>
                    <ReportCard />
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
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </SessionContextProvider>
  );
}

export default App;