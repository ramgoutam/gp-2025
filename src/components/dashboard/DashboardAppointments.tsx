import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, ArrowUpRight } from "lucide-react";

export const DashboardAppointments = () => {
  const { data: recentLabScripts = [] } = useQuery({
    queryKey: ['recentLabScripts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('lab_scripts')
        .select(`
          id,
          request_number,
          doctor_name,
          clinic_name,
          status,
          due_date,
          patients (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Lab Scripts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLabScripts.map((script: any) => (
            <div key={script.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{script.patients?.first_name} {script.patients?.last_name}</p>
                <p className="text-sm text-gray-500">Dr. {script.doctor_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{new Date(script.due_date).toLocaleDateString()}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  script.status === 'completed' ? 'bg-green-100 text-green-800' :
                  script.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {script.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};