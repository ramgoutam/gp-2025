import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { MainLinks } from "./navigation/MainLinks";
import { LabMenu } from "./navigation/LabMenu";
import { SignOutButton } from "./navigation/SignOutButton";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication on mount and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth session:", error);
          throw error;
        }

        if (!session && location.pathname !== '/login') {
          console.log("No active session, redirecting to login");
          navigate('/login');
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive"
        });
        navigate('/login');
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || !session) {
        if (location.pathname !== '/login') {
          console.log("Session ended or token refresh failed, redirecting to login");
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, toast]);

  // Hide navigation on login page
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <img 
                src="https://zqlchnhpfdwmqdpmdntc.supabase.co/storage/v1/object/public/Website_images/Logo.png"
                alt="NYDI Logo"
                className="h-14 w-auto"
              />
            </div>
            <div className="flex space-x-4">
              <MainLinks />
              <LabMenu />
            </div>
          </div>
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
};