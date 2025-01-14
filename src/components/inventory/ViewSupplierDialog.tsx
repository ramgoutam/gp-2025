import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Supplier = {
  id: string;
  supplier_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
};

type ViewSupplierDialogProps = {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ViewSupplierDialog({
  supplier,
  open,
  onOpenChange,
}: ViewSupplierDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supplier Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Supplier Name</h3>
            <p className="text-gray-600">{supplier?.supplier_name}</p>
          </div>
          {supplier?.contact_person && (
            <div>
              <h3 className="font-medium mb-1">Contact Person</h3>
              <p className="text-gray-600">{supplier.contact_person}</p>
            </div>
          )}
          {supplier?.email && (
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-gray-600">{supplier.email}</p>
            </div>
          )}
          {supplier?.phone && (
            <div>
              <h3 className="font-medium mb-1">Phone</h3>
              <p className="text-gray-600">{supplier.phone}</p>
            </div>
          )}
          {supplier?.address && (
            <div>
              <h3 className="font-medium mb-1">Address</h3>
              <p className="text-gray-600">{supplier.address}</p>
            </div>
          )}
          {supplier?.notes && (
            <div>
              <h3 className="font-medium mb-1">Notes</h3>
              <p className="text-gray-600">{supplier.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}