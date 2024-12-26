import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { LabScriptList } from "@/components/patient/LabScriptList";
import { LabScript } from "@/types/labScript";

interface ScriptListProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  labScripts: LabScript[];
  onRefetch: () => void;
  onScriptSelect: (script: LabScript) => void;
  onScriptEdit: (script: LabScript) => void;
  onScriptDelete: (script: LabScript) => void;
}

export const ScriptList = ({
  isLoading,
  isError,
  error,
  labScripts,
  onRefetch,
  onScriptSelect,
  onScriptEdit,
  onScriptDelete
}: ScriptListProps) => {
  if (isError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading lab scripts. Please check your connection and try again.
            {error instanceof Error ? ` Error: ${error.message}` : ''}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={onRefetch} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <ScrollArea className="h-[500px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <LabScriptList 
            labScripts={labScripts}
            onRowClick={onScriptSelect}
            onEditClick={onScriptEdit}
            onDeleteClick={onScriptDelete}
          />
        )}
      </ScrollArea>
    </div>
  );
};