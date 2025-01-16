import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SignOutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    console.log("Starting sign out process...");
    
    try {
      // Immediately redirect to login to prevent access to protected routes
      navigate("/login", { replace: true });

      // Clear all Supabase-related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.')) {
          console.log('Removing localStorage item:', key);
          localStorage.removeItem(key);
        }
      });

      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Supabase sign out error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred during sign out.",
        });
      }
    } catch (error) {
      console.error("Error during sign out process:", error);
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