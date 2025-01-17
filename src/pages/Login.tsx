import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have an active session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your login status.",
            variant: "destructive",
          });
          return;
        }

        if (currentSession) {
          console.log("Active session found, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("Unexpected error during session check:", error);
      }
    };

    checkSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
      if (event === 'USER_UPDATED') {
        console.log("User updated");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [session, navigate, toast]);

  return (
    <Card className="w-full max-w-md mx-auto mt-20 animate-fade-in">
      <CardHeader className="space-y-4 text-center pb-0">
        <div className="flex justify-center items-center py-6">
          <img
            src="https://zqlchnhpfdwmqdpmdntc.supabase.co/storage/v1/object/public/Website_images/Logo.png"
            alt="Company Logo"
            className="h-20 w-auto object-contain transform hover:scale-105 transition-transform duration-200"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4F6BFF',
                  brandAccent: '#3D54CC',
                },
              },
            },
          }}
          providers={[]}
        />
      </CardContent>
    </Card>
  );
}