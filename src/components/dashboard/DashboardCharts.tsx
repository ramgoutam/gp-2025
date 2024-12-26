import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = {
  pending: '#F97316',    // Orange
  in_progress: '#0EA5E9', // Blue
  completed: '#22C55E',   // Green
  paused: '#8B5CF6',     // Purple
  hold: '#EF4444'        // Red
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const DashboardCharts = () => {
  const { data: scriptCounts = { 
    pending: 0, 
    in_progress: 0, 
    completed: 0, 
    paused: 0,
    hold: 0
  } } = useQuery({
    queryKey: ['scriptStatusCounts'],
    queryFn: async () => {
      console.log('Fetching script status counts for charts');
      
      const { data: scripts, error } = await supabase
        .from('lab_scripts')
        .select('status');

      if (error) {
        console.error("Error fetching script counts:", error);
        throw error;
      }

      return {
        pending: scripts.filter(s => s.status === 'pending').length,
        in_progress: scripts.filter(s => s.status === 'in_progress').length,
        completed: scripts.filter(s => s.status === 'completed').length,
        paused: scripts.filter(s => s.status === 'paused').length,
        hold: scripts.filter(s => s.status === 'hold').length
      };
    },
    refetchInterval: 1000
  });

  const pieData = Object.entries(scriptCounts).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').toUpperCase(),
    value
  }));

  const barData = Object.entries(scriptCounts).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').toUpperCase(),
    scripts: value
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <Card className="col-span-1 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Script Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[entry.name.toLowerCase().replace(' ', '_') as keyof typeof COLORS]}
                      className="hover:opacity-80 transition-opacity duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Script Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="name"
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#666' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="scripts"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[entry.name.toLowerCase().replace(' ', '_') as keyof typeof COLORS]}
                      className="hover:opacity-80 transition-opacity duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};