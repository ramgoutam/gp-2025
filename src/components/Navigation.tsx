import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, TestTube, Factory, FileText, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Patients", icon: Users },
    { to: "/scripts", label: "Scripts", icon: TestTube },
    { to: "/report-card", label: "Report Card", icon: FileText },
    { to: "/manufacturing", label: "Manufacturing", icon: Factory },
  ];

  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process...");
      
      // First clear local storage
      localStorage.clear();
      console.log("Cleared local storage");
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'local'
      });
      
      if (error) {
        console.error("Error during sign out:", error);
        throw error;
      }

      console.log("Successfully signed out");
      
      // Show success message
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      
      // Navigate to login page
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error("Sign out error:", error);
      // Even if there's an error, we want to clear everything and redirect
      toast({
        title: "Signing out",
        description: "Redirecting to login page",
      });
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                    isActive ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};