import { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, ArrowUpDown, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Database } from '@/integrations/supabase/types';
import { PatientAvatar } from "../header/PatientAvatar";

type Patient = Database['public']['Tables']['patients']['Row'];

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => (
      <PatientAvatar 
        firstName={row.original.first_name} 
        lastName={row.original.last_name}
      />
    ),
    enableSorting: false,
  },
  {
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    id: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("fullName")}</div>
        {row.original.treatment_type && (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mt-1">
            {row.original.treatment_type}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center">
        <Mail className="h-4 w-4 mr-2 text-primary/60" />
        <span className="text-sm">{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center">
        <Phone className="h-4 w-4 mr-2 text-primary/60" />
        <span className="text-sm">{row.getValue("phone")}</span>
      </div>
    ),
  },
  {
    accessorKey: "treatment_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Treatment Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const treatment = row.original.treatment_type;
      if (!treatment) return <span className="text-gray-400">Not set</span>;
      
      return (
        <Badge variant="outline" className="capitalize">
          {treatment}
        </Badge>
      );
    },
  },
  {
    id: "treatmentDetails",
    header: "Treatment Details",
    cell: ({ row }) => {
      const upper = row.original.upper_treatment;
      const lower = row.original.lower_treatment;
      
      if (!upper && !lower) return <span className="text-gray-400">No treatments</span>;
      
      return (
        <div className="space-y-1 text-sm">
          {upper && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Upper:</span>
              <span>{upper}</span>
            </div>
          )}
          {lower && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Lower:</span>
              <span>{lower}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Treatment Status",
    cell: ({ row }) => {
      const hasUpperTreatment = Boolean(row.original.upper_treatment);
      const hasLowerTreatment = Boolean(row.original.lower_treatment);
      
      if (!hasUpperTreatment && !hasLowerTreatment) {
        return (
          <Badge variant="secondary">
            Not Started
          </Badge>
        );
      }
      
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          In Treatment
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <Link 
          to={`/patient/${patient.id}`}
          state={{ patientData: {
            ...patient,
            firstName: patient.first_name,
            lastName: patient.last_name,
          }}}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        >
          <User className="h-4 w-4 mr-2" />
          View Profile
        </Link>
      );
    },
  },
];