import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Patient Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <div className="space-y-2">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
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
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                  </div>
                </div>
              </div>
            ))}
            {searchQuery && patients.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No patients found
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};