// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "sonner";
// import { Loader2, RefreshCcw, User } from "lucide-react";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";

// import { createEmployee, getNextEmployeeId } from "@/src/actions/employees";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { UploadButton } from "@/lib/uploadthing";
// import { AvatarFallback } from "@radix-ui/react-avatar";

// // --- 1. STRICT REGEX VALIDATION SCHEMA ---
// const formSchema = z.object({
//   // Personal
//   firstName: z.string().min(1, "First name is required"),
//   middleName: z.string().optional(),
//   lastName: z.string().min(1, "Last name is required"),
//   suffix: z.string().optional(),
//   imageUrl: z.string().optional(),
//   dateOfBirth: z.string().min(1, "Birth date is required"),
//   gender: z.enum(["MALE", "FEMALE"]),
//   civilStatus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "SEPARATED"]),

//   // Contact
//   email: z.string().email("Invalid email address"),
//   mobileNumber: z.string().min(11, "Mobile number must be 11 digits (09...)"), // e.g., 0917...
//   address: z.string().optional(),

//   // Work
//   employeeNo: z.string().min(1, "Employee ID is required"),
//   department: z.string().min(1, "Department is required"),
//   position: z.string().min(1, "Position is required"),
//   status: z.enum(["PROBATIONARY", "REGULAR", "CONTRACTUAL", "PROJECT_BASED"]),
//   dateHired: z.string().min(1, "Hire date is required"),

//   // --- GOVERNMENT IDS (Strict Format) ---
//   // SSS: 00-0000000-0 (10 digits)
//   sssNo: z
//     .string()
//     .optional()
//     .refine((val) => !val || /^\d{2}-\d{7}-\d{1}$/.test(val), {
//       message: "Invalid SSS format (e.g., 00-0000000-0)",
//     }),
//   // PhilHealth: 00-000000000-0 (12 digits)
//   philHealthNo: z
//     .string()
//     .optional()
//     .refine((val) => !val || /^\d{2}-\d{9}-\d{1}$/.test(val), {
//       message: "Invalid PhilHealth format (e.g., 00-000000000-0)",
//     }),
//   // Pag-IBIG: 0000-0000-0000 (12 digits)
//   pagIbigNo: z
//     .string()
//     .optional()
//     .refine((val) => !val || /^\d{4}-\d{4}-\d{4}$/.test(val), {
//       message: "Invalid Pag-IBIG format (e.g., 0000-0000-0000)",
//     }),
//   // TIN: 000-000-000-000 (12 digits)
//   tinNo: z
//     .string()
//     .optional()
//     .refine((val) => !val || /^\d{3}-\d{3}-\d{3}-\d{3}$/.test(val), {
//       message: "Invalid TIN format (e.g., 000-000-000-000)",
//     }),

//   // Banking
//   bankName: z.string().optional(),
//   bankAccountNo: z.string().optional(),

//   // Emergency
//   emergencyContactName: z.string().optional(),
//   emergencyContactPhone: z.string().optional(),

// });

// type FormValues = z.infer<typeof formSchema>;

// interface CreateEmployeeFormProps {
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// export function CreateEmployeeForm({
//   onSuccess,
//   onCancel,
// }: CreateEmployeeFormProps) {
//   const [activeTab, setActiveTab] = useState("personal");
//   const [isGeneratingId, setIsGeneratingId] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string>("");

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       imageUrl: "",
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       suffix: "",
//       dateOfBirth: "",
//       gender: undefined,
//       civilStatus: undefined,
//       email: "",
//       mobileNumber: "",
//       address: "",
//       employeeNo: "",
//       department: undefined,
//       position: "",
//       status: "PROBATIONARY",
//       dateHired: "",
//       sssNo: "",
//       tinNo: "",
//       philHealthNo: "",
//       pagIbigNo: "",
//       bankName: "",
//       bankAccountNo: "",
//       emergencyContactName: "",
//       emergencyContactPhone: "",
//     },
//   });
//   // 👇 ADD THIS EFFECT: Fetch ID on mount
//   // 1. Auto-generate ID on Mount
//   useEffect(() => {
//     const fetchId = async () => {
//       setIsGeneratingId(true);
//       try {
//         const nextId = await getNextEmployeeId();
//         if (nextId) {
//           // Update the form value
//           form.setValue("employeeNo", nextId, {
//             shouldValidate: true,
//             shouldDirty: true,
//           });
//         }
//       } catch (error) {
//         console.error("Failed to generate ID:", error);
//         toast.error("Could not auto-generate ID");
//       } finally {
//         // Stop the loading state
//         setIsGeneratingId(false);
//       }
//     };

//     // Only fetch if currently empty
//     if (!form.getValues("employeeNo")) {
//       fetchId();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // 👇 ADD THIS HANDLER: Manual Refresh button
//   const handleRegenerateId = async (e: React.MouseEvent) => {
//     e.preventDefault(); // Prevent form submit
//     setIsGeneratingId(true);
//     const nextId = await getNextEmployeeId();
//     if (nextId) {
//       form.setValue("employeeNo", nextId);
//       toast.success("Employee ID generated", { position: "top-center" });
//     }
//     setIsGeneratingId(false);
//   };

//   const isLoading = form.formState.isSubmitting;

//   // --- 2. INPUT FORMATTERS (Auto-add dashes) ---

//   const handleFormat = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: "SSS" | "PHILHEALTH" | "PAGIBIG" | "TIN" | "MOBILE",
//   ) => {
//     let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
//     let formatted = "";

//     if (type === "SSS") {
//       // Format: XX-XXXXXXX-X (10 digits)
//       val = val.substring(0, 10);
//       if (val.length > 2) formatted = `${val.slice(0, 2)}-${val.slice(2)}`;
//       else formatted = val;
//       if (val.length > 9)
//         formatted = `${formatted.slice(0, 10)}-${formatted.slice(10)}`;
//     } else if (type === "PHILHEALTH") {
//       // Format: XX-XXXXXXXXX-X (12 digits)
//       val = val.substring(0, 12);
//       if (val.length > 2) formatted = `${val.slice(0, 2)}-${val.slice(2)}`;
//       else formatted = val;
//       if (val.length > 11)
//         formatted = `${formatted.slice(0, 12)}-${formatted.slice(12)}`;
//     } else if (type === "PAGIBIG") {
//       // Format: XXXX-XXXX-XXXX (12 digits)
//       val = val.substring(0, 12);
//       if (val.length > 4) formatted = `${val.slice(0, 4)}-${val.slice(4)}`;
//       else formatted = val;
//       if (val.length > 8)
//         formatted = `${formatted.slice(0, 9)}-${formatted.slice(9)}`;
//     } else if (type === "TIN") {
//       // Format: XXX-XXX-XXX-XXX (12 digits)
//       val = val.substring(0, 12);
//       if (val.length > 3) formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
//       else formatted = val;
//       if (val.length > 6)
//         formatted = `${formatted.slice(0, 7)}-${formatted.slice(7)}`;
//       if (val.length > 9)
//         formatted = `${formatted.slice(0, 11)}-${formatted.slice(11)}`;
//     } else if (type === "MOBILE") {
//       // Simple limit to 11 digits
//       formatted = val.substring(0, 11);
//     }

//     return formatted;
//   };

//   const onSubmit = async (values: FormValues) => {
//     try {
//       const result = await createEmployee(values);
//       if (result.success) {
//         toast.success("Employee record created successfully", {
//           position: "top-center",
//         });
//         form.reset();
//         setActiveTab("personal");
//         onSuccess();
//       } else {
//         toast.error(result.error || "Failed to create employee", {
//           position: "top-center",
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An unexpected error occurred", { position: "top-center" });
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="personal">Personal</TabsTrigger>
//             <TabsTrigger value="work">Work Info</TabsTrigger>
//             <TabsTrigger value="govt">Govt IDs</TabsTrigger>
//             <TabsTrigger value="emergency">Contact</TabsTrigger>
//           </TabsList>

//           {/* TAB 1: PERSONAL */}
//           <TabsContent value="personal" className="space-y-4 py-4">
//             {/* --- UPLOAD SECTION START --- */}
//             <div className="flex flex-row items-center gap-6 p-6 border rounded-xl bg-card text-card-foreground shadow-xs">
//               {/* 1. Avatar Preview (Left Side) */}
//               <div className="relative">
//                 <Avatar className="h-20 w-20 border-2 border-muted shadow-sm overflow-hidden">
//                   {/* Only render AvatarImage if there is a valid URL */}
//                   {imagePreview ? (
//                     <AvatarImage
//                       src={imagePreview}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : null}

//                   {/* Force Fallback to fill the circle and center the icon */}
//                   <AvatarFallback className="flex h-full w-full items-center justify-center bg-muted">
//                     <User className="h-8 w-8 text-muted-foreground/50" />
//                   </AvatarFallback>
//                 </Avatar>
//               </div>

//               {/* 2. Controls (Right Side) */}
//               <div className="flex-1 space-y-2">
//                 <div>
//                   <h4 className="text-sm font-medium text-foreground">
//                     Profile Picture
//                   </h4>
//                   <p className="text-[0.8rem] text-muted-foreground">
//                     Supports JPG, PNG. Max size of 4MB.
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   {/* UploadThing Button - Styled to look like a Shadcn 'Outline' Button */}
//                   <div className="h-9">
//                     <UploadButton
//                       endpoint="employeeImage"
//                       onClientUploadComplete={(res: { url: string }[]) => {
//                         if (res && res[0]) {
//                           const url = res[0].url;
//                           form.setValue("imageUrl", url);
//                           setImagePreview(url);
//                           toast.success("Profile picture updated", {
//                             position: "top-center",
//                           });
//                         }
//                       }}
//                       onUploadError={(error: Error) => {
//                         toast.error(`Upload failed: ${error.message}`, {
//                           position: "top-center",
//                         });
//                       }}
//                       // 👇 Custom Styling to match your theme
//                       appearance={{
//                         button:
//                           "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md shadow-sm transition-colors text-sm font-medium",
//                         container: "w-max",
//                         allowedContent: "hidden", // We hide the "Images up to 4MB" text to keep it clean, or remove this line to show it
//                       }}
//                     />
//                   </div>

//                   {/* Remove Button (Only shows if image exists) */}
//                   {imagePreview && (
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-9"
//                       onClick={() => {
//                         setImagePreview("");
//                         form.setValue("imageUrl", "");
//                       }}
//                     >
//                       Remove
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//             {/* --- UPLOAD SECTION END --- */}

//             {/* ... Personal Information Fields ... */}
//             <div className="grid grid-cols-12 gap-4">
//               {/* ROW 1: First Name & Last Name (50% / 50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         First Name <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Last Name <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* ROW 2: Middle Name (75%) & Suffix (25%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="middleName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Middle Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} value={field.value || ""} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="suffix"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Suffix</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Jr."
//                           {...field}
//                           value={field.value || ""}
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* ROW 3: DOB (33%), Gender (33%), Civil Status (33%) */}
//               <div className="col-span-12 md:col-span-4">
//                 <FormField
//                   control={form.control}
//                   name="dateOfBirth"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Date of Birth <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="date"
//                           {...field}
//                           className="block w-full"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="col-span-12 md:col-span-4">
//                 <FormField
//                   control={form.control}
//                   name="gender"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Gender</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           {/* 👇 Added w-full to make the dropdown button full width */}
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="MALE">Male</SelectItem>
//                           <SelectItem value="FEMALE">Female</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="col-span-12 md:col-span-4">
//                 <FormField
//                   control={form.control}
//                   name="civilStatus"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Civil Status</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           {/* 👇 Added w-full here too */}
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="SINGLE">Single</SelectItem>
//                           <SelectItem value="MARRIED">Married</SelectItem>
//                           <SelectItem value="WIDOWED">Widowed</SelectItem>
//                           <SelectItem value="SEPARATED">Separated</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           </TabsContent>

//           {/* TAB 2: WORK INFO */}
//           <TabsContent value="work" className="space-y-4 py-4">
//             <div className="grid grid-cols-12 gap-4">
//               {/* Employee ID (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="employeeNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Employee ID <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <div className="flex gap-2">
//                         <FormControl>
//                           <Input
//                             {...field}
//                             // 👇 FIX: Override value to show "Generating..." text while loading
//                             value={
//                               isGeneratingId ? "Generating..." : field.value
//                             }
//                             // 👇 FIX: Disable input while loading so they can't type over it
//                             disabled={isGeneratingId}
//                             // 👇 FIX: Add styling to make it look active/loading
//                             className={
//                               isGeneratingId
//                                 ? "text-muted-foreground animate-pulse"
//                                 : "font-mono font-bold"
//                             }
//                           />
//                         </FormControl>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="icon"
//                           onClick={handleRegenerateId}
//                           disabled={isGeneratingId}
//                           title="Generate Next ID"
//                         >
//                           <RefreshCcw
//                             className={`h-4 w-4 ${isGeneratingId ? "animate-spin" : ""}`}
//                           />
//                         </Button>
//                       </div>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Work Email (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Work Email <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Department (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="department"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Department <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select Dept" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="IT">IT</SelectItem>
//                           <SelectItem value="HR">HR</SelectItem>
//                           <SelectItem value="FINANCE">FINANCE</SelectItem>
//                           <SelectItem value="OPERATIONS">OPERATIONS</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Position (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="position"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Position <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select Dept" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="IT STAFF">IT STAFF</SelectItem>
//                           <SelectItem value="ADMIN OIC">ADMIN OIC</SelectItem>
//                           <SelectItem value="HR HEAD">HR HEAD</SelectItem>
//                           <SelectItem value="HR STAFF">HR STAFF</SelectItem>
//                           <SelectItem value="ACCOUNTING HEAD">
//                             ACCOUNTING HEAD
//                           </SelectItem>
//                           <SelectItem value="ACCOUNTING STAFF">
//                             ACCOUNTING STAFF
//                           </SelectItem>
//                           <SelectItem value="PAYROLL HEAD">
//                             PAYROLL HEAD
//                           </SelectItem>
//                           <SelectItem value="PAYROLL STAFF">
//                             PAYROLL STAFF
//                           </SelectItem>
//                           <SelectItem value="OPERATIONS MANAGER">
//                             OPERATIONS MANAGER
//                           </SelectItem>
//                           <SelectItem value="COORDINATOR">
//                             COORDINATOR
//                           </SelectItem>
//                           <SelectItem value="UTILITY">UTILITY</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Status (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="status"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Status</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="w-full">
//                             {" "}
//                             {/* 👈 Added w-full */}
//                             <SelectValue />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="PROBATIONARY">
//                             Probationary
//                           </SelectItem>
//                           <SelectItem value="REGULAR">Regular</SelectItem>
//                           <SelectItem value="CONTRACTUAL">
//                             Contractual
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Date Hired (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="dateHired"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Date Hired <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="date"
//                           {...field}
//                           className="block w-full"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           </TabsContent>

//           {/* TAB 3: GOVERNMENT */}
//           <TabsContent value="govt" className="space-y-4 py-4">
//             <div className="grid grid-cols-12 gap-4">
//               {/* SSS (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="sssNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>SSS Number</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="00-0000000-0"
//                           {...field}
//                           onChange={(e) =>
//                             field.onChange(handleFormat(e, "SSS"))
//                           }
//                           maxLength={12}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* PhilHealth (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="philHealthNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>PhilHealth Number</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="00-000000000-0"
//                           {...field}
//                           onChange={(e) =>
//                             field.onChange(handleFormat(e, "PHILHEALTH"))
//                           }
//                           maxLength={14}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Pag-IBIG (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="pagIbigNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Pag-IBIG / HDMF</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="0000-0000-0000"
//                           {...field}
//                           onChange={(e) =>
//                             field.onChange(handleFormat(e, "PAGIBIG"))
//                           }
//                           maxLength={14}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* TIN (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="tinNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>TIN (Tax ID)</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="000-000-000-000"
//                           {...field}
//                           onChange={(e) =>
//                             field.onChange(handleFormat(e, "TIN"))
//                           }
//                           maxLength={15}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <Separator className="col-span-12 my-2" />

//               {/* Bank Name (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="bankName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Bank Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="e.g. BDO" {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Account Number (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="bankAccountNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Account Number</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Account #" {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           </TabsContent>

//           {/* TAB 4: CONTACT & EMERGENCY */}
//           <TabsContent value="emergency" className="space-y-4 py-4">
//             <div className="grid grid-cols-12 gap-4">
//               {/* Address - FULL WIDTH (100%) */}
//               <div className="col-span-12">
//                 <FormField
//                   control={form.control}
//                   name="address"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Address</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Mobile Number (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="mobileNumber"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Mobile Number <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="09xxxxxxxxx"
//                           {...field}
//                           onChange={(e) =>
//                             field.onChange(handleFormat(e, "MOBILE"))
//                           }
//                           maxLength={11}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <Separator className="col-span-12 my-2" />

//               {/* Contact Name (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="emergencyContactName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Emergency Contact Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Contact Phone (50%) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="emergencyContactPhone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Emergency Contact Phone</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <Button type="button" variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isLoading}>
//             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
//             Create Record
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { createEmployee, getNextEmployeeId } from "@/src/actions/employees";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UploadButton } from "@/lib/uploadthing";

// --- 1. STRICT REGEX VALIDATION SCHEMA ---
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
    .min(11, "Mobile number must be 11 digits (09...)")
    .max(11, "Mobile number must be 11 digits (09...)")
    .regex(/^09\d{9}$/, "Must be a valid PH number (starts with 09)"),
  // Replace: address: z.string().optional(),
  address: z.string().min(1, "Address is required"),

  // Work
  employeeNo: z.string().min(1, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
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
  // Find this in your formSchema definition
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .min(11, "Mobile number must be 11 digits (09...)")
    .max(11, "Mobile number must be 11 digits (09...)")
    .regex(/^09\d{9}$/, "Must be a valid PH number (starts with 09)"),

  // --- NEW COMPENSATION FIELDS ---
  // We use z.coerce.number() and remove .optional() to ensure strict number types
  basicSalary: z.coerce.number().min(1, "Basic salary is required"),
  salaryType: z.enum(["DAILY", "MONTHLY"]),
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

  // Initialize Form (Removed generic <FormValues> to let TS infer types correctly)
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
      department: undefined,
      position: "",
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
      // New Fields Defaults
      basicSalary: 0,
      salaryType: "DAILY",
      allowance: 0,
    },
  });

  // Auto-generate ID on Mount
  useEffect(() => {
    const fetchId = async () => {
      setIsGeneratingId(true);
      try {
        const nextId = await getNextEmployeeId();
        if (nextId) {
          form.setValue("employeeNo", nextId, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      } catch (error) {
        console.error("Failed to generate ID:", error);
        toast.error("Could not auto-generate ID");
      } finally {
        setIsGeneratingId(false);
      }
    };

    if (!form.getValues("employeeNo")) {
      fetchId();
    }
  }, []);

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

  // Input Formatters
  const handleFormat = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "SSS" | "PHILHEALTH" | "PAGIBIG" | "TIN" | "MOBILE",
  ) => {
    let val = e.target.value.replace(/\D/g, "");
    let formatted = "";

    if (type === "SSS") {
      val = val.substring(0, 10);
      if (val.length > 2) formatted = `${val.slice(0, 2)}-${val.slice(2)}`;
      else formatted = val;
      if (val.length > 9)
        formatted = `${formatted.slice(0, 10)}-${formatted.slice(10)}`;
    } else if (type === "PHILHEALTH") {
      val = val.substring(0, 12);
      if (val.length > 2) formatted = `${val.slice(0, 2)}-${val.slice(2)}`;
      else formatted = val;
      if (val.length > 11)
        formatted = `${formatted.slice(0, 12)}-${formatted.slice(12)}`;
    } else if (type === "PAGIBIG") {
      val = val.substring(0, 12);
      if (val.length > 4) formatted = `${val.slice(0, 4)}-${val.slice(4)}`;
      else formatted = val;
      if (val.length > 8)
        formatted = `${formatted.slice(0, 9)}-${formatted.slice(9)}`;
    } else if (type === "TIN") {
      val = val.substring(0, 12);
      if (val.length > 3) formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
      else formatted = val;
      if (val.length > 6)
        formatted = `${formatted.slice(0, 7)}-${formatted.slice(7)}`;
      if (val.length > 9)
        formatted = `${formatted.slice(0, 11)}-${formatted.slice(11)}`;
    } else if (type === "MOBILE") {
      formatted = val.substring(0, 11);
    }

    return formatted;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // @ts-ignore - Ignoring strict type check for now to allow submission
      const result = await createEmployee(values);
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

          {/* TAB 2: WORK INFO */}
          <TabsContent value="work" className="space-y-4 py-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="employeeNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID *</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            value={
                              isGeneratingId ? "Generating..." : field.value
                            }
                            disabled={isGeneratingId}
                            className={
                              isGeneratingId
                                ? "text-muted-foreground animate-pulse"
                                : "font-mono font-bold"
                            }
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleRegenerateId}
                          disabled={isGeneratingId}
                        >
                          <RefreshCcw
                            className={`h-4 w-4 ${
                              isGeneratingId ? "animate-spin" : ""
                            }`}
                          />
                        </Button>
                      </div>
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
                      <FormLabel>Work Email *</FormLabel>
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
                      <FormLabel>Department *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Dept" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="FINANCE">FINANCE</SelectItem>
                          <SelectItem value="OPERATIONS">OPERATIONS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
                      <FormLabel>
                        Position <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IT STAFF">IT STAFF</SelectItem>
                          <SelectItem value="ADMIN OIC">ADMIN OIC</SelectItem>
                          <SelectItem value="HR HEAD">HR HEAD</SelectItem>
                          <SelectItem value="HR STAFF">HR STAFF</SelectItem>
                          <SelectItem value="ACCOUNTING HEAD">
                            ACCOUNTING HEAD
                          </SelectItem>
                          <SelectItem value="ACCOUNTING STAFF">
                            ACCOUNTING STAFF
                          </SelectItem>
                          <SelectItem value="PAYROLL HEAD">
                            PAYROLL HEAD
                          </SelectItem>
                          <SelectItem value="PAYROLL STAFF">
                            PAYROLL STAFF
                          </SelectItem>
                          <SelectItem value="OPERATIONS MANAGER">
                            OPERATIONS MANAGER
                          </SelectItem>
                          <SelectItem value="COORDINATOR">
                            COORDINATOR
                          </SelectItem>
                          <SelectItem value="HOUSEKEEPING UTILITY">
                            HOUSEKEEPING UTILITY
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormItem>
                      <FormLabel>Date Hired *</FormLabel>
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
            </div>

            <Separator className="my-4" />
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              Compensation
            </h4>

            {/* --- NEW COMPENSATION SECTION --- */}
            <div className="grid grid-cols-3 gap-4">
              {/* 1. Salary Type */}
              <div className="col-span-3 md:col-span-1">
                <FormField
                  control={form.control}
                  name="salaryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        // Cast value to string to satisfy TypeScript
                        defaultValue={field.value as string}
                        value={field.value as string}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DAILY">Daily Rate</SelectItem>
                          <SelectItem value="MONTHLY">
                            Monthly Salary
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
                      <FormLabel>Basic Amount (₱)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          // Cast value to number to satisfy TypeScript
                          value={field.value as number}
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
                      <FormLabel>Allowance</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          // Cast value to number to satisfy TypeScript
                          value={field.value as number}
                        />
                      </FormControl>
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
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Create Record
          </Button>
        </div>
      </form>
    </Form>
  );
}
