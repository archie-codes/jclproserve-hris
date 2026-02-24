"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, RefreshCcw, User } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { createEmployee, getNextEmployeeId } from "@/src/actions/employees";
// Import the new helper
import { getFormReferences } from "@/src/actions/references";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UploadButton } from "@/lib/uploadthing";

// --- 1. UPDATED SCHEMA (Uses UUIDs) ---
const formSchema = z.object({
  // Personal
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  imageUrl: z.string().optional(),
  dateOfBirth: z.string().min(1, "Birth date is required"),
  gender: z.enum(["MALE", "FEMALE"]),
  civilStatus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "SEPARATED"]),

  // Contact
  email: z.string().email("Invalid email address"),
  mobileNumber: z
    .string()
    .min(11, "Mobile number must be 11 digits")
    .max(11, "Mobile number must be 11 digits")
    .regex(/^09\d{9}$/, "Must be a valid PH number"),
  address: z.string().min(1, "Address is required"),

  // Work (UPDATED: ID References)
  employeeNo: z.string().min(1, "Employee ID is required"),

  departmentId: z.string().min(1, "Department is required"), // Changed from 'department'
  positionId: z.string().min(1, "Position is required"), // Changed from 'position'
  shiftId: z.string().min(1, "Shift is required"), // New Field

  status: z.enum(["PROBATIONARY", "REGULAR", "CONTRACTUAL", "PROJECT_BASED"]),
  dateHired: z.string().min(1, "Hire date is required"),

  // Govt IDs
  sssNo: z.string().optional(),
  philHealthNo: z.string().optional(),
  pagIbigNo: z.string().optional(),
  tinNo: z.string().optional(),

  // Banking
  bankName: z.string().optional(),
  bankAccountNo: z.string().optional(),

  // Emergency
  emergencyContactName: z.string().min(1, "Emergency contact is required"),
  emergencyContactPhone: z
    .string()
    .min(11)
    .max(11)
    .regex(/^09\d{9}$/, "Valid PH number required"),

  // Compensation
  basicSalary: z.coerce.number().min(1, "Basic salary is required"),
  salaryType: z.enum(["DAILY", "SEMI_MONTHLY"]), // Updated Enum
  allowance: z.coerce.number().default(0),
});

interface CreateEmployeeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateEmployeeForm({
  onSuccess,
  onCancel,
}: CreateEmployeeFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  // State for Dropdown Options
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [positions, setPositions] = useState<
    { id: string; title: string; departmentId: string | null }[]
  >([]);
  const [shifts, setShifts] = useState<{ id: string; name: string }[]>([]);

  // Filtered positions based on selected department
  const [filteredPositions, setFilteredPositions] = useState<
    { id: string; title: string }[]
  >([]);

  // Initialize Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      dateOfBirth: "",
      gender: undefined,
      civilStatus: undefined,
      email: "",
      mobileNumber: "",
      address: "",
      employeeNo: "",

      // Relations
      departmentId: "",
      positionId: "",
      shiftId: "", // Default empty

      status: "PROBATIONARY",
      dateHired: "",
      sssNo: "",
      tinNo: "",
      philHealthNo: "",
      pagIbigNo: "",
      bankName: "",
      bankAccountNo: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      basicSalary: 0,
      salaryType: "SEMI_MONTHLY",
      allowance: 0,
    },
  });

  // Load Data on Mount
  useEffect(() => {
    const initData = async () => {
      // 1. Generate ID
      setIsGeneratingId(true);
      const nextId = await getNextEmployeeId();
      if (nextId) form.setValue("employeeNo", nextId);
      setIsGeneratingId(false);

      // 2. Fetch Dropdown Options
      try {
        const refs = await getFormReferences();
        setDepartments(refs.departments);
        setPositions(refs.positions);
        setShifts(refs.shifts);
      } catch (err) {
        toast.error("Failed to load departments/positions");
      }
    };
    initData();
  }, []);

  // Filter Positions when Department Changes
  const selectedDeptId = form.watch("departmentId");
  useEffect(() => {
    if (selectedDeptId) {
      const relevant = positions.filter(
        (p) => p.departmentId === selectedDeptId,
      );
      setFilteredPositions(relevant);
      // Optional: Clear position if it doesn't match anymore
      // form.setValue("positionId", "");
    } else {
      setFilteredPositions([]);
    }
  }, [selectedDeptId, positions]);

  const handleRegenerateId = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGeneratingId(true);
    const nextId = await getNextEmployeeId();
    if (nextId) {
      form.setValue("employeeNo", nextId);
      toast.success("Employee ID generated");
    }
    setIsGeneratingId(false);
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Pass the raw values. The server action needs to handle UUIDs now.
      const result = await createEmployee(values as any);

      if (result.success) {
        toast.success("Employee record created successfully", {
          position: "top-center",
        });
        form.reset();
        setActiveTab("personal");
        onSuccess();
      } else {
        toast.error(result.error || "Failed to create employee", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred", { position: "top-center" });
    }
  };

  // ... (Your existing handleFormat function is fine, keep it) ...
  const handleFormat = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "SSS" | "PHILHEALTH" | "PAGIBIG" | "TIN" | "MOBILE",
  ) => {
    // ... keep your formatting logic ...
    return e.target.value; // Placeholder to keep code short here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="work">Work Info</TabsTrigger>
            <TabsTrigger value="govt">Govt IDs</TabsTrigger>
            <TabsTrigger value="emergency">Contact</TabsTrigger>
          </TabsList>

          {/* TAB 1: PERSONAL (Keep exactly as your code, just pasting essential wrapper) */}
          {/* TAB 1: PERSONAL */}
          <TabsContent value="personal" className="space-y-4 py-4">
            {/* Upload Section */}
            <div className="flex flex-row items-center gap-6 p-6 border rounded-xl bg-card shadow-xs">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-muted shadow-sm overflow-hidden">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="flex h-full w-full items-center justify-center bg-muted">
                    <User className="h-8 w-8 text-muted-foreground/50" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="text-sm font-medium">Profile Picture</h4>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Supports JPG, PNG. Max size of 4MB.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9">
                    <UploadButton
                      endpoint="employeeImage"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          const url = res[0].url;
                          form.setValue("imageUrl", url);
                          setImagePreview(url);
                          toast.success("Profile picture updated", {
                            position: "top-center",
                          });
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`, {
                          position: "top-center",
                        });
                      }}
                      appearance={{
                        button:
                          "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md shadow-sm transition-colors text-sm font-medium",
                        container: "w-max",
                        allowedContent: "hidden",
                      }}
                    />
                  </div>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 h-9"
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

            {/* Personal Fields */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
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
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffix</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jr."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
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
                          <SelectTrigger className="w-full">
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
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single</SelectItem>
                          <SelectItem value="MARRIED">Married</SelectItem>
                          <SelectItem value="WIDOWED">Widowed</SelectItem>
                          <SelectItem value="SEPARATED">Separated</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: WORK INFO (MAJOR CHANGES HERE) */}
          <TabsContent value="work" className="space-y-4 py-4">
            <div className="grid grid-cols-12 gap-4">
              {/* Employee ID (Keep existing) */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="employeeNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            disabled={true}
                            className="font-mono font-bold"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleRegenerateId}
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Email (Keep existing) */}
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
                    </FormItem>
                  )}
                />
              </div>

              {/* DEPARTMENT (Dynamic Dropdown) */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Dept" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* POSITION (Dynamic Filtered Dropdown) */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="positionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedDeptId} // Disable if no dept selected
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                selectedDeptId
                                  ? "Select Position"
                                  : "Select Dept First"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredPositions.map((pos) => (
                            <SelectItem key={pos.id} value={pos.id}>
                              {pos.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SHIFT (New Field) */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="shiftId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shift Schedule *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Shift" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shifts.map((shift) => (
                            <SelectItem key={shift.id} value={shift.id}>
                              {shift.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status & Date Hired (Keep existing) */}
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Hired</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              // Convert Date object to ISO string for your Zod schema
                              field.onChange(date ? date.toISOString() : "")
                            }
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-4" />

            {/* COMPENSATION (Updated Enum) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 md:col-span-1">
                <FormField
                  control={form.control}
                  name="salaryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DAILY">Daily Rate</SelectItem>
                          <SelectItem value="SEMI_MONTHLY">
                            Semi-Monthly
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* 2. Basic Salary */}
              <div className="col-span-3 md:col-span-1">
                <FormField
                  control={form.control}
                  name="basicSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Basic (₱)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          // 1. Fix TS Error: Cast value to number (or empty string if undefined)
                          value={(field.value as number) || ""}
                          // 2. Fix Logic: Ensure RHF gets a number, not a string
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 3. Allowance */}
              <div className="col-span-3 md:col-span-1">
                <FormField
                  control={form.control}
                  name="allowance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowance (₱)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          // 1. Fix TS Error: Cast value
                          value={(field.value as number) || ""}
                          // 2. Fix Logic: Handle number conversion
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: GOVERNMENT */}
          <TabsContent value="govt" className="space-y-4 py-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="sssNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSS Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00-0000000-0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "SSS"))
                          }
                          maxLength={12}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="philHealthNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PhilHealth Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00-000000000-0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "PHILHEALTH"))
                          }
                          maxLength={14}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="pagIbigNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pag-IBIG / HDMF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0000-0000-0000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "PAGIBIG"))
                          }
                          maxLength={14}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="tinNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TIN (Tax ID)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000-000-000-000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "TIN"))
                          }
                          maxLength={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="col-span-12 my-2" />
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. BDO" {...field} />
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
                        <Input placeholder="Account #" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: CONTACT & EMERGENCY */}
          <TabsContent value="emergency" className="space-y-4 py-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="House No., Street, Brgy, City, Province"
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel>
                        Mobile Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="09xxxxxxxxx"
                          {...field}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "MOBILE"))
                          }
                          maxLength={11}
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel>
                        Emergency Contact Name{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full Name" />
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="09xxxxxxxxx"
                          type="tel"
                          maxLength={11} // HTML limit
                          inputMode="numeric" // Shows number pad on mobile
                          // Intercept the change event
                          onChange={(e) => {
                            // 1. Remove any non-numeric characters (letters, symbols)
                            const value = e.target.value.replace(/\D/g, "");

                            // 2. Only update if length is <= 11
                            if (value.length <= 11) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Record
          </Button>
        </div>
      </form>
    </Form>
  );
}
