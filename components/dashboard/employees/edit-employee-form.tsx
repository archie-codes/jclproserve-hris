// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import { Loader2, User } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// // 👇 Reuse your Upload Button
// import { UploadButton } from "@/lib/uploadthing";
// // 👇 Import your Server Action (Ensure it handles the Object, not FormData)
// import { updateEmployee } from "@/src/actions/employees";

// // --- VALIDATION SCHEMA (Matches Create Form) ---
// const formSchema = z.object({
//   firstName: z.string().min(1, "First name is required"),
//   middleName: z.string().optional(),
//   lastName: z.string().min(1, "Last name is required"),
//   suffix: z.string().optional(),
//   dateOfBirth: z.string().min(1, "Birth date is required"),
//   gender: z.string().optional(),
//   civilStatus: z.string().optional(),
//   imageUrl: z.string().optional(),

//   employeeNo: z.string().min(1, "Employee ID is required"),
//   status: z.string().min(1, "Status is required"),
//   department: z.string().min(1, "Department is required"),
//   position: z.string().min(1, "Position is required"),
//   dateHired: z.string().min(1, "Date hired is required"),
//   email: z.string().email("Invalid email").optional().or(z.literal("")),

//   sssNo: z.string().optional(),
//   philHealthNo: z.string().optional(),
//   pagIbigNo: z.string().optional(),
//   tinNo: z.string().optional(),
//   bankName: z.string().optional(),
//   bankAccountNo: z.string().optional(),

//   address: z.string().optional(),
//   mobileNumber: z.string().optional(),
//   emergencyContactName: z.string().optional(),
//   emergencyContactPhone: z.string().optional(),
// });

// type FormValues = z.infer<typeof formSchema>;

// export function EditEmployeeForm({
//   employee,
//   onSuccess,
// }: {
//   employee: any; // Ideally replace 'any' with your Employee type
//   onSuccess: () => void;
// }) {
//   const [imagePreview, setImagePreview] = useState(employee.imageUrl || "");
//   const [isLoading, setIsLoading] = useState(false);

//   // --- HELPER: FORMAT DATE FOR INPUT (YYYY-MM-DD) ---
//   const formatDateForInput = (dateString: string | Date | null) => {
//     if (!dateString) return "";
//     return format(new Date(dateString), "yyyy-MM-dd");
//   };

//   // --- HELPER: AUTO-FORMAT GOVERNMENT IDS ---
//   const formatGovId = (
//     value: string,
//     type: "SSS" | "PHILHEALTH" | "PAGIBIG" | "TIN",
//   ) => {
//     // 1. Remove all non-digit characters
//     const clean = value.replace(/\D/g, "");

//     // 2. Format based on type
//     if (type === "SSS") {
//       // Format: XX-XXXXXXX-X (10 digits)
//       if (clean.length > 9)
//         return `${clean.slice(0, 2)}-${clean.slice(2, 9)}-${clean.slice(9, 10)}`;
//       if (clean.length > 2) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
//       return clean;
//     }

//     if (type === "PHILHEALTH") {
//       // Format: XX-XXXXXXXXX-X (12 digits)
//       if (clean.length > 11)
//         return `${clean.slice(0, 2)}-${clean.slice(2, 11)}-${clean.slice(11, 12)}`;
//       if (clean.length > 2) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
//       return clean;
//     }

//     if (type === "PAGIBIG") {
//       // Format: XXXX-XXXX-XXXX (12 digits)
//       if (clean.length > 8)
//         return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}`;
//       if (clean.length > 4) return `${clean.slice(0, 4)}-${clean.slice(4)}`;
//       return clean;
//     }

//     if (type === "TIN") {
//       // Format: XXX-XXX-XXX-XXX (9 to 12 digits)
//       if (clean.length > 9)
//         return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 9)}-${clean.slice(9, 12)}`;
//       if (clean.length > 6)
//         return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
//       if (clean.length > 3) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
//       return clean;
//     }

//     return clean;
//   };

//   // --- INITIALIZE FORM WITH EXISTING DATA ---
//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       firstName: employee.firstName || "",
//       lastName: employee.lastName || "",
//       middleName: employee.middleName || "",
//       suffix: employee.suffix || "",
//       dateOfBirth: formatDateForInput(employee.dateOfBirth),
//       gender: employee.gender || undefined,
//       civilStatus: employee.civilStatus || undefined,
//       imageUrl: employee.imageUrl || "",

//       employeeNo: employee.employeeNo || "",
//       status: employee.status || "PROBATIONARY",
//       department: employee.department || undefined,
//       position: employee.position || "",
//       dateHired: formatDateForInput(employee.dateHired),
//       email: employee.email || "",

//       sssNo: employee.sssNo || "",
//       philHealthNo: employee.philHealthNo || "",
//       pagIbigNo: employee.pagIbigNo || "",
//       tinNo: employee.tinNo || "",
//       bankName: employee.bankName || "",
//       bankAccountNo: employee.bankAccountNo || "",

//       address: employee.address || "",
//       mobileNumber: employee.mobileNumber || "",
//       emergencyContactName: employee.emergencyContactName || "",
//       emergencyContactPhone: employee.emergencyContactPhone || "",
//     },
//   });

//   async function onSubmit(data: FormValues) {
//     setIsLoading(true);
//     try {
//       // Pass the ID and the Data Object
//       const result = await updateEmployee(employee.id, data);

//       if (result.success) {
//         toast.success("Employee record updated successfully", {
//           position: "top-center",
//         });
//         onSuccess();
//       } else {
//         toast.error("Failed to update record", { position: "top-center" });
//       }
//     } catch (error) {
//       toast.error("Something went wrong", { position: "top-center" });
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // Helper for ID masks (Same as Create Form)
//   const handleFormat = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: "SSS" | "PHILHEALTH" | "PAGIBIG" | "TIN" | "MOBILE",
//   ) => {
//     let value = e.target.value.replace(/\D/g, "");
//     // ... (You can copy the same mask logic from CreateEmployeeForm here if you want live formatting)
//     return value;
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <Tabs defaultValue="personal" className="w-full">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="personal">Personal</TabsTrigger>
//             <TabsTrigger value="work">Work</TabsTrigger>
//             <TabsTrigger value="govt">Govt</TabsTrigger>
//             <TabsTrigger value="emergency">Contact</TabsTrigger>
//           </TabsList>

//           {/* --- PERSONAL TAB --- */}
//           <TabsContent value="personal" className="space-y-4 py-4">
//             {/* IMAGE UPLOAD SECTION */}
//             <div className="flex flex-row items-center gap-6 p-4 border rounded-xl bg-muted/30">
//               <div className="relative">
//                 <Avatar className="h-16 w-16 border-2 border-muted shadow-sm overflow-hidden">
//                   {/* 👇 FIX: Only render AvatarImage if there is a valid URL */}
//                   {imagePreview ? (
//                     <AvatarImage
//                       src={imagePreview}
//                       className="object-cover h-full w-full"
//                     />
//                   ) : null}

//                   {/* Fallback shows automatically if the image above is not rendered */}
//                   <AvatarFallback className="bg-muted flex items-center justify-center w-full h-full">
//                     <User className="h-6 w-6 opacity-50" />
//                   </AvatarFallback>
//                 </Avatar>
//               </div>
//               <div className="flex-1 space-y-1">
//                 <p className="text-sm font-medium">Profile Photo</p>
//                 <div className="flex items-center gap-2">
//                   <div className="h-8">
//                     <UploadButton
//                       endpoint="employeeImage"
//                       onClientUploadComplete={(res: { url: string }[]) => {
//                         if (res && res[0]) {
//                           const url = res[0].url;
//                           form.setValue("imageUrl", url);
//                           setImagePreview(url);
//                           toast.success(
//                             "Photo updated. Do not forget to save changes.",
//                             {
//                               position: "top-center",
//                             },
//                           );
//                         }
//                       }}
//                       onUploadError={(error: Error) => {
//                         toast.error(`Upload failed: ${error.message}`);
//                       }}
//                       // 👇 UPDATED APPEARANCE to match the User Form style
//                       appearance={{
//                         button:
//                           "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md shadow-sm transition-colors text-sm font-medium",
//                         container: "w-max",
//                         allowedContent: "hidden", // We hide the "Images up to 4MB" text to keep it clean, or remove this line to show it
//                       }}
//                       // 👇 REMOVED the 'content' prop so it shows the default percentage/loading state
//                     />
//                   </div>
//                   {imagePreview && (
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="h-8 text-xs text-red-500"
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

//             {/* PERSONAL FIELDS GRID */}
//             <div className="grid grid-cols-12 gap-4">
//               {/* First Name */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>First Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               {/* Last Name */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Last Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               {/* Middle */}
//               <div className="col-span-12 md:col-span-9">
//                 <FormField
//                   control={form.control}
//                   name="middleName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Middle Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               {/* Suffix */}
//               <div className="col-span-12 md:col-span-3">
//                 <FormField
//                   control={form.control}
//                   name="suffix"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Suffix</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               {/* DOB */}
//               <div className="col-span-12 md:col-span-4">
//                 <FormField
//                   control={form.control}
//                   name="dateOfBirth"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Date of Birth</FormLabel>
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
//               {/* Gender */}
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
//               {/* Civil Status */}
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
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="SINGLE">Single</SelectItem>
//                           <SelectItem value="MARRIED">Married</SelectItem>
//                           <SelectItem value="WIDOWED">Widowed</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           </TabsContent>

//           {/* --- WORK TAB --- */}
//           <TabsContent value="work" className="space-y-4 py-4">
//             <div className="grid grid-cols-12 gap-4">
//               {/* Employee ID (Read Only usually, but editable here if needed) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="employeeNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Employee ID</FormLabel>
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
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Work Email</FormLabel>
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
//                   name="department"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Department</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="IT">IT</SelectItem>
//                           <SelectItem value="HR">HR</SelectItem>
//                           <SelectItem value="FINANCE">Finance</SelectItem>
//                           <SelectItem value="OPERATIONS">Operations</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormItem>
//                   )}
//                 />
//               </div>
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
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="dateHired"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Date Hired</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="date"
//                           {...field}
//                           className="block w-full"
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           </TabsContent>

//           {/* --- GOVT TAB --- */}
//           <TabsContent value="govt" className="space-y-4 py-4">
//             <div className="grid grid-cols-12 gap-4">
//               {/* SSS (XX-XXXXXXX-X) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="sssNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>SSS Number</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="00-0000000-0"
//                           maxLength={12}
//                           onChange={(e) =>
//                             field.onChange(formatGovId(e.target.value, "SSS"))
//                           }
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* PhilHealth (XX-XXXXXXXXX-X) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="philHealthNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>PhilHealth</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="00-000000000-0"
//                           maxLength={14}
//                           onChange={(e) =>
//                             field.onChange(
//                               formatGovId(e.target.value, "PHILHEALTH"),
//                             )
//                           }
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Pag-IBIG (XXXX-XXXX-XXXX) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="pagIbigNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Pag-IBIG</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="0000-0000-0000"
//                           maxLength={14}
//                           onChange={(e) =>
//                             field.onChange(
//                               formatGovId(e.target.value, "PAGIBIG"),
//                             )
//                           }
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* TIN (XXX-XXX-XXX-XXX) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="tinNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>TIN</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="000-000-000-000"
//                           maxLength={15}
//                           onChange={(e) =>
//                             field.onChange(formatGovId(e.target.value, "TIN"))
//                           }
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <Separator className="col-span-12 my-2" />

//               {/* Bank Info (No formatting enforced, just text) */}
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="bankName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Bank Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder="e.g. BDO / BPI" />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="bankAccountNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Account Number</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           </TabsContent>

//           {/* --- CONTACT TAB --- */}
//           <TabsContent value="emergency" className="space-y-4 py-4">
//             <div className="grid grid-cols-12 gap-4">
//               <div className="col-span-12">
//                 <FormField
//                   control={form.control}
//                   name="address"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Full Address</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="mobileNumber"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Mobile Number</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <Separator className="col-span-12 my-2" />
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="emergencyContactName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Emergency Contact</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="col-span-12 md:col-span-6">
//                 <FormField
//                   control={form.control}
//                   name="emergencyContactPhone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Emergency Phone</FormLabel>
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

//         {/* --- FOOTER BUTTONS --- */}
//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
//               </>
//             ) : (
//               "Save Changes"
//             )}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }


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

import { UploadButton } from "@/lib/uploadthing";
import { updateEmployee } from "@/src/actions/employees";

// --- VALIDATION SCHEMA (Matches Create Form) ---
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
  mobileNumber: z.string().min(11, "Mobile number must be 11 digits"),
  address: z.string().optional(),

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
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // --- COMPENSATION FIELDS ---
  basicSalary: z.coerce.number().min(1, "Basic salary is required"),
  salaryType: z.enum(["DAILY", "MONTHLY"]),
  allowance: z.coerce.number().default(0),
});

export function EditEmployeeForm({
  employee,
  onSuccess,
}: {
  employee: any;
  onSuccess: () => void;
}) {
  const [imagePreview, setImagePreview] = useState(employee.imageUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  // --- HELPER: FORMAT DATE FOR INPUT (YYYY-MM-DD) ---
  const formatDateForInput = (dateString: string | Date | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  // --- INITIALIZE FORM ---
  // Removed <FormValues> generic to allow Zod coercion to work without type errors
  const form = useForm({
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

      // --- NEW FIELDS (Convert Cents to Decimal) ---
      basicSalary: employee.basicSalary ? employee.basicSalary / 100 : 0,
      salaryType: employee.salaryType || "DAILY",
      allowance: employee.allowance ? employee.allowance / 100 : 0,
    },
  });

  // --- INPUT FORMATTERS (Auto-add dashes) ---
  const handleFormat = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "SSS" | "PHILHEALTH" | "PAGIBIG" | "TIN" | "MOBILE"
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // @ts-ignore
      const result = await updateEmployee(employee.id, data);

      if (result.success) {
        toast.success("Employee record updated successfully", { position: "top-center" });
        onSuccess();
      } else {
        toast.error("Failed to update record", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Something went wrong", { position: "top-center" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

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
                <Avatar className="h-16 w-16 border-2 border-muted shadow-sm overflow-hidden">
                  {imagePreview ? (
                    <AvatarImage
                      src={imagePreview}
                      className="object-cover h-full w-full"
                    />
                  ) : null}
                  <AvatarFallback className="bg-muted flex items-center justify-center w-full h-full">
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
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          const url = res[0].url;
                          form.setValue("imageUrl", url);
                          setImagePreview(url);
                          toast.success("Photo updated");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`);
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
              <div className="col-span-12 md:col-span-9">
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
              <div className="col-span-12 md:col-span-3">
                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffix</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
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

          {/* --- WORK TAB --- */}
          <TabsContent value="work" className="space-y-4 py-4">
            <div className="grid grid-cols-12 gap-4">
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
                          <SelectTrigger className="w-full">
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
                          <SelectItem value="ACCOUNTING HEAD">ACCOUNTING HEAD</SelectItem>
                          <SelectItem value="ACCOUNTING STAFF">ACCOUNTING STAFF</SelectItem>
                          <SelectItem value="PAYROLL HEAD">PAYROLL HEAD</SelectItem>
                          <SelectItem value="PAYROLL STAFF">PAYROLL STAFF</SelectItem>
                          <SelectItem value="OPERATIONS MANAGER">OPERATIONS MANAGER</SelectItem>
                          <SelectItem value="COORDINATOR">COORDINATOR</SelectItem>
                          <SelectItem value="UTILITY">UTILITY</SelectItem>
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
                          <SelectItem value="MONTHLY">Monthly Salary</SelectItem>
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
                          value={field.value as number}
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
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="sssNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSS Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="00-0000000-0"
                          maxLength={12}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "SSS"))
                          }
                        />
                      </FormControl>
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
                      <FormLabel>PhilHealth</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="00-000000000-0"
                          maxLength={14}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "PHILHEALTH"))
                          }
                        />
                      </FormControl>
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
                      <FormLabel>Pag-IBIG</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0000-0000-0000"
                          maxLength={14}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "PAGIBIG"))
                          }
                        />
                      </FormControl>
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
                      <FormLabel>TIN</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="000-000-000-000"
                          maxLength={15}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "TIN"))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. BDO / BPI" />
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
                        <Input
                          {...field}
                          maxLength={11}
                          onChange={(e) =>
                            field.onChange(handleFormat(e, "MOBILE"))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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