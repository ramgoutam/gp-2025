import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MainLinks } from "./navigation/MainLinks";
import { LabMenu } from "./navigation/LabMenu";
import { SignOutButton } from "./navigation/SignOutButton";
import { Shield } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user) {
        console.log("Checking admin status for user:", session.user.id);
        try {
          const { data: roles, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle(); // Changed from .single() to .maybeSingle()

          if (error) {
            console.error("Error fetching user role:", error);
            return;
          }

          console.log("User roles data:", roles);
          setIsAdmin(roles?.role === 'ADMIN');
        } catch (error) {
          console.error("Error in checkAdminStatus:", error);
        }
      }
    };

    checkAdminStatus();
  }, [session]);

  // Check authentication on mount and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication status");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking auth status:", error);
      }
      
      if (!session && location.pathname !== '/login') {
        console.log("No session found, redirecting to login");
        navigate('/login');
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
              {isAdmin && (
                <a
                  href="/admin"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${location.pathname === "/admin"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </a>
              )}
            </div>
          </div>
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
};