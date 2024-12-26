import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, TestTube, Factory, FileText, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export const Navigation = ({ session }) => {
  const location = useLocation();
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
      if (error) throw error;
      toast({
        title: "Signed out successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
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
          {session && (
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};