import { ReportStatusCards } from "./cards/ReportStatusCards";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export const DashboardCharts = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { data: chartData } = useQuery({
    queryKey: ['dashboardCharts'],
    queryFn: async () => {
      const { data: reports, error } = await supabase
        .from('report_cards')
        .select('created_at, design_info_status, clinical_info_status')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const monthlyData = reports.reduce((acc: any, report) => {
        const month = new Date(report.created_at).toLocaleString('default', { month: 'short' });
        
        if (!acc[month]) {
          acc[month] = {
            total: 0,
            completed: 0,
            pending: 0
          };
        }

        acc[month].total++;
        
        if (report.design_info_status === 'completed' && report.clinical_info_status === 'completed') {
          acc[month].completed++;
        } else {
          acc[month].pending++;
        }

        return acc;
      }, {});

      const labels = Object.keys(monthlyData);
      const totalReports = labels.map(month => monthlyData[month].total);
      const completedReports = labels.map(month => monthlyData[month].completed);
      const pendingReports = labels.map(month => monthlyData[month].pending);

      return {
        labels,
        totalReports,
        completedReports,
        pendingReports
      };
    }
  });

  const barChartData = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Total Reports',
        data: chartData?.totalReports || [],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Completed Reports',
        data: chartData?.completedReports || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Pending Reports',
        data: chartData?.pendingReports || [],
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <ReportStatusCards 
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Report Volume</h3>
          <Bar 
            data={barChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }} 
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Report Status Trends</h3>
          <Line 
            data={lineChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </Card>
      </div>
    </div>
  );
};