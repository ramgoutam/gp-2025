import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type Supplier = {
  id: string;
  name: string;
};

type DeleteSupplierDialogProps = {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteSupplierDialog({
  supplier,
  open,
  onOpenChange,
}: DeleteSupplierDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!supplier) return;
    
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", supplier.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {supplier?.name}? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}