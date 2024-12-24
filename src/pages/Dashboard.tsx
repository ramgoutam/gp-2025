import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, ClipboardCheck, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  console.log("Rendering Dashboard component");

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

  // Fetch statistics
  const { data: patientCount = 0 } = useQuery({
    queryKey: ['patientCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: labScriptCount = 0 } = useQuery({
    queryKey: ['labScriptCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('lab_scripts')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: reportCardCount = 0 } = useQuery({
    queryKey: ['reportCardCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('report_cards')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const DashboardCard = ({ title, value, icon: Icon, link, color }: {
    title: string;
    value: number;
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your NYDI dashboard</p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-500">Coming soon...</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <p className="text-gray-500">Coming soon...</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;