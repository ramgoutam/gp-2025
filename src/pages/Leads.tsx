import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { ConsultationDialog } from "@/components/leads/ConsultationDialog";

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

const mockLeads: Lead[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Inc.',
    message: 'Interested in your dental services',
    source: 'website',
    status: 'new',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@company.com',
    phone: '(555) 987-6543',
    company: 'Tech Solutions',
    message: 'Looking for consultation',
    source: 'referral',
    status: 'contacted',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    first_name: 'Mike',
    last_name: 'Johnson',
    email: 'mike.johnson@gmail.com',
    phone: '(555) 246-8135',
    company: null,
    message: 'Need more information about treatments',
    source: 'social media',
    status: 'pending',
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

const Leads = () => {
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: leads = mockLeads, isLoading } = useQuery({
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
      return (data?.length ? data : mockLeads) as Lead[];
    },
    placeholderData: mockLeads
  });

  const handleAddConsultation = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  const handleScheduleConsultation = (date: Date, time: string) => {
    console.log("Scheduling consultation:", {
      lead: selectedLead,
      date,
      time,
    });

    toast({
      title: "Consultation Scheduled",
      description: `Consultation scheduled for ${selectedLead?.first_name} ${
        selectedLead?.last_name
      } on ${format(date, "PPP")} at ${time}`,
    });

    setIsDialogOpen(false);
    setSelectedLead(null);
  };

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

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadsTable leads={leads} onAddConsultation={handleAddConsultation} />
        </CardContent>
      </Card>

      <ConsultationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        lead={selectedLead}
      />
    </div>
  );
};

export default Leads;
