import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportCardList } from "@/components/reports/ReportCardList";
import { PageHeader } from "@/components/reports/PageHeader";
import { ReportCardData } from "@/types/reportCard";

export default function Reports() {
  const { data: reportCards, isLoading } = useQuery({
    queryKey: ['reportCards'],
    queryFn: async () => {
      console.log("Fetching report cards");
      const { data, error } = await supabase
        .from('report_cards')
        .select(`
          *,
          design_info:design_info_id(*),
          clinical_info:clinical_info_id(*),
          lab_script:lab_script_id(*)
        `);

      if (error) {
        console.error("Error fetching report cards:", error);
        throw error;
      }

      console.log("Fetched report cards:", data);
      return data as ReportCardData[];
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader />
      <ReportCardList reportCards={reportCards} isLoading={isLoading} />
    </div>
  );
}