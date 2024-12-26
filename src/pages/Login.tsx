import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Existing session found, redirecting to dashboard');
          navigate('/');
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          title: "Authentication Error",
          description: "Unable to check current session",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in, redirecting to dashboard');
          navigate('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full lg:w-[45%] h-screen flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">NYDI</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back! Please sign in to continue.
            </p>
          </div>

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
          />
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