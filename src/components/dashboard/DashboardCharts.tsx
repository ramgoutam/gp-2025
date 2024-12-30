import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 gap-4 animate-fade-in">
      <Card className="relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
            Dashboard Charts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Charts will be added here</p>
        </CardContent>
      </Card>
    </div>
  );
};