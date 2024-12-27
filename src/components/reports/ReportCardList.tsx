import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportCard } from "@/components/patient/report-card/ReportCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "lucide-react";
import { mapDatabaseLabScript } from "@/types/labScript";

interface ReportCardListProps {
  filter?: string;
}

const ReportCardList = ({ filter }: ReportCardListProps) => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', filter],
    queryFn: async () => {
      console.log("Fetching reports with filter:", filter);
      let query = supabase
        .from('report_cards')
        .select(`
          *,
          lab_script:lab_scripts(
            *
          ),
          patient:patients(
            first_name,
            last_name
          ),
          design_info:design_info_id(*),
          clinical_info:clinical_info_id(*)
        `);

      if (filter) {
        switch (filter) {
          case 'design_pending':
            query = query.eq('design_info_status', 'pending');
            break;
          case 'design_completed':
            query = query.eq('design_info_status', 'completed');
            break;
          case 'clinical_pending':
            query = query.eq('clinical_info_status', 'pending');
            break;
          case 'clinical_completed':
            query = query.eq('clinical_info_status', 'completed');
            break;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reports:", error);
        throw error;
      }

      console.log("Fetched reports:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!reports?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>No reports found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-4 p-4">
        {reports.map((report) => (
          <div key={report.id}>
            {report.lab_script && (
              <ReportCard
                script={mapDatabaseLabScript(report.lab_script)}
                onDesignInfo={() => {}}
                onClinicalInfo={() => {}}
                patientName={`${report.patient?.first_name} ${report.patient?.last_name}`}
              />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ReportCardList;