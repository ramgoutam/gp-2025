import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Jan', patients: 4 },
  { month: 'Feb', patients: 6 },
  { month: 'Mar', patients: 8 },
  { month: 'Apr', patients: 12 },
  { month: 'May', patients: 15 },
  { month: 'Jun', patients: 18 },
];

export const DashboardCharts = () => {
  return (
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
  );
};