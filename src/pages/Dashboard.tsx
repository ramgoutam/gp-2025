import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  console.log("Rendering Dashboard component");

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

  // Set up real-time subscription for dashboard updates
  useEffect(() => {
    console.log('Setting up real-time subscription for dashboard');
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('Received dashboard update:', payload);
          // Invalidate and refetch all relevant queries
          queryClient.invalidateQueries({ queryKey: ['patientCount'] });
          queryClient.invalidateQueries({ queryKey: ['labScriptCount'] });
          queryClient.invalidateQueries({ queryKey: ['reportCardCount'] });
          queryClient.invalidateQueries({ queryKey: ['recentLabScripts'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up dashboard subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <DashboardStats />
      <DashboardCharts />
    </div>
  );
};

export default Dashboard;