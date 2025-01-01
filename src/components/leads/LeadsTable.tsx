import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

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

interface LeadsTableProps {
  leads: Lead[];
  onAddConsultation: (lead: Lead) => void;
}

export const LeadsTable = ({ leads, onAddConsultation }: LeadsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads?.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell>
              {lead.first_name} {lead.last_name}
            </TableCell>
            <TableCell>{lead.email}</TableCell>
            <TableCell>{lead.phone || "-"}</TableCell>
            <TableCell>{lead.company || "-"}</TableCell>
            <TableCell>{lead.source || "website"}</TableCell>
            <TableCell>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {lead.status || "new"}
              </span>
            </TableCell>
            <TableCell>
              {format(new Date(lead.created_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddConsultation(lead)}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add Consultation
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};