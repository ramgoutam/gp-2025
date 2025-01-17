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
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session, just redirect to login
        console.log("No active session found, redirecting to login");
        navigate("/login");
        return;
      }

      // Proceed with sign out if we have a session
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        throw error;
      }

      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      
      // Show error toast but still redirect to login
      toast({
        variant: "destructive",
        title: "Error during sign out",
        description: "You have been redirected to the login page.",
      });
      
      navigate("/login");
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