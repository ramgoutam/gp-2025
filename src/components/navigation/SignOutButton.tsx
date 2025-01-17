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
      console.log("Starting sign out process");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        throw error;
      }

      console.log("Successfully signed out");
      
      // Show success toast
      toast({
        title: "Signed out successfully",
        description: "You have been signed out.",
      });
      
      // Redirect to login page
      navigate("/login", { replace: true });
      
    } catch (error) {
      console.error("Error in sign out process:", error);
      
      toast({
        variant: "destructive",
        title: "Sign out error",
        description: "There was an error signing out. Please try again.",
      });
      
      // Still redirect to login page for safety
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