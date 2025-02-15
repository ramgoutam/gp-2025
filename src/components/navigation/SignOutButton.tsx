import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
export const SignOutButton = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process");

      // Clear all React Query cache
      console.log("Clearing React Query cache");
      queryClient.clear();

      // Clear localStorage
      console.log("Clearing localStorage");
      localStorage.clear();

      // Clear sessionStorage
      console.log("Clearing sessionStorage");
      sessionStorage.clear();

      // Sign out from Supabase with explicit options
      const {
        error
      } = await supabase.auth.signOut({
        scope: 'global' // This ensures all sessions are invalidated
      });
      if (error) {
        console.error("Error during sign out:", error);
        throw error;
      }
      console.log("Successfully signed out and cleared all cache");

      // Show success toast
      toast({
        title: "Signed out successfully",
        description: "You have been signed out and all data has been cleared."
      });

      // Redirect to login page with replace to prevent going back
      navigate("/login", {
        replace: true
      });
    } catch (error) {
      console.error("Error in sign out process:", error);
      toast({
        variant: "destructive",
        title: "Sign out error",
        description: "There was an error signing out. Please try again."
      });

      // Still redirect to login page for safety
      navigate("/login", {
        replace: true
      });
    }
  };
  return <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-[#ff0000]">
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>;
};