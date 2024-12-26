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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-300 via-primary-200 to-primary-100">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg p-8 space-y-6">
          {/* Auth Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            <button className="px-6 py-2 rounded-full bg-primary-500 text-white font-medium w-1/2">
              Login
            </button>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: '#6C5CE7',
                  borderRadius: '999px',
                  fontSize: '14px',
                  padding: '12px 16px',
                  fontWeight: '500',
                  color: 'white',
                  transition: 'all 0.2s ease',
                },
                input: {
                  borderRadius: '12px',
                  fontSize: '14px',
                  padding: '12px 16px',
                  backgroundColor: 'white',
                  border: '1px solid #E9ECEF',
                  color: '#1a1a1a',
                },
                anchor: {
                  color: '#6C5CE7',
                  textDecoration: 'none',
                  fontWeight: '500',
                },
                container: {
                  gap: '1rem',
                },
                divider: {
                  backgroundColor: '#E9ECEF',
                },
                message: {
                  fontSize: '14px',
                  color: '#1a1a1a',
                },
                label: {
                  fontSize: '14px',
                  color: '#1a1a1a',
                  marginBottom: '4px',
                  fontWeight: '500',
                }
              },
              className: {
                container: 'space-y-4',
                button: 'hover:bg-[#5849c4] active:bg-[#4a3db3] transition-colors',
                input: 'focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]',
                label: 'font-medium',
                message: 'text-sm',
                divider: 'my-6',
              }
            }}
            providers={["google"]}
            redirectTo={`${window.location.origin}/`}
            view="sign_in"
          />

          <p className="text-center text-sm text-gray-900 mt-6">
            By continuing you agree to our{" "}
            <a href="#" className="text-[#6C5CE7] hover:underline">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
