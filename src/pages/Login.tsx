import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { X } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      if (session) {
        console.log("User already logged in, redirecting to dashboard");
        navigate("/");
      }
    };
    
    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        console.log("Auth state changed:", event, session);
        switch (event) {
          case "SIGNED_IN":
            if (session) {
              console.log("User signed in, redirecting to dashboard");
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
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Auth Form */}
      <div className="w-full lg:w-[45%] h-screen flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DentFlow</h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Please sign in to continue.
              </p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
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
              Manage your patients, appointments, and workflows efficiently with DentFlow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;