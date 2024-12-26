import React, { useEffect } from "react";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

type StatusCardProps = {
  title: string;
  count: number;
  Icon: React.ElementType;
  color: string;
};

const StatusCard = ({ title, count, Icon, color }: StatusCardProps) => (
  <Card className="p-6 hover:shadow-lg transition-all duration-300">
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
  const queryClient = useQueryClient();

  // Query for report cards with millisecond refresh
  const { data: reportCards = [] } = useQuery({
    queryKey: ['reportCards'],
    queryFn: async () => {
      console.log("Fetching report cards data");
      const { data, error } = await supabase
        .from('report_cards')
        .select(`
          *,
          design_info:design_info_id(*),
          clinical_info:clinical_info_id(*)
        `);

      if (error) {
        console.error("Error fetching report cards:", error);
        throw error;
      }

      console.log("Report cards data:", data);
      return data;
    },
    refetchInterval: 1, // Refetch every millisecond
  });

  // Set up real-time subscription for report card updates
  useEffect(() => {
    console.log("Setting up real-time subscription for report cards");
    const channel = supabase
      .channel('report-cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'report_cards'
        },
        (payload) => {
          console.log("Report card change detected:", payload);
          queryClient.invalidateQueries({ queryKey: ['reportCards'] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up report cards subscription");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const reportCardCounts = {
    pendingDesign: reportCards?.filter(card => card.design_info_status === 'pending').length || 0,
    pendingClinical: reportCards?.filter(card => card.clinical_info_status === 'pending').length || 0,
    incomplete: reportCards?.filter(card => 
      card.design_info_status === 'pending' && card.clinical_info_status === 'pending'
    ).length || 0,
    completed: reportCards?.filter(card => card.status === 'completed').length || 0,
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Cards</h1>
          <p className="text-gray-500 mt-2">
            Monitor and manage report cards status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Pending Design Info"
          count={reportCardCounts.pendingDesign}
          color="bg-yellow-500"
          Icon={FileText}
        />
        <StatusCard
          title="Pending Clinical Info"
          count={reportCardCounts.pendingClinical}
          color="bg-blue-500"
          Icon={FileText}
        />
        <StatusCard
          title="Incomplete"
          count={reportCardCounts.incomplete}
          color="bg-red-500"
          Icon={AlertCircle}
        />
        <StatusCard
          title="Completed"
          count={reportCardCounts.completed}
          color="bg-green-500"
          Icon={CheckCircle}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ScrollArea className="h-[500px]">
          <div className="text-gray-600">
            Report card list will be implemented here
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default ReportCard;