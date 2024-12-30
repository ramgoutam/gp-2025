import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, FileText, ClipboardCheck, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardAppointments } from "@/components/dashboard/DashboardAppointments";

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
    </div>
  );
};

export default Dashboard;
