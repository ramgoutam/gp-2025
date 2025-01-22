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
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    id: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      return (
        <div className="flex items-center gap-3">
          <PatientAvatar 
            firstName={row.original.first_name} 
            lastName={row.original.last_name}
          />
          <div>
            <div className="font-medium">{row.getValue("fullName")}</div>
            <span className="mt-0.5 text-xs text-muted-foreground">
              {row.original.sex} | {calculateAge(row.original.dob)} years
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => row.getValue("email"),
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => (
      <div>{row.original.address || "Not specified"}</div>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const hasUpperTreatment = Boolean(row.original.upper_treatment);
      const hasLowerTreatment = Boolean(row.original.lower_treatment);
      
      return (
        <Badge variant={hasUpperTreatment || hasLowerTreatment ? "default" : "secondary"}>
          {hasUpperTreatment || hasLowerTreatment ? "Active" : "Not Started"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <div className="text-right">
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
        </div>
      );
    },
  },
];
