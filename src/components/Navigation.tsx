import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, TestTube, Factory, FileText, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Patients", icon: Users },
    { to: "/scripts", label: "Scripts", icon: TestTube },
    { to: "/report-card", label: "Report Card", icon: FileText },
    { to: "/manufacturing", label: "Manufacturing", icon: Factory },
  ];

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
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