import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, ClipboardCheck, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  // Fetch recent lab scripts
  const { data: recentLabScripts = [] } = useQuery({
    queryKey: ['recentLabScripts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('lab_scripts')
        .select(`
          id,
          request_number,
          doctor_name,
          clinic_name,
          status,
          due_date,
          patients (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const chartData = [
    { month: 'Jan', patients: 4 },
    { month: 'Feb', patients: 6 },
    { month: 'Mar', patients: 8 },
    { month: 'Apr', patients: 12 },
    { month: 'May', patients: 15 },
    { month: 'Jun', patients: 18 },
  ];

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
        <Card>
          <CardHeader>
            <CardTitle>Patient Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="patients" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Lab Scripts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLabScripts.map((script: any) => (
                <div key={script.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{script.patients?.first_name} {script.patients?.last_name}</p>
                    <p className="text-sm text-gray-500">Dr. {script.doctor_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{new Date(script.due_date).toLocaleDateString()}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      script.status === 'completed' ? 'bg-green-100 text-green-800' :
                      script.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {script.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500 mr-4" />
                <div className="flex-1">
                  <p className="font-medium">Dr. Smith - Patient Consultation</p>
                  <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500 mr-4" />
                <div className="flex-1">
                  <p className="font-medium">Dr. Johnson - Follow-up</p>
                  <p className="text-sm text-gray-500">Friday at 2:30 PM</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Treatment Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Lab Scripts Completed</span>
                <span className="text-sm text-gray-500">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Report Cards Submitted</span>
                <span className="text-sm text-gray-500">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Patient Consultations</span>
                <span className="text-sm text-gray-500">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;