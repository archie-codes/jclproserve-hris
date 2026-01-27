"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 👇 Reuse your Upload Button
import { UploadButton } from "@/lib/uploadthing";
// 👇 Import your Server Action (Ensure it handles the Object, not FormData)
import { updateEmployee } from "@/src/actions/employees";

// --- VALIDATION SCHEMA (Matches Create Form) ---
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  dateOfBirth: z.string().min(1, "Birth date is required"),
  gender: z.string().optional(),
  civilStatus: z.string().optional(),
  imageUrl: z.string().optional(),

  employeeNo: z.string().min(1, "Employee ID is required"),
  status: z.string().min(1, "Status is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  dateHired: z.string().min(1, "Date hired is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),

  sssNo: z.string().optional(),
  philHealthNo: z.string().optional(),
  pagIbigNo: z.string().optional(),
  tinNo: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNo: z.string().optional(),

  address: z.string().optional(),
  mobileNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditEmployeeForm({
  employee,
  onSuccess,
}: {
  employee: any; // Ideally replace 'any' with your Employee type
  onSuccess: () => void;
}) {
  const [imagePreview, setImagePreview] = useState(employee.imageUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  // --- HELPER: FORMAT DATE FOR INPUT (YYYY-MM-DD) ---
  const formatDateForInput = (dateString: string | Date | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  // --- INITIALIZE FORM WITH EXISTING DATA ---
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      middleName: employee.middleName || "",
      suffix: employee.suffix || "",
      dateOfBirth: formatDateForInput(employee.dateOfBirth),
      gender: employee.gender || undefined,
      civilStatus: employee.civilStatus || undefined,
      imageUrl: employee.imageUrl || "",

      employeeNo: employee.employeeNo || "",
      status: employee.status || "PROBATIONARY",
      department: employee.department || undefined,
      position: employee.position || "",
      dateHired: formatDateForInput(employee.dateHired),
      email: employee.email || "",

      sssNo: employee.sssNo || "",
      philHealthNo: employee.philHealthNo || "",
      pagIbigNo: employee.pagIbigNo || "",
      tinNo: employee.tinNo || "",
      bankName: employee.bankName || "",
      bankAccountNo: employee.bankAccountNo || "",

      address: employee.address || "",
      mobileNumber: employee.mobileNumber || "",
      emergencyContactName: employee.emergencyContactName || "",
      emergencyContactPhone: employee.emergencyContactPhone || "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      // Pass the ID and the Data Object
      const result = await updateEmployee(employee.id, data);

      if (result.success) {
        toast.success("Employee record updated successfully");
        onSuccess();
      } else {
        toast.error("Failed to update record");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Helper for ID masks (Same as Create Form)
  const handleFormat = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "SSS" | "PHILHEALTH" | "PAGIBIG" | "TIN" | "MOBILE",
  ) => {
    let value = e.target.value.replace(/\D/g, "");
    // ... (You can copy the same mask logic from CreateEmployeeForm here if you want live formatting)
    return value;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="govt">Govt</TabsTrigger>
            <TabsTrigger value="emergency">Contact</TabsTrigger>
          </TabsList>

          {/* --- PERSONAL TAB --- */}
          <TabsContent value="personal" className="space-y-4 py-4">
            {/* IMAGE UPLOAD SECTION */}
            <div className="flex flex-row items-center gap-6 p-4 border rounded-xl bg-muted/30">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-muted shadow-sm">
                  <AvatarImage src={imagePreview} className="object-cover" />
                  <AvatarFallback className="bg-muted">
                    <User className="h-6 w-6 opacity-50" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Profile Photo</p>
                <div className="flex items-center gap-2">
                  <div className="h-8">
                    <UploadButton
                      endpoint="employeeImage"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        if (res && res[0]) {
                          const url = res[0].url;
                          form.setValue("imageUrl", url);
                          setImagePreview(url);
                          toast.success("Photo updated");
                        }
                      }}
                      appearance={{
                        button:
                          "bg-white dark:bg-zinc-900 !text-foreground border border-input h-8 px-3 text-xs",
                        container: "w-max",
                        allowedContent: "hidden",
                      }}
                      content={{ button: "Change" }}
                    />
                  </div>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-red-500"
                      onClick={() => {
                        setImagePreview("");
                        form.setValue("imageUrl", "");
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* PERSONAL FIELDS GRID */}
            <div className="grid grid-cols-12 gap-4">
              {/* First Name */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Last Name */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Middle */}
              <div className="col-span-12 md:col-span-9">
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* Suffix */}
              <div className="col-span-12 md:col-span-3">
                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffix</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* DOB */}
              <div className="col-span-12 md:col-span-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="block w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Gender */}
              <div className="col-span-12 md:col-span-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              {/* Civil Status */}
              <div className="col-span-12 md:col-span-4">
                <FormField
                  control={form.control}
                  name="civilStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Civil Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single</SelectItem>
                          <SelectItem value="MARRIED">Married</SelectItem>
                          <SelectItem value="WIDOWED">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* --- WORK TAB --- */}
          <TabsContent value="work" className="space-y-4 py-4">
            <div className="grid grid-cols-12 gap-4">
              {/* Employee ID (Read Only usually, but editable here if needed) */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="employeeNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="FINANCE">Finance</SelectItem>
                          <SelectItem value="OPERATIONS">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PROBATIONARY">
                            Probationary
                          </SelectItem>
                          <SelectItem value="REGULAR">Regular</SelectItem>
                          <SelectItem value="CONTRACTUAL">
                            Contractual
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="dateHired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Hired</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="block w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* --- GOVT TAB --- */}
          <TabsContent value="govt" className="space-y-4 py-4">
            <div className="grid grid-cols-12 gap-4">
              {/* SSS */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="sssNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSS Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* PhilHealth */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="philHealthNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PhilHealth</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* PagIBIG */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="pagIbigNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pag-IBIG</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* TIN */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="tinNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TIN</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="col-span-12 my-2" />
              {/* Bank Info */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="bankAccountNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* --- CONTACT TAB --- */}
          <TabsContent value="emergency" className="space-y-4 py-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="col-span-12 my-2" />
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* --- FOOTER BUTTONS --- */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
