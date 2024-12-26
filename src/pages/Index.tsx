import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatientList } from "@/components/patient/PatientList";
import { PatientSearch } from "@/components/patient/PatientSearch";
import { PageHeader } from "@/components/patient/PageHeader";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

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
    <div className="h-full flex flex-col animate-fade-in">
      <PageHeader />
      <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="h-full flex flex-col gap-6">
          <PatientSearch />
          <div className="flex-1 overflow-auto">
            <PatientList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;