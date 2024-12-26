import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatientList } from "@/components/patient/PatientList";
import { PatientSearch } from "@/components/patient/PatientSearch";
import { PageHeader } from "@/components/patient/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Loader } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session);
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-primary animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full flex">
        {/* Left Panel - Auth Form */}
        <div className="w-full lg:w-[45%] h-screen flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
                NYDI
              </h1>
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
              theme="custom"
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
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader />
        <PatientSearch />
        <PatientList />
      </div>
    </div>
  );
};

export default Index;