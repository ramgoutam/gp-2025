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
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        setIsAdmin(roles?.role === 'ADMIN');
      }
    };

    checkAdminStatus();
  }, [session]);

  // Check authentication on mount and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && location.pathname !== '/login') {
        navigate('/login');
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (!session && location.pathname !== '/login') {
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