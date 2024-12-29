import { LabScript } from "@/types/labScript";
import { FileList } from "../../lab-script/FileList";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { HeaderSection } from "./HeaderSection";
import { TreatmentsSection } from "./TreatmentsSection";
import { ManufacturingSection } from "./sections/ManufacturingSection";
import { ApplianceSection } from "./sections/ApplianceSection";
import { ApplianceNumberSection } from "./sections/ApplianceNumberSection";

interface LabScriptContentProps {
  script: LabScript;
  handlePreview: (file: File) => void;
}

export const LabScriptContent = ({ script, handlePreview }: LabScriptContentProps) => {
  const getStatusBadge = (status: LabScript["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };

    return (
      <Badge variant="secondary" className={styles[status]}>
        {status?.replace("_", " ") || "pending"}
      </Badge>
    );
  };

  // Convert single files to arrays if needed
  const normalizedFileUploads = script.fileUploads ? 
    Object.entries(script.fileUploads).reduce((acc, [key, value]) => {
      acc[key] = Array.isArray(value) ? value : [value];
      return acc;
    }, {} as Record<string, File[]>) : 
    {};

  return (
    <div className="space-y-6 p-6">
      <HeaderSection script={script} />
      
      <Separator />
      
      <ApplianceSection script={script} />
      
      <Separator />
      
      <ApplianceNumberSection script={script} />
      
      <Separator />
      
      <TreatmentsSection script={script} />
      
      <Separator />
      
      <ManufacturingSection script={script} />

      {script.vdoOption && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-500">VDO Option</h4>
            <p className="text-lg">{script.vdoOption}</p>
          </div>
        </>
      )}

      {script.screwType && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-500">Screw Type</h4>
            <p className="text-lg">{script.screwType}</p>
          </div>
        </>
      )}

      {script.fileUploads && Object.keys(script.fileUploads).length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-500">Uploaded Files</h4>
            <FileList 
              fileUploads={normalizedFileUploads}
              onPreview={handlePreview}
            />
          </div>
        </>
      )}

      {script.specificInstructions && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-500">Specific Instructions</h4>
            <p className="whitespace-pre-wrap">{script.specificInstructions}</p>
          </div>
        </>
      )}

      <Separator />

      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-500">Status</h4>
        {getStatusBadge(script.status || "pending")}
      </div>
    </div>
  );
};