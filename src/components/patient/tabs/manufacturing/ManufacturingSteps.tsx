import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { ManufacturingActionButtons } from "./buttons/ManufacturingActionButtons";
import { ManufacturingProcessButtons } from "./buttons/ManufacturingProcessButtons";

interface ManufacturingStepsProps {
  scriptId: string;
  manufacturingStatus: { [key: string]: string };
  sinteringStatus: { [key: string]: string };
  miyoStatus: { [key: string]: string };
  inspectionStatus: { [key: string]: string };
  currentManufacturingStatus: string | null;
  manufacturingType: string;
  onStartManufacturing: (scriptId: string) => void;
  onCompleteManufacturing: (scriptId: string) => void;
  onStartSintering: (scriptId: string) => void;
  onCompleteSintering: (scriptId: string) => void;
  onStartMiyo: (scriptId: string) => void;
  onCompleteMiyo: (scriptId: string) => void;
  onStartInspection: (scriptId: string) => void;
  onRejectInspection: (scriptId: string) => void;
  onApproveInspection: (scriptId: string) => void;
}

export const ManufacturingSteps = ({
  scriptId,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus,
  currentManufacturingStatus,
  manufacturingType,
  onStartManufacturing,
  onCompleteManufacturing,
  onStartSintering,
  onCompleteSintering,
  onStartMiyo,
  onCompleteMiyo,
  onStartInspection,
  onRejectInspection,
  onApproveInspection,
}: ManufacturingStepsProps) => {
  const [isHoldDialogOpen, setIsHoldDialogOpen] = useState(false);
  const [holdReason, setHoldReason] = useState("");
  const { toast } = useToast();

  const handleHoldManufacturing = async () => {
    try {
      if (!holdReason.trim()) {
        toast({
          title: "Error",
          description: "Please provide a reason for holding manufacturing.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('manufacturing_logs')
        .insert([{
          lab_script_id: scriptId,
          manufacturing_hold_status: true,
          manufacturing_hold_reason: holdReason,
          manufacturing_status: 'on_hold'
        }]);

      if (error) throw error;

      setIsHoldDialogOpen(false);
      setHoldReason("");
      
      toast({
        title: "Manufacturing On Hold",
        description: "Manufacturing process has been put on hold.",
      });
    } catch (error) {
      console.error("Error putting manufacturing on hold:", error);
      toast({
        title: "Error",
        description: "Failed to put manufacturing on hold.",
        variant: "destructive"
      });
    }
  };

  const handleResumeManufacturing = async () => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .insert([{
          lab_script_id: scriptId,
          manufacturing_hold_status: false,
          manufacturing_status: 'in_progress'
        }]);

      if (error) throw error;
      
      toast({
        title: "Manufacturing Resumed",
        description: "Manufacturing process has been resumed.",
      });
    } catch (error) {
      console.error("Error resuming manufacturing:", error);
      toast({
        title: "Error",
        description: "Failed to resume manufacturing.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <ManufacturingActionButtons
          scriptId={scriptId}
          manufacturingStatus={manufacturingStatus}
          currentManufacturingStatus={currentManufacturingStatus}
          manufacturingType={manufacturingType}
          onStartManufacturing={onStartManufacturing}
          onCompleteManufacturing={onCompleteManufacturing}
          onHoldManufacturing={() => setIsHoldDialogOpen(true)}
          onResumeManufacturing={handleResumeManufacturing}
        />

        {currentManufacturingStatus !== 'on_hold' && (
          <ManufacturingProcessButtons
            scriptId={scriptId}
            sinteringStatus={sinteringStatus}
            miyoStatus={miyoStatus}
            inspectionStatus={inspectionStatus}
            onStartSintering={onStartSintering}
            onCompleteSintering={onCompleteSintering}
            onStartMiyo={onStartMiyo}
            onCompleteMiyo={onCompleteMiyo}
            onStartInspection={onStartInspection}
            onRejectInspection={onRejectInspection}
            onApproveInspection={onApproveInspection}
          />
        )}
      </div>

      <AlertDialog open={isHoldDialogOpen} onOpenChange={setIsHoldDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hold Manufacturing</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for holding the manufacturing process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Textarea
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              placeholder="Enter reason for hold..."
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setHoldReason("");
              setIsHoldDialogOpen(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleHoldManufacturing}>
              Hold Manufacturing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};