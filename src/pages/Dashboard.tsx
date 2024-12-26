import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardAppointments } from "@/components/dashboard/DashboardAppointments";
import { DashboardProgress } from "@/components/dashboard/DashboardProgress";

const Dashboard = () => {
  const navigate = useNavigate();
  console.log("Rendering Dashboard component");

  // Check authentication
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your NYDI dashboard</p>
        </div>
      </div>

      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts />
        <DashboardAppointments />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardProgress />
      </div>
    </div>
  );
};

export default Dashboard;