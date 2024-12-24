import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthChangeEvent } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        console.log("Auth state changed:", event, session);
        switch (event) {
          case "SIGNED_IN":
            if (session) {
              navigate("/");
            }
            break;
          case "SIGNED_OUT":
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