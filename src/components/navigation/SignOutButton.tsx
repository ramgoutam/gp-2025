import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SignOutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process...");
      
      // Force clear the session from localStorage
      window.localStorage.removeItem('supabase.auth.token');
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Supabase sign out error:", error);
        // Even if there's an error, we'll continue with the local cleanup
        console.log("Continuing with local cleanup despite error");
      }
      
      // Clear any remaining Supabase items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.')) {
          localStorage.removeItem(key);
        }
      });

      console.log("Local storage cleaned, redirecting to login");
      
      // Show success toast
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      // Force navigation to login page
      navigate("/login", { replace: true });
      
    } catch (error) {
      console.error("Error during sign out process:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
      
      // Even if there's an error, attempt to redirect to login
      navigate("/login", { replace: true });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className="text-gray-600 hover:text-gray-900"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
};