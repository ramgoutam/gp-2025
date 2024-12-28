import React, { useState } from "react";
import { Search, ThumbsDown, ThumbsUp, CheckCircle, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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

interface ManufacturingStepsProps {
  scriptId: string;
  manufacturingStatus: { [key: string]: string };
  sinteringStatus: { [key: string]: string };
  miyoStatus: { [key: string]: string };
  inspectionStatus: { [key: string]: string };
  onStartManufacturing: (scriptId: string) => void;
  onCompleteManufacturing: (scriptId: string) => void;
  onStartSintering: (scriptId: string) => void;
  onCompleteSintering: (scriptId: string) => void;
  onStartMiyo: (scriptId: string) => void;
  onCompleteMiyo: (scriptId: string) => void;
  onStartInspection: (scriptId: string) => void;
  onRejectInspection: (scriptId: string) => void;
  onApproveInspection: (scriptId: string) => void;
  manufacturingType?: string;
}

export const ManufacturingSteps = ({
  scriptId,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus,
  onStartManufacturing,
  onCompleteManufacturing,
  onStartSintering,
  onCompleteSintering,
  onStartMiyo,
  onCompleteMiyo,
  onStartInspection,
  onRejectInspection,
  onApproveInspection,
  manufacturingType = 'Milling',
}: ManufacturingStepsProps) => {
  const [isHoldDialogOpen, setIsHoldDialogOpen] = useState(false);
  const [holdReason, setHoldReason] = useState("");
  const { toast } = useToast();
  const [currentManufacturingStatus, setCurrentManufacturingStatus] = useState<string | null>(null);

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
      setCurrentManufacturingStatus('on_hold');
      
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

      setCurrentManufacturingStatus('in_progress');
      
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

        {sinteringStatus[scriptId] === 'in_progress' && (
          <Button 
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transform hover:scale-105 transition-all duration-300 group"
            onClick={() => onCompleteSintering(scriptId)}
          >
            <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
            Complete Sintering
          </Button>
        )}
        {sinteringStatus[scriptId] === 'completed' && !miyoStatus[scriptId] && (
          <Button 
            variant="outline"
            className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 group"
            onClick={() => onStartMiyo(scriptId)}
          >
            <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
            Start Miyo
          </Button>
        )}
        {miyoStatus[scriptId] === 'in_progress' && (
          <Button 
            variant="outline"
            className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 group"
            onClick={() => onCompleteMiyo(scriptId)}
          >
            <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
            Complete Miyo
          </Button>
        )}
        {miyoStatus[scriptId] === 'completed' && !inspectionStatus[scriptId] && (
          <Button 
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transform hover:scale-105 transition-all duration-300 group"
            onClick={() => onStartInspection(scriptId)}
          >
            <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
            Start Inspection
          </Button>
        )}
        {inspectionStatus[scriptId] === 'in_progress' && (
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transform hover:scale-105 transition-all duration-300 group"
              onClick={() => onRejectInspection(scriptId)}
            >
              <ThumbsDown className="w-4 h-4 mr-2 group-hover:rotate-12 transition-all duration-300" />
              Rejected
            </Button>
            <Button 
              variant="outline"
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transform hover:scale-105 transition-all duration-300 group"
              onClick={() => onApproveInspection(scriptId)}
            >
              <ThumbsUp className="w-4 h-4 mr-2 group-hover:rotate-12 transition-all duration-300" />
              Approved
            </Button>
          </div>
        )}
        {inspectionStatus[scriptId] === 'approved' && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 animate-fade-in">
            Ready to Insert
          </div>
        )}
        {inspectionStatus[scriptId] === 'rejected' && (
          <div className="px-4 py-2 bg-red-50 text-red-700 rounded-md border border-red-200 animate-fade-in">
            Inspection Failed
          </div>
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
