import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, TestTube, Factory, LogOut, FileText, Beaker, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const mainLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Patients", icon: Users },
  ];

  const labLinks = [
    { to: "/scripts", label: "Lab Scripts", icon: TestTube },
    { to: "/reports", label: "Report Cards", icon: FileText },
    { to: "/manufacturing", label: "Manufacturing", icon: Factory },
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  const isLabRoute = labLinks.some(link => location.pathname === link.to);
  const activeLabLink = labLinks.find(link => location.pathname === link.to);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-primary font-bold text-xl">NYDI</div>
            <div className="flex space-x-4">
              {mainLinks.map(({ to, label, icon: Icon }) => (
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isLabRoute ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2",
                      isLabRoute && "bg-primary text-white"
                    )}
                  >
                    <Beaker className="w-4 h-4" />
                    <span>{activeLabLink ? activeLabLink.label : "Lab"}</span>
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-48 shadow-lg bg-white border border-gray-200 rounded-md z-50"
                >
                  {labLinks.map(({ to, label, icon: Icon }) => (
                    <DropdownMenuItem key={to} asChild>
                      <Link
                        to={to}
                        className={cn(
                          "flex items-center space-x-2 w-full px-3 py-2 hover:bg-gray-50",
                          location.pathname === to && "bg-primary/10"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
