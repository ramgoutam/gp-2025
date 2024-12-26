import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, TestTube, Factory, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Patients", icon: Users },
    { to: "/scripts", label: "Lab Scripts", icon: TestTube },
    { to: "/manufacturing", label: "Manufacturing", icon: Factory },
  ];

  const handleSignOut = async () => {
    console.log("Starting sign out process");
    
    try {
      // Force sign out without checking session
      await supabase.auth.signOut({ scope: 'local' });
      
      console.log("Local sign out successful");
      
      // Clear any local storage or state if needed
      localStorage.clear();
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      // Always redirect to login
      navigate("/login");
      
    } catch (error) {
      console.error("Error during sign out:", error);
      
      // Even if there's an error, we want to clear local state and redirect
      localStorage.clear();
      
      toast({
        variant: "destructive",
        title: "Sign out issue",
        description: "There was an issue signing out, but you've been redirected to login.",
      });
      
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-primary font-bold text-xl">NYDI</div>
            <div className="flex space-x-4">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === to
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};