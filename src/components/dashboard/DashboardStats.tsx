import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, ClipboardCheck, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
const DashboardCard = ({
  title,
  value,
  icon: Icon,
  link,
  color
}: {
  title: string;
  value: number;
  icon: any;
  link: string;
  color: string;
}) => <Link to={link}>
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl py-[18px] px-[37px] mx-0 my-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-bold">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  </Link>;
export const DashboardStats = () => {
  const {
    data: patientCount = 0
  } = useQuery({
    queryKey: ['patientCount'],
    queryFn: async () => {
      console.log('Fetching patient count');
      const {
        count
      } = await supabase.from('patients').select('*', {
        count: 'exact',
        head: true
      });
      return count || 0;
    },
    refetchInterval: 1 // Refetch every millisecond
  });
  const {
    data: labScriptCount = 0
  } = useQuery({
    queryKey: ['labScriptCount'],
    queryFn: async () => {
      console.log('Fetching lab script count');
      const {
        count
      } = await supabase.from('lab_scripts').select('*', {
        count: 'exact',
        head: true
      });
      return count || 0;
    },
    refetchInterval: 1 // Refetch every millisecond
  });
  const {
    data: reportCardCount = 0
  } = useQuery({
    queryKey: ['reportCardCount'],
    queryFn: async () => {
      console.log('Fetching report card count');
      const {
        count
      } = await supabase.from('report_cards').select('*', {
        count: 'exact',
        head: true
      });
      return count || 0;
    },
    refetchInterval: 1 // Refetch every millisecond
  });
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Total Patients" value={patientCount} icon={Users} link="/patients" color="bg-blue-500" />
      <DashboardCard title="Lab Scripts" value={labScriptCount} icon={FileText} link="/scripts" color="bg-green-500" />
      <DashboardCard title="Report Cards" value={reportCardCount} icon={ClipboardCheck} link="/reports" color="bg-purple-500" />
      <DashboardCard title="Calendar" value={0} icon={Calendar} link="/calendar" color="bg-orange-500" />
    </div>;
};