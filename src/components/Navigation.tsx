import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { MainLinks } from "./navigation/MainLinks";
import { LabMenu } from "./navigation/LabMenu";
import { SignOutButton } from "./navigation/SignOutButton";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Simplified auth check - only redirect if on login page and already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Navigation - checking auth, session:", session);
      
      // Only redirect if we're on login page and have a session
      if (session && location.pathname === '/login') {
        console.log("Already authenticated, redirecting to home");
        navigate('/');
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (!session && location.pathname !== '/login') {
        console.log("Session ended, redirecting to login");
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

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