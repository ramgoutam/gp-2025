import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PatientForm } from "@/components/PatientForm";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Plus, Mail, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createPatient, getPatients } from "@/utils/databaseUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch patients using React Query
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    onError: (error) => {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create patient mutation
  const createPatientMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: (newPatient) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        title: "Success",
        description: "Patient added successfully",
      });
      navigate(`/patient/${newPatient.id}`);
    },
    onError: (error) => {
      console.error('Error creating patient:', error);
      toast({
        title: "Error",
        description: "Failed to create patient. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddPatient = async (patientData: Omit<Patient, "id">) => {
    // Transform the data to match the database column names
    const transformedData = {
      first_name: patientData.firstName,
      last_name: patientData.lastName,
      email: patientData.email,
      phone: patientData.phone,
      sex: patientData.sex,
      dob: patientData.dob,
    };

    createPatientMutation.mutate(transformedData);
  };

  const filteredPatients = patients.filter((patient: Patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading patients...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New Patient Registration</DialogTitle>
                </DialogHeader>
                <PatientForm 
                  onSubmitSuccess={handleAddPatient}
                  onClose={() => {
                    const closeButton = document.querySelector('[aria-label="Close"]');
                    if (closeButton instanceof HTMLButtonElement) {
                      closeButton.click();
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

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
        </div>
      </main>
    </div>
  );
};

export default Index;