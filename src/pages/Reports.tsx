import { Navigation } from "@/components/Navigation";
import { ReportCardsList } from "@/components/reports/ReportCardsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const Reports = () => {
  const { data: reportCards, isLoading } = useQuery({
    queryKey: ['reportCards'],
    queryFn: async () => {
      console.log("Fetching report cards");
      const { data, error } = await supabase
        .from('report_cards')
        .select(`
          *,
          lab_script:lab_scripts(*),
          design_info:design_info_id(*),
          clinical_info:clinical_info_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching report cards:", error);
        throw error;
      }

      console.log("Retrieved report cards:", data);
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Report Cards</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 pr-4">
            <ReportCardsList reportCards={reportCards || []} isLoading={isLoading} />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default Reports;