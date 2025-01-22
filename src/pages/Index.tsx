import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatientList } from "@/components/patient/PatientList";
import { PageHeader } from "@/components/patient/PageHeader";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageHeader />
        <PatientList />
      </div>
    </div>
  );
};

export default Index;