import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/utils/databaseUtils";
import { useToast } from "@/components/ui/use-toast";
import { usePatientStore } from "@/stores/patientStore";
import type { Database } from '@/integrations/supabase/types';

type Patient = Database['public']['Tables']['patients']['Row'];

export const PatientList = () => {
  const { toast } = useToast();
  const { searchQuery } = usePatientStore();

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: "Failed to load patients. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const filteredPatients = patients.filter((patient: Patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPatients.map((patient: Patient) => (
        <Link
          key={patient.id}
          to={`/patient/${patient.id}`}
          state={{ patientData: {
            ...patient,
            firstName: patient.first_name,
            lastName: patient.last_name,
          }}}
          className="block group"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md hover:border-primary/20">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                {patient.first_name[0]}
                {patient.last_name[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                  {patient.first_name} {patient.last_name}
                </h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {patient.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {patient.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};