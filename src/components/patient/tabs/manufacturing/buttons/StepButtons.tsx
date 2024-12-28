import { useState, useEffect } from "react";
import { HoldButton } from "./HoldButton";
import { ResumeButton } from "./ResumeButton";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StepButtonsProps {
  scriptId: string;
  step: string;
  status: string;
  onComplete: () => void;
  onHold: (step: string) => void;
}

export const StepButtons = ({ 
  scriptId, 
  step, 
  status, 
  onComplete, 
  onHold 
}: StepButtonsProps) => {
  const [holdReason, setHoldReason] = useState<string>("");

  useEffect(() => {
    const fetchHoldReason = async () => {
      if (status === 'hold') {
        const { data, error } = await supabase
          .from('manufacturing_logs')
          .select(`${step}_notes`)
          .eq('lab_script_id', scriptId)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setHoldReason(data[`${step}_notes`] || "");
        }
      }
    };

    fetchHoldReason();
  }, [scriptId, step, status]);

  if (status === 'in_progress') {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={onComplete}
        >
          <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
          Complete {step.charAt(0).toUpperCase() + step.slice(1)}
        </Button>
        <HoldButton onHold={() => onHold(step)} />
      </div>
    );
  }

  if (status === 'hold') {
    return (
      <ResumeButton 
        onResume={() => onComplete()} 
        holdReason={holdReason}
      />
    );
  }

  return null;
};