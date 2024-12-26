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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-[1100px] h-[600px] mx-4 bg-white rounded-3xl shadow-xl overflow-hidden flex">
        {/* Left side - Form */}
        <div className="w-full md:w-[45%] p-8 md:p-12">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Crextio</h1>
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Create an account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign up and get 30 day free trial
              </p>
            </div>

            <div className="bg-white rounded-lg">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  style: {
                    button: {
                      borderRadius: '9999px',
                      backgroundColor: '#4F6BFF',
                      color: 'white',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: '500',
                    },
                    input: {
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      padding: '12px 16px',
                      fontSize: '14px',
                      border: '1px solid #E2E8F0',
                    },
                    label: {
                      fontSize: '14px',
                      color: '#475569',
                      marginBottom: '4px',
                    },
                    container: {
                      gap: '16px',
                    },
                    message: {
                      fontSize: '14px',
                      color: '#EF4444',
                      marginTop: '4px',
                    },
                    anchor: {
                      color: '#4F6BFF',
                      fontSize: '14px',
                      textDecoration: 'none',
                    },
                  },
                  className: {
                    container: 'space-y-4',
                    button: 'w-full',
                    input: 'w-full',
                    label: 'block font-medium',
                  },
                }}
                providers={["google"]}
                redirectTo={`${window.location.origin}/auth/callback`}
                theme="custom"
              />
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-[55%] relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/lovable-uploads/9f88b5b7-26b7-4759-a326-7982825426c7.png')",
            }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </div>
  );
};

export default Login;