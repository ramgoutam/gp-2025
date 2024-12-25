import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PatientUpdateData } from '@/types/patient';

interface TreatmentFormProps {
  patientId: string;
  onSuccess?: () => void;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export const TreatmentForm: React.FC<TreatmentFormProps> = ({ 
  patientId, 
  onSuccess, 
  onClose,
  onSubmitSuccess 
}) => {
  const { toast } = useToast();
  const [treatmentType, setTreatmentType] = useState('');
  const [upperTreatment, setUpperTreatment] = useState('');
  const [lowerTreatment, setLowerTreatment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: PatientUpdateData = {
      treatment_type: treatmentType,
      upper_treatment: upperTreatment,
      lower_treatment: lowerTreatment,
      id: patientId
    };

    try {
      const { error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', patientId);

      if (error) throw error;

      onSuccess?.();
      onSubmitSuccess?.();
      onClose();
      
      toast({
        title: "Success",
        description: "Treatment information updated successfully",
      });
    } catch (error) {
      console.error('Error updating treatment:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment information",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="treatmentType" className="block text-sm font-medium text-gray-700">Treatment Type</label>
        <input
          type="text"
          id="treatmentType"
          value={treatmentType}
          onChange={(e) => setTreatmentType(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary"
          required
        />
      </div>
      <div>
        <label htmlFor="upperTreatment" className="block text-sm font-medium text-gray-700">Upper Treatment</label>
        <input
          type="text"
          id="upperTreatment"
          value={upperTreatment}
          onChange={(e) => setUpperTreatment(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary"
          required
        />
      </div>
      <div>
        <label htmlFor="lowerTreatment" className="block text-sm font-medium text-gray-700">Lower Treatment</label>
        <input
          type="text"
          id="lowerTreatment"
          value={lowerTreatment}
          onChange={(e) => setLowerTreatment(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary"
          required
        />
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="mr-2 text-gray-500">Cancel</button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Save
        </button>
      </div>
    </form>
  );
};