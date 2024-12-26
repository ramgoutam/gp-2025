import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";

export const DashboardAppointments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: patients = [] } = useQuery({
    queryKey: ['searchPatients', searchQuery],
    queryFn: async () => {
      console.log('Searching patients with query:', searchQuery);
      if (!searchQuery) return [];

      const { data } = await supabase
        .from('patients')
        .select('id, first_name, last_name, email')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(5);

      console.log('Found patients:', data?.length);
      return data || [];
    },
    enabled: searchQuery.length > 0
  });

  return (
    <Card className="shadow-sm">
      <CardContent className="p-3">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-primary/20 transition-all duration-200"
            />
          </div>

          {searchQuery && (
            <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors first:rounded-t-md last:rounded-b-md"
                  onClick={() => navigate(`/patient/${patient.id}`, {
                    state: {
                      patientData: {
                        ...patient,
                        firstName: patient.first_name,
                        lastName: patient.last_name,
                      }
                    }
                  })}
                >
                  <div className="p-1.5 rounded-full bg-primary/10 mr-3">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{patient.email}</p>
                  </div>
                </div>
              ))}
              {patients.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No patients found
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};