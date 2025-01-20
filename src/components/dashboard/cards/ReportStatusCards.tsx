import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { StatusCard } from "@/components/scripts/StatusCard";

export const ReportStatusCards = () => {
  const { data: reportCounts = {
    designPending: 0,
    designCompleted: 0,
    clinicalPending: 0,
    clinicalCompleted: 0,
    total: 0
  } } = useQuery({
    queryKey: ['reportStatusCounts'],
    queryFn: async () => {
      console.log('Fetching report status counts for dashboard');
      
      const { data: reports, error } = await supabase
        .from('report_cards')
        .select(`
          design_info_status,
          clinical_info_status,
          lab_scripts!inner (
            status
          )
        `);

      if (error) {
        console.error("Error fetching report counts:", error);
        throw error;
      }

      const designPending = reports.filter(r => 
        r.design_info_status === 'pending' && 
        r.lab_scripts?.status === 'completed'
      ).length;
      
      const designCompleted = reports.filter(r => r.design_info_status === 'completed').length;
      const clinicalPending = reports.filter(r => r.clinical_info_status === 'pending').length;
      const clinicalCompleted = reports.filter(r => r.clinical_info_status === 'completed').length;

      return {
        designPending,
        designCompleted,
        clinicalPending,
        clinicalCompleted,
        total: reports.length
      };
    },
    refetchInterval: 1000
  });

  const reportCards = [
    {
      title: "Design Info Pending",
      count: reportCounts.designPending,
      icon: Clock,
      color: "bg-amber-50",
      iconColor: "text-amber-500",
      progressColor: "bg-gradient-to-r from-amber-400 to-amber-500"
    },
    {
      title: "Design Info Completed",
      count: reportCounts.designCompleted,
      icon: CheckCircle2,
      color: "bg-green-50",
      iconColor: "text-green-500",
      progressColor: "bg-gradient-to-r from-green-400 to-green-500"
    },
    {
      title: "Clinical Info Pending",
      count: reportCounts.clinicalPending,
      icon: AlertTriangle,
      color: "bg-orange-50",
      iconColor: "text-orange-500",
      progressColor: "bg-gradient-to-r from-orange-400 to-orange-500"
    },
    {
      title: "Clinical Info Completed",
      count: reportCounts.clinicalCompleted,
      icon: FileText,
      color: "bg-blue-50",
      iconColor: "text-blue-500",
      progressColor: "bg-gradient-to-r from-blue-400 to-blue-500"
    }
  ];

  return (
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4 text-left">Report Cards</h2>
      <div className="grid grid-cols-4 gap-4 animate-fade-in">
        {reportCards.map((card, index) => (
          <div
            key={card.title}
            className="animate-fade-in"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <StatusCard
              title={card.title}
              count={card.count}
              icon={card.icon}
              color={card.color}
              iconColor={card.iconColor}
              progressColor={card.progressColor}
              onClick={() => {}}
              isActive={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};