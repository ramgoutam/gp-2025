import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatientList } from "@/components/patient/PatientList";
import { PatientSearch } from "@/components/patient/PatientSearch";
import { PageHeader } from "@/components/patient/PageHeader";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader />
        <PatientSearch />
        <PatientList />
      </div>
    </div>
  );
};

export default Index;