"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EditEmployeeModal } from "@/components/dashboard/modals/edit-employee-modal";

// Define the shape of data expected by the modal
// You can also import the specific type from your schema if preferred
interface EditProfileButtonProps {
  employee: any; // We use 'any' here for flexibility, or you can import the inferred type
}

export function EditProfileButton({ employee }: EditProfileButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        size="sm" 
        className="flex-1 sm:flex-none print:hidden" 
        onClick={() => setOpen(true)}
      >
        <Edit className="mr-2 h-4 w-4" /> Edit Profile
      </Button>

      {/* The Modal is rendered here but hidden until open is true */}
      <EditEmployeeModal 
        open={open} 
        onOpenChange={setOpen} 
        employee={employee} 
      />
    </>
  );
}