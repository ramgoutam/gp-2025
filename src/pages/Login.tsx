import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Initial session check:", session ? "Session found" : "No session");
      
      if (error) {
        console.error("Error checking session:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check authentication status",
        });
        return;
      }
      
      if (session) {
        console.log("Active session found, redirecting to dashboard");
        navigate("/");
      }
    };
    
    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth state changed - Event:", event);
        console.log("Auth state changed - Session:", session ? "Present" : "None");
        
        if (event === "SIGNED_IN" && session) {
          console.log("Sign in successful, redirecting to dashboard");
          navigate("/");
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          navigate("/login");
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
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Auth Form */}
      <div className="w-full lg:w-[45%] h-screen flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
                NYDI
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Please sign in to continue.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    borderRadius: '8px',
                    backgroundColor: '#4F6BFF',
                    color: 'white',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    width: '100%',
                    marginTop: '24px',
                  },
                  input: {
                    borderRadius: '8px',
                    backgroundColor: '#F8FAFC',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '1px solid #E2E8F0',
                    width: '100%',
                  },
                  label: {
                    fontSize: '14px',
                    color: '#475569',
                    marginBottom: '6px',
                    display: 'block',
                  },
                  container: {
                    gap: '20px',
                  },
                  message: {
                    fontSize: '14px',
                    color: '#EF4444',
                    marginTop: '6px',
                  },
                  anchor: {
                    color: '#4F6BFF',
                    fontSize: '14px',
                    textDecoration: 'none',
                  },
                },
                className: {
                  container: 'space-y-6',
                  button: 'hover:bg-primary-600 transition-colors duration-200',
                  input: 'hover:border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200',
                  label: 'font-medium',
                },
              }}
              providers={["google"]}
              redirectTo={`${window.location.origin}/auth/callback`}
              theme="custom"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-[55%] h-screen relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/lovable-uploads/dental-workflow.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-primary-700/30 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-xl p-8 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">
              Streamline Your Dental Practice
            </h2>
            <p className="text-lg opacity-90">
              Manage your patients, appointments, and workflows efficiently with NYDI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;