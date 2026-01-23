"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { addEmployee } from "@/src/actions/employees"; // Import the action above

export function CreateEmployeeForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("Operations");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      // Manually append controlled inputs if needed, though hidden inputs work too
      formData.set("department", department);

      await addEmployee(formData);

      toast.success("Employee added successfully", { position: "top-center" });
      onSuccess();
    } catch (err: any) {
      // Error handling matches your style
      toast.error(err.message || "Failed to add employee", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Row 1: Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" placeholder="e.g. Juan" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="e.g. Dela Cruz" required />
        </div>
      </div>

      {/* Row 2: Identifiers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="employeeNo">Employee ID</Label>
          <Input id="employeeNo" name="employeeNo" placeholder="EMP-001" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="email@company.com" required />
        </div>
      </div>

      {/* Row 3: Job Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Select Dept" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" placeholder="e.g. Staff" />
        </div>
      </div>

      {/* Row 4: Date */}
      <div className="space-y-1">
        <Label htmlFor="hireDate">Hire Date</Label>
        <Input id="hireDate" name="hireDate" type="date" required className="block w-full" />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? "Adding..." : "Add Employee"}
      </Button>
    </form>
  );
}