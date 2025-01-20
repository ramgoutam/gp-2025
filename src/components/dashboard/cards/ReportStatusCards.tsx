import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle2, Files, AlertTriangle, ClipboardCheck } from "lucide-react";
import { StatusCard } from "@/components/scripts/StatusCard";

type ReportStatusCardsProps = {
  onFilterChange: (status: string | null) => void;
  activeFilter: string | null;
};

export const ReportStatusCards = ({ onFilterChange, activeFilter }: ReportStatusCardsProps) => {
  const { data: reportCounts = { 
    designPending: 0,
    designCompleted: 0,
    clinicalPending: 0,
    clinicalCompleted: 0,
    total: 0 
  } } = useQuery({
    queryKey: ['reportStatusCounts'],
    queryFn: async () => {
      console.log('Fetching report status counts');
      
      const { data: reports, error } = await supabase
        .from('report_cards')
        .select(`
          design_info_status,
          clinical_info_status,
          lab_script:lab_scripts(
            status
          )
        `);

      if (error) {
        console.error("Error fetching report counts:", error);
        throw error;
      }

      const designPending = reports.filter(r => 
        r.design_info_status === 'pending' && 
        r.lab_script?.status === 'completed'
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

  const handleCardClick = (status: string | null) => {
    onFilterChange(activeFilter === status ? null : status);
  };

  const cards = [
    {
      title: "Design Info Pending",
      count: reportCounts.designPending,
      icon: Clock,
      color: "bg-amber-50",
      iconColor: "text-amber-500",
      progressColor: "bg-gradient-to-r from-amber-400 to-amber-500",
      status: 'design_pending'
    },
    {
      title: "Design Info Completed",
      count: reportCounts.designCompleted,
      icon: CheckCircle2,
      color: "bg-green-50",
      iconColor: "text-green-500",
      progressColor: "bg-gradient-to-r from-green-400 to-green-500",
      status: 'design_completed'
    },
    {
      title: "Clinical Info Pending",
      count: reportCounts.clinicalPending,
      icon: AlertTriangle,
      color: "bg-orange-50",
      iconColor: "text-orange-500",
      progressColor: "bg-gradient-to-r from-orange-400 to-orange-500",
      status: 'clinical_pending'
    },
    {
      title: "Clinical Info Completed",
      count: reportCounts.clinicalCompleted,
      icon: ClipboardCheck,
      color: "bg-teal-50",
      iconColor: "text-teal-500",
      progressColor: "bg-gradient-to-r from-teal-400 to-teal-500",
      status: 'clinical_completed'
    },
    {
      title: "All Reports",
      count: reportCounts.total,
      icon: Files,
      color: "bg-purple-50",
      iconColor: "text-purple-500",
      progressColor: "bg-gradient-to-r from-purple-400 to-purple-500",
      status: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 animate-fade-in">
      {cards.map((card, index) => (
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
            onClick={() => handleCardClick(card.status)}
            isActive={activeFilter === card.status}
          />
        </div>
      ))}
    </div>
  );
};