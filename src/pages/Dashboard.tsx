import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    toast
  } = useToast();
  console.log("Rendering Dashboard component");

  // Fetch user details including role and name
  const {
    data: userDetails,
    isLoading: isUserLoading
  } = useQuery({
    queryKey: ['userDetails'],
    queryFn: async () => {
      console.log('Fetching user details');
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;
      const {
        data,
        error
      } = await supabase.from('user_roles').select('*').eq('user_id', session.user.id).single();
      if (error) {
        console.error('Error fetching user details:', error);
        return null;
      }
      return data;
    }
  });

  // Show welcome toast when user details are loaded
  useEffect(() => {
    if (userDetails) {
      const prefix = userDetails.role === 'DOCTOR' ? 'Dr.' : '';
      const fullName = `${prefix} ${userDetails.first_name || ''} ${userDetails.last_name || ''}`.trim();
      if (fullName !== '') {
        toast({
          title: `Welcome back, ${fullName}!`,
          description: "You're now logged into your account."
        });
      }
    }
  }, [userDetails, toast]);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Set up real-time subscription for dashboard updates
  useEffect(() => {
    console.log('Setting up real-time subscription for dashboard');
    const channel = supabase.channel('dashboard-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'patients'
    }, payload => {
      console.log('Received dashboard update:', payload);
      queryClient.invalidateQueries({
        queryKey: ['patientCount']
      });
      queryClient.invalidateQueries({
        queryKey: ['labScriptCount']
      });
      queryClient.invalidateQueries({
        queryKey: ['reportCardCount']
      });
      queryClient.invalidateQueries({
        queryKey: ['recentLabScripts']
      });
    }).subscribe();
    return () => {
      console.log('Cleaning up dashboard subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  if (isUserLoading) {
    return <div className="space-y-6">
        <Skeleton className="h-[72px] w-full bg-gray-200" />
        <Skeleton className="h-[200px] w-full bg-gray-200" />
        <Skeleton className="h-[400px] w-full bg-gray-200" />
      </div>;
  }
  return <div className="space-y-6">
      {userDetails && <div className="p-4 shadow-sm bg-indigo-200 hover:bg-indigo-100 my-[21px] mx-0 px-[17px] py-[12px] rounded-xl">
          <h1 className="text-2xl text-gray-900 font-bold px-[6px]">
            Welcome{' '}
            {userDetails.role === 'DOCTOR' ? 'Dr.' : ''}{' '}
            {`${userDetails.first_name || ''} ${userDetails.last_name || ''}`}
          </h1>
        </div>}
      <DashboardStats />
      <DashboardCharts />
    </div>;
};
export default Dashboard;