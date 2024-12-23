import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PatientForm } from "@/components/PatientForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
}

const Index = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(() => {
    const savedPatients = localStorage.getItem('patients');
    return savedPatients ? JSON.parse(savedPatients) : [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        sex: "male",
        dob: "1990-01-01",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phone: "098-765-4321",
        sex: "female",
        dob: "1985-05-15",
      },
    ];
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleAddPatient = (patientData: Omit<Patient, "id">) => {
    const newPatient = {
      ...patientData,
      id: Date.now(),
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    
    toast({
      title: "Success",
      description: "Patient added successfully",
    });
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
                <PatientForm onSubmitSuccess={handleAddPatient} />
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
            {filteredPatients.map((patient) => (
              <Link
                key={patient.id}
                to={`/patient/${patient.id}`}
                state={{ patientData: patient }}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md hover:border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                      {patient.firstName[0]}
                      {patient.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                        {patient.firstName} {patient.lastName}
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