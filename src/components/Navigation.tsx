import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FileSpreadsheet, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Hide navigation on login and signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: error.message,
        });
      } else {
        console.log("Successfully signed out, redirecting to login");
        navigate("/login");
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    }
  };

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Patients", icon: Users },
    { to: "/form-builder", label: "Form Builder", icon: FileSpreadsheet },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full top-0 z-50 transition-all duration-300 hover:shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-primary font-bold text-xl tracking-tight hover:scale-105 transition-transform duration-300"
            >
              NYDI
            </Link>
            <div className="flex space-x-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                    "hover:bg-primary/5 hover:scale-105",
                    location.pathname === to
                      ? "bg-primary text-white shadow-lg hover:bg-primary/90 hover:shadow-xl animate-fade-in"
                      : "text-gray-600"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium",
              "text-gray-600 hover:bg-red-50 hover:text-red-600",
              "transition-all duration-300 hover:scale-105",
              "border border-transparent hover:border-red-200"
            )}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};