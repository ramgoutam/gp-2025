import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportCard } from "@/components/patient/report-card/ReportCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "lucide-react";
import { mapDatabaseLabScript } from "@/types/labScript";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DesignInfoForm } from "@/components/patient/forms/DesignInfoForm";
import { ClinicalInfoForm } from "@/components/patient/forms/ClinicalInfoForm";
import { useToast } from "@/hooks/use-toast";

interface ReportCardListProps {
  filter?: string;
}

const ReportCardList = ({ filter }: ReportCardListProps) => {
  const { toast } = useToast();
  const [showDesignInfo, setShowDesignInfo] = useState(false);
  const [showClinicalInfo, setShowClinicalInfo] = useState(false);
  const [selectedScript, setSelectedScript] = useState<any>(null);

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
            query = query
              .eq('design_info_status', 'pending')
              .eq('lab_script.status', 'completed');
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
    refetchInterval: 1000, // Added real-time updates
  });

  const handleDesignInfo = (script: any) => {
    console.log("Opening design info for script:", script);
    if (script.status !== 'completed') {
      toast({
        title: "Lab Script Incomplete",
        description: "Please complete the lab script before adding design information.",
        variant: "destructive"
      });
      return;
    }
    
    // Transform the script data to match the expected format
    const transformedScript = {
      ...script,
      applianceType: script.appliance_type,
      upperTreatment: script.upper_treatment,
      lowerTreatment: script.lower_treatment,
      screwType: script.screw_type,
      designInfo: reports?.find(r => r.lab_script_id === script.id)?.design_info
    };
    
    setSelectedScript(transformedScript);
    setShowDesignInfo(true);
  };

  const handleClinicalInfo = (script: any) => {
    console.log("Opening clinical info for script:", script);
    if (script.status !== 'completed') {
      toast({
        title: "Lab Script Incomplete",
        description: "Please complete the lab script before adding clinical information.",
        variant: "destructive"
      });
      return;
    }
    setSelectedScript(script);
    setShowClinicalInfo(true);
  };

  const handleSaveDesignInfo = async (updatedScript: any) => {
    console.log("Saving design info:", updatedScript);
    setShowDesignInfo(false);
    toast({
      title: "Success",
      description: "Design information has been saved successfully.",
    });
  };

  const handleSaveClinicalInfo = async (updatedScript: any) => {
    console.log("Saving clinical info:", updatedScript);
    setShowClinicalInfo(false);
    toast({
      title: "Success",
      description: "Clinical information has been saved successfully.",
    });
  };

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
    <>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4 p-4">
          {reports.map((report) => (
            <div key={report.id}>
              {report.lab_script && (
                <ReportCard
                  script={mapDatabaseLabScript(report.lab_script)}
                  onDesignInfo={() => handleDesignInfo(report.lab_script)}
                  onClinicalInfo={() => handleClinicalInfo(report.lab_script)}
                  patientName={`${report.patient?.first_name} ${report.patient?.last_name}`}
                />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={showDesignInfo} onOpenChange={setShowDesignInfo}>
        <DialogContent className="max-w-[1200px] w-full">
          <DialogHeader>
            <DialogTitle>Design Information</DialogTitle>
            <DialogDescription>
              Design details for Lab Request #{selectedScript?.request_number}
            </DialogDescription>
          </DialogHeader>
          {selectedScript && (
            <DesignInfoForm
              onClose={() => setShowDesignInfo(false)}
              scriptId={selectedScript.id}
              script={selectedScript}
              onSave={handleSaveDesignInfo}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showClinicalInfo} onOpenChange={setShowClinicalInfo}>
        <DialogContent className="max-w-[1200px] w-full">
          <DialogHeader>
            <DialogTitle>Clinical Information</DialogTitle>
            <DialogDescription>
              Clinical details for Lab Request #{selectedScript?.request_number}
            </DialogDescription>
          </DialogHeader>
          {selectedScript && (
            <ClinicalInfoForm
              onClose={() => setShowClinicalInfo(false)}
              script={selectedScript}
              onSave={handleSaveClinicalInfo}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportCardList;