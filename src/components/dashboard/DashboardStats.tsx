import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, ClipboardCheck, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const DashboardCard = ({ title, value, icon: Icon, link, color }: {
  title: string;
  value: number | string;
  icon: any;
  link: string;
  color: string;
}) => (
  <Link to={link}>
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  </Link>
);

export const DashboardStats = () => {
  const { toast } = useToast();

  const { data: patientCount = 0, isLoading: isLoadingPatients, error: patientError } = useQuery({
    queryKey: ['patientCount'],
    queryFn: async () => {
      console.log('Fetching patient count');
      const { count, error } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching patient count:', error);
        throw error;
      }
      return count || 0;
    },
    retry: 3,
    meta: {
      onError: (error: Error) => {
        console.error('Error in patient count query:', error);
        toast({
          title: "Error",
          description: "Failed to load patient count",
          variant: "destructive",
        });
      }
    }
  });

  const { data: labScriptCount = 0, isLoading: isLoadingScripts } = useQuery({
    queryKey: ['labScriptCount'],
    queryFn: async () => {
      console.log('Fetching lab script count');
      const { count, error } = await supabase
        .from('lab_scripts')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching lab script count:', error);
        throw error;
      }
      return count || 0;
    },
    retry: 3,
    meta: {
      onError: (error: Error) => {
        console.error('Error in lab script count query:', error);
        toast({
          title: "Error",
          description: "Failed to load lab script count",
          variant: "destructive",
        });
      }
    }
  });

  const { data: reportCardCount = 0, isLoading: isLoadingReports } = useQuery({
    queryKey: ['reportCardCount'],
    queryFn: async () => {
      console.log('Fetching report card count');
      const { count, error } = await supabase
        .from('report_cards')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching report card count:', error);
        throw error;
      }
      return count || 0;
    },
    retry: 3,
    meta: {
      onError: (error: Error) => {
        console.error('Error in report card count query:', error);
        toast({
          title: "Error",
          description: "Failed to load report card count",
          variant: "destructive",
        });
      }
    }
  });

  // Show loading state
  if (isLoadingPatients || isLoadingScripts || isLoadingReports) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Total Patients"
        value={patientCount}
        icon={Users}
        link="/patients"
        color="bg-blue-500"
      />
      <DashboardCard
        title="Lab Scripts"
        value={labScriptCount}
        icon={FileText}
        link="/scripts"
        color="bg-green-500"
      />
      <DashboardCard
        title="Report Cards"
        value={reportCardCount}
        icon={ClipboardCheck}
        link="/reports"
        color="bg-purple-500"
      />
      <DashboardCard
        title="Calendar"
        value={0}
        icon={Calendar}
        link="/calendar"
        color="bg-orange-500"
      />
    </div>
  );
};