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
        if (event === "SIGNED_IN" && session) {
          console.log("User signed in, redirecting to dashboard");
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="w-full max-w-md p-8 space-y-6 animate-fade-in">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 backdrop-blur-sm backdrop-filter">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 to-transparent rounded-2xl" />
          
          <div className="relative space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Welcome back
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please sign in to your account
              </p>
            </div>

            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    background: 'rgb(79, 107, 255)',
                    borderRadius: '0.5rem',
                    fontSize: '14px',
                    padding: '10px 15px',
                    transition: 'all 0.2s ease',
                  },
                  input: {
                    borderRadius: '0.5rem',
                    fontSize: '14px',
                    padding: '10px 15px',
                  },
                  anchor: {
                    color: 'rgb(79, 107, 255)',
                    textDecoration: 'none',
                    fontWeight: '500',
                  },
                  container: {
                    gap: '1rem',
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'hover:bg-primary-600 active:bg-primary-700',
                  input: 'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
                }
              }}
              providers={[]}
              redirectTo={`${window.location.origin}/`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;