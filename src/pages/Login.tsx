import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";

export default function Login() {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

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
            extend: true,
            className: {
              container: 'flex flex-col gap-4',
              label: 'text-sm font-medium text-gray-700',
              input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              button: 'w-full bg-primary text-white hover:bg-primary-600',
              anchor: 'text-primary hover:text-primary-600',
            },
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
            },
          }}
          showLinks={true}
          view="sign_in"
          additionalData={{
            rememberMe: true,
          }}
        />
      </CardContent>
    </Card>
  );
}