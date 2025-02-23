import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/user";
import { Edit, Trash } from "lucide-react";

export const columns: ColumnDef<UserRole>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">
              {(row.original.first_name?.[0] || "").toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {row.original.first_name || "Not specified"}
            </div>
            <div className="text-sm text-gray-500">
              @{row.original.first_name?.toLowerCase() || "user"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-gray-900">
          {row.original.last_name || "Not specified"}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-gray-600">
          {row.original.phone || "Not specified"}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return (
        <Badge 
          variant="outline" 
          className="px-4 py-1 rounded-md bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20 font-medium"
        >
          {row.original.role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 lg:px-3 hover:bg-primary/5 hover:text-primary border-primary/20"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 lg:px-3 hover:bg-destructive/5 hover:text-destructive border-destructive/20"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      );
    },
  },
];