// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { CreateEmployeeForm } from "@/components/dashboard/employees/create-employee-form";

// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// };

// export function CreateEmployeeModal({ open, onOpenChange }: Props) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-xl"> {/* Slightly wider for grid layout */}
//         <DialogHeader>
//           <DialogTitle>Add New Employee</DialogTitle>
//         </DialogHeader>
        
//         <CreateEmployeeForm onSuccess={() => onOpenChange(false)} />
        
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreateEmployeeForm } from "@/components/dashboard/employees/create-employee-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateEmployeeModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* UI UPDATE:
          - sm:max-w-4xl : Increases width (approx 896px on desktop)
          - max-h-[90vh] : Ensures it fits vertically on the screen
          - overflow-y-auto : Adds internal scroll if content is too tall
      */}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create a new 201 file record. Fill in all required tabs.
          </DialogDescription>
        </DialogHeader>
        
        <CreateEmployeeForm 
           onSuccess={() => onOpenChange(false)} 
           onCancel={() => onOpenChange(false)} 
        />
        
      </DialogContent>
    </Dialog>
  );
}