import { Link } from "react-router-dom";
import { Mail, Phone, Smile } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="space-y-4">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Smile className="w-7 h-7 text-primary/70" />
                    </div>
                    {patient.treatment_type && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 border-2 border-white">
                        <span className="text-[10px] font-medium text-primary">
                          {patient.treatment_type[0].toUpperCase()}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200 truncate">
                    {patient.first_name} {patient.last_name}
                  </h3>
                  <div className="mt-3 space-y-2.5">
                    <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                      <Mail className="h-4 w-4 mr-2 text-primary/60 group-hover:text-primary transition-colors duration-200" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                      <Phone className="h-4 w-4 mr-2 text-primary/60 group-hover:text-primary transition-colors duration-200" />
                      <span>{patient.phone}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    {patient.treatment_type && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {patient.treatment_type}
                      </span>
                    )}
                    {patient.surgery_date && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Surgery: {new Date(patient.surgery_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};