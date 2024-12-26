import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatusCardProps {
  title: string;
  count: number;
  color: string;
  Icon: any;
  onClick?: () => void;
}

const StatusCard = ({ title, count, color, Icon, onClick }: StatusCardProps) => (
  <Card
    className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
      onClick ? 'hover:scale-[1.02]' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${color} bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
          {count}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className={`h-1.5 rounded-full ${color} bg-opacity-15 w-full`}>
          <div 
            className={`h-1.5 rounded-full ${color} transition-all duration-500`} 
            style={{ width: `${(count / (count || 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  </Card>
);

const ReportCard = () => {
  const { data: reportCards, isLoading } = useQuery({
    queryKey: ['reportCards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_cards')
        .select('*');
      
      if (error) {
        console.error("Error fetching report cards:", error);
        throw error;
      }
      
      return data || [];
    }
  });

  const reportCardCounts = {
    pending: reportCards?.filter(card => card.status === 'pending').length || 0,
    inProgress: reportCards?.filter(card => card.status === 'in_progress').length || 0,
    completed: reportCards?.filter(card => card.status === 'completed').length || 0,
    paused: reportCards?.filter(card => card.status === 'paused').length || 0,
    hold: reportCards?.filter(card => card.status === 'hold').length || 0,
    incomplete: reportCards?.filter(card => 
      !card.design_info_id || !card.clinical_info_id
    ).length || 0,
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Report Cards</h1>
        </div>
        <p className="text-gray-500">
          Manage and track all report cards and their current status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <StatusCard
          title="Pending"
          count={reportCardCounts.pending}
          color="bg-yellow-500"
          Icon={FileText}
        />
        <StatusCard
          title="In Progress"
          count={reportCardCounts.inProgress}
          color="bg-blue-500"
          Icon={FileText}
        />
        <StatusCard
          title="Completed"
          count={reportCardCounts.completed}
          color="bg-green-500"
          Icon={FileText}
        />
        <StatusCard
          title="Paused"
          count={reportCardCounts.paused}
          color="bg-orange-500"
          Icon={FileText}
        />
        <StatusCard
          title="On Hold"
          count={reportCardCounts.hold}
          color="bg-red-500"
          Icon={FileText}
        />
        <StatusCard
          title="Incomplete"
          count={reportCardCounts.incomplete}
          color="bg-gray-500"
          Icon={FileText}
        />
      </div>

      {/* Table section will be added in future iterations */}
      <Card className="p-6">
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No report cards to display</h3>
          <p className="text-sm text-gray-500">Report cards will appear here once they are created</p>
        </div>
      </Card>
    </div>
  );
};

export default ReportCard;