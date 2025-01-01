import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
  status: string | null;
  created_at: string;
}

const Leads = () => {
  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      console.log("Fetching leads...");
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }

      console.log("Fetched leads:", data);
      return data as Lead[];
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500 mt-1">Manage and track your leads</p>
      </div>

      <div className="grid gap-4">
        {leads?.map((lead) => (
          <Card key={lead.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {lead.first_name} {lead.last_name}
                </span>
                <span className="text-sm font-normal text-gray-500">
                  {format(new Date(lead.created_at), "MMM d, yyyy")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Information</p>
                  <p className="mt-1">{lead.email}</p>
                  {lead.phone && <p className="mt-1">{lead.phone}</p>}
                  {lead.company && <p className="mt-1">{lead.company}</p>}
                </div>
                {lead.message && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Message</p>
                    <p className="mt-1 text-gray-700">{lead.message}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Leads;