import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Login component mounted");
    
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Current session check:", session?.user?.id);
        
        if (error) {
          console.error("Session check error:", error);
          throw error;
        }
        
        if (session) {
          console.log("Active session found, redirecting to dashboard");
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem checking your login status.",
        });
      }
    };
    
    // Run initial session check
    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === "SIGNED_IN" && session) {
          console.log("Sign in detected, redirecting to dashboard");
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          // Use setTimeout to ensure state updates are processed
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 100);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo={`${window.location.origin}/`}
        />
      </div>
    </div>
  );
};

export default Login;