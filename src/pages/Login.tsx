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
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session:", session);
      if (session) {
        console.log("User already logged in, redirecting to dashboard");
        navigate("/");
      }
      if (error) {
        console.error("Error checking session:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem checking your login status.",
        });
      }
    };
    
    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        console.log("Auth state changed:", event, session);
        switch (event) {
          case "SIGNED_IN":
            if (session) {
              console.log("User signed in, redirecting to dashboard");
              // Refresh the session to ensure we have the latest token
              const { error: refreshError } = await supabase.auth.refreshSession();
              if (refreshError) {
                console.error("Error refreshing session:", refreshError);
                toast({
                  variant: "destructive",
                  title: "Session Error",
                  description: "There was a problem with your session. Please try logging in again.",
                });
                return;
              }
              toast({
                title: "Welcome back!",
                description: "You have successfully signed in.",
              });
              navigate("/");
            }
            break;
          case "SIGNED_OUT":
            console.log("User signed out, staying on login page");
            navigate("/login");
            break;
          case "USER_UPDATED":
            console.log("User updated");
            break;
          case "TOKEN_REFRESHED":
            console.log("Token refreshed");
            break;
          case "MFA_CHALLENGE_VERIFIED":
            console.log("MFA challenge verified");
            break;
          default:
            console.log("Unhandled auth event:", event);
        }
      }
    );

    return () => {
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
          providers={["google"]}
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </div>
    </div>
  );
};

export default Login;