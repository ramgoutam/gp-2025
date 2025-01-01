import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Consultation {
  id: string;
  lead_id: string;
  consultation_date: string;
  status: string;
  lead: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
  };
}

const Consultations = () => {
  const { data: consultations, isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      console.log("Fetching consultations...");
      const { data, error } = await supabase
        .from("consultations")
        .select(`
          *,
          lead:leads (
            first_name,
            last_name,
            email,
            phone,
            company
          )
        `)
        .order("consultation_date", { ascending: true });

      if (error) {
        console.error("Error fetching consultations:", error);
        throw error;
      }

      console.log("Fetched consultations:", data);
      return data as Consultation[];
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
        <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
        <p className="text-gray-500 mt-1">View and manage scheduled consultations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations?.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell>
                    {consultation.lead.first_name} {consultation.lead.last_name}
                  </TableCell>
                  <TableCell>{consultation.lead.email}</TableCell>
                  <TableCell>{consultation.lead.phone || "-"}</TableCell>
                  <TableCell>{consultation.lead.company || "-"}</TableCell>
                  <TableCell>
                    {format(new Date(consultation.consultation_date), "PPp")}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {consultation.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Consultations;