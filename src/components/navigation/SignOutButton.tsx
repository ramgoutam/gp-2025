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
      
      // Navigate first to ensure UI responsiveness
      navigate("/login");
      
      // Then attempt to clear the session
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        // Still show success toast since user is logged out locally
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      } else {
        console.log("Sign out successful");
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error) {
      console.error("Caught error during sign out:", error);
      // Even if there's an error, we want to ensure the user is redirected
      toast({
        title: "Signed out",
        description: "You have been signed out.",
      });
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