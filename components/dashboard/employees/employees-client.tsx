// "use client";

// import { useState, useMemo, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Briefcase,
//   Building2,
//   CheckCircle2,
//   Eye,
//   FileClock,
//   Filter,
//   LayoutGrid,
//   Loader2,
//   MoreHorizontal,
//   Pencil,
//   Plus,
//   Search,
//   Timer,
//   Trash2,
//   Users,
//   X,
// } from "lucide-react";
// import { toast } from "sonner";
// import Link from "next/link";

// import { deleteEmployee } from "@/src/actions/employees";
// import { CreateEmployeeModal } from "@/components/dashboard/modals/create-employee-modal";
// import { EditEmployeeModal } from "@/components/dashboard/modals/edit-employee-modal";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useRouter, useSearchParams } from "next/navigation";

// type Employee = {
//   id: string;
//   firstName: string;
//   middleName: string | null;
//   lastName: string;
//   employeeNo: string;
//   department: string | null;
//   position: string | null;
//   status: string;
//   imageUrl: string | null;
// };

// export function EmployeesClient({ data }: { data: Employee[] }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

//   // --- FILTERS STATE ---
//   const [searchQuery, setSearchQuery] = useState("");
//   const [deptFilter, setDeptFilter] = useState<string | "ALL">("ALL");
//   const [statusFilter, setStatusFilter] = useState<string | "ALL">("ALL");

//   const [isDeleting, setIsDeleting] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // Handle URL params for "New Employee" modal
//   useEffect(() => {
//     if (searchParams.get("new") === "true") {
//       setIsModalOpen(true);
//       router.replace("/dashboard/employees");
//     }
//   }, [searchParams, router]);

//   // 1. STATS LOGIC
//   const stats = useMemo(() => {
//     const total = data.length;
//     const active = data.filter((e) => e.status === "ACTIVE" || e.status === "REGULAR").length;
//     const probationary = data.filter((e) => e.status === "PROBATIONARY").length;
//     const contractual = data.filter((e) => e.status === "CONTRACTUAL" || e.status === "PROJECT_BASED").length;
//     const departments = new Set(data.map((e) => e.department).filter(Boolean)).size;

//     return { total, active, probationary, contractual, departments };
//   }, [data]);

//   // 2. EXTRACT UNIQUE DEPARTMENTS (For Filter Dropdown)
//   const uniqueDepartments = useMemo(() => {
//     const depts = new Set(data.map((e) => e.department).filter(Boolean) as string[]);
//     return Array.from(depts).sort();
//   }, [data]);

//   // 3. FILTERING LOGIC (Search + Dropdowns)
//   const filteredData = useMemo(() => {
//     return data.filter((employee) => {
//       // A. Search Query
//       const query = searchQuery.toLowerCase();
//       const fullName = `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`.toLowerCase();
//       const matchesSearch =
//         fullName.includes(query) ||
//         employee.employeeNo.toLowerCase().includes(query) ||
//         (employee.department && employee.department.toLowerCase().includes(query));

//       // B. Department Filter
//       const matchesDept = deptFilter === "ALL" || employee.department === deptFilter;

//       // C. Status Filter
//       const matchesStatus = statusFilter === "ALL" || employee.status === statusFilter;

//       return matchesSearch && matchesDept && matchesStatus;
//     });
//   }, [data, searchQuery, deptFilter, statusFilter]);

//   // --- ACTIONS ---
//   const promptDelete = (employee: Employee) => {
//     setSelectedEmployee(employee);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!selectedEmployee) return;
//     setIsDeleting(true);
//     try {
//       const result = await deleteEmployee(selectedEmployee.id);
//       if (result.success) {
//         toast.success("Employee record removed", { position: "top-center" });
//         setDeleteDialogOpen(false);
//       } else {
//         toast.error("Could not delete employee" , { position: "top-center" });//
//       }
//     } catch {
//       toast.error("An unexpected error occurred", { position: "top-center" });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const clearFilters = () => {
//     setSearchQuery("");
//     setDeptFilter("ALL");
//     setStatusFilter("ALL");
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">

//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">Employees</h1>
//           <p className="text-muted-foreground">Manage workforce, departments, and roles.</p>
//         </div>
//         <Button onClick={() => setIsModalOpen(true)} className="shadow-lg hover:shadow-xl transition-all">
//           <Plus className="mr-2 h-4 w-4" /> Add New
//         </Button>
//       </div>

//       {/* STATS CARDS */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//         <StatsCard title="Total Employees" value={stats.total} icon={<Users className="h-4 w-4 text-blue-600" />} bg="bg-blue-100 dark:bg-blue-900/30" />
//         <StatsCard title="Regular" value={stats.active} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} bg="bg-emerald-100 dark:bg-emerald-900/30" />
//         <StatsCard title="Probationary" value={stats.probationary} icon={<Timer className="h-4 w-4 text-amber-600" />} bg="bg-amber-100 dark:bg-amber-900/30" />
//         <StatsCard title="Contractual" value={stats.contractual} icon={<FileClock className="h-4 w-4 text-orange-600" />} bg="bg-orange-100 dark:bg-orange-900/30" />
//         <StatsCard title="Departments" value={stats.departments} icon={<Building2 className="h-4 w-4 text-purple-600" />} bg="bg-purple-100 dark:bg-purple-900/30" />
//       </div>

//       {/* MAIN TABLE */}
//       <Card className="border-muted/60 shadow-sm overflow-hidden bg-card">

//         {/* --- TOOLBAR SECTION (Search + Filters) --- */}
//         <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border/50 bg-muted/20">

//           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
//             {/* Search Input */}
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search employees..."
//                 className="pl-9 bg-background"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             {/* Department Filter */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="h-10 border-dashed">
//                   <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
//                   Department
//                   {deptFilter !== "ALL" && (
//                     <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-[10px]">
//                       {deptFilter}
//                     </Badge>
//                   )}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-48">
//                 <DropdownMenuLabel>Filter by Dept</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuCheckboxItem checked={deptFilter === "ALL"} onCheckedChange={() => setDeptFilter("ALL")}>
//                   All Departments
//                 </DropdownMenuCheckboxItem>
//                 {uniqueDepartments.map((dept) => (
//                   <DropdownMenuCheckboxItem
//                     key={dept}
//                     checked={deptFilter === dept}
//                     onCheckedChange={() => setDeptFilter(dept)}
//                   >
//                     {dept}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Status Filter */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="h-10 border-dashed">
//                   <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
//                   Status
//                   {statusFilter !== "ALL" && (
//                     <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-[10px]">
//                       {statusFilter}
//                     </Badge>
//                   )}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-48">
//                 <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuCheckboxItem checked={statusFilter === "ALL"} onCheckedChange={() => setStatusFilter("ALL")}>
//                   All Statuses
//                 </DropdownMenuCheckboxItem>
//                 {["PROBATIONARY", "REGULAR", "CONTRACTUAL", "RESIGNED"].map((st) => (
//                   <DropdownMenuCheckboxItem
//                     key={st}
//                     checked={statusFilter === st}
//                     onCheckedChange={() => setStatusFilter(st)}
//                   >
//                     {st}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Clear Filters Button (Only shows if filters are active) */}
//             {(searchQuery || deptFilter !== "ALL" || statusFilter !== "ALL") && (
//               <Button variant="ghost" onClick={clearFilters} size="sm" className="h-10 px-2 lg:px-3 text-muted-foreground">
//                 <X className="mr-2 h-4 w-4" /> Reset
//               </Button>
//             )}
//           </div>

//           <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
//             <LayoutGrid className="h-4 w-4" />
//             <span className="hidden sm:inline">Showing</span>
//             <strong className="text-foreground">{filteredData.length}</strong>
//             <span className="hidden sm:inline">records</span>
//           </div>
//         </div>

//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-muted/40">
//               <TableRow className="hover:bg-transparent">
//                 <TableHead className="w-25 text-xs font-semibold uppercase tracking-wider">ID</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider">Employee</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Department</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Position</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
//                 <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredData.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="h-64 text-center">
//                     <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
//                       <div className="bg-muted/50 p-4 rounded-full">
//                         <Search className="h-8 w-8 opacity-50" />
//                       </div>
//                       <p className="font-medium text-lg">No matches found</p>
//                       <p className="text-sm">Try adjusting your filters or search query.</p>
//                       <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredData.map((employee) => (
//                   <TableRow key={employee.id} className="group hover:bg-muted/30 transition-colors cursor-pointer">
//                     <TableCell className="font-mono text-xs text-muted-foreground">{employee.employeeNo}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-9 w-9 rounded-full border border-muted/50">
//                           {employee.imageUrl && <AvatarImage src={employee.imageUrl} className="object-cover" />}
//                           <AvatarFallback className="text-xs">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
//                         </Avatar>
//                         <div className="flex flex-col">
//                           <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
//                             {employee.firstName} {employee.lastName}
//                           </span>
//                           <span className="text-xs text-muted-foreground sm:hidden">{employee.position}</span>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell">
//                       {employee.department ? (
//                         <Badge variant="outline" className="font-normal text-muted-foreground bg-muted/20">
//                           {employee.department}
//                         </Badge>
//                       ) : "—"}
//                     </TableCell>
//                     <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{employee.position || "—"}</TableCell>
//                     <TableCell>
//                       <StatusBadge status={employee.status} />
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                           <DropdownMenuItem asChild>
//                             <Link href={`/dashboard/employees/${employee.id}`}><Eye className="mr-2 h-4 w-4" /> View</Link>
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => { setSelectedEmployee(employee); setEditOpen(true); }}>
//                             <Pencil className="mr-2 h-4 w-4" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem className="text-red-600" onClick={() => promptDelete(employee)}>
//                             <Trash2 className="mr-2 h-4 w-4" /> Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* MODALS */}
//       <CreateEmployeeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
//       <EditEmployeeModal open={editOpen} onOpenChange={setEditOpen} employee={selectedEmployee} />

//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-red-600 flex items-center gap-2"><Trash2 className="h-5 w-5" /> Confirm Deletion</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete <strong>{selectedEmployee?.firstName} {selectedEmployee?.lastName}</strong>?
//               <br /><br />
//               <span className="bg-red-50 text-red-600 p-2 rounded block text-sm border border-red-100">
//                 ⚠️ This action cannot be undone.
//               </span>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 text-white" disabled={isDeleting}>
//               {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// // --- SUB-COMPONENTS ---

// function StatsCard({ title, value, icon, bg }: { title: string; value: number; icon: React.ReactNode; bg: string }) {
//   return (
//     <Card className="bg-card shadow-sm border-muted/60">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
//         <div className={`h-8 w-8 rounded-full flex items-center justify-center ${bg}`}>{icon}</div>
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold text-foreground">{value}</div>
//       </CardContent>
//     </Card>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const styles = {
//     ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
//     REGULAR: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
//     PROBATIONARY: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
//     CONTRACTUAL: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
//     RESIGNED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
//   }[status] || "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400";

//   return (
//     <Badge variant="secondary" className={`font-medium border ${styles}`}>
//       {status}
//     </Badge>
//   );
// }
// "use client";

// import { useState, useMemo, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Briefcase,
//   Building2,
//   CheckCircle2,
//   Eye,
//   FileClock,
//   Filter,
//   LayoutGrid,
//   Loader2,
//   MoreHorizontal,
//   Pencil,
//   Plus,
//   Search,
//   Timer,
//   Trash2,
//   Users,
//   X,
//   UserX,
// } from "lucide-react";
// import { toast } from "sonner";
// import Link from "next/link";

// import { deleteEmployee, updateEmployee } from "@/src/actions/employees";
// import { CreateEmployeeModal } from "@/components/dashboard/modals/create-employee-modal";
// import { EditEmployeeModal } from "@/components/dashboard/modals/edit-employee-modal";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useRouter, useSearchParams } from "next/navigation";

// type Employee = {
//   id: string;
//   firstName: string;
//   middleName: string | null;
//   lastName: string;
//   suffix: string | null;
//   employeeNo: string;
//   department: string | null;
//   position: string | null;
//   dateResigned: string | null;
//   status: string;
//   imageUrl: string | null;
//   email: string;
//   dateOfBirth: string | null;
//   dateHired: string | null;
//   salaryType: string | null;
//   basicSalary: number | null;
//   allowance: number | null;
//   sssNo?: string | null;
//   philHealthNo?: string | null;
//   pagIbigNo?: string | null;
//   tinNo?: string | null;
//   bankName?: string | null;
//   bankAccountNo?: string | null;
//   address?: string | null;
//   mobileNumber?: string | null;
//   emergencyContactName?: string | null;
//   emergencyContactPhone?: string | null;
// };

// interface EmployeesClientProps {
//   data: Employee[];
//   userRole: string;
// }

// export function EmployeesClient({ data, userRole }: EmployeesClientProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

//   // Track if we are Resigning or Deleting
//   const [actionMode, setActionMode] = useState<"DELETE" | "RESIGN">("RESIGN");

//   const [searchQuery, setSearchQuery] = useState("");
//   const [deptFilter, setDeptFilter] = useState<string | "ALL">("ALL");
//   const [statusFilter, setStatusFilter] = useState<string | "ALL">("ALL");

//   const [isProcessing, setIsProcessing] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     if (searchParams.get("new") === "true") {
//       setIsModalOpen(true);
//       router.replace("/dashboard/employees");
//     }
//   }, [searchParams, router]);

//   const stats = useMemo(() => {
//     const total = data.length;
//     const active = data.filter((e) => e.status === "REGULAR").length;
//     const probationary = data.filter((e) => e.status === "PROBATIONARY").length;
//     const resigned = data.filter((e) => e.status === "RESIGNED").length;
//     const departments = new Set(data.map((e) => e.department).filter(Boolean)).size;

//     return { total, active, probationary, resigned, departments };
//   }, [data]);

//   const uniqueDepartments = useMemo(() => {
//     const depts = new Set(data.map((e) => e.department).filter(Boolean) as string[]);
//     return Array.from(depts).sort();
//   }, [data]);

//   const filteredData = useMemo(() => {
//     return data.filter((employee) => {
//       const query = searchQuery.toLowerCase();
//       const fullName = `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`.toLowerCase();
//       const matchesSearch =
//         fullName.includes(query) ||
//         employee.employeeNo.toLowerCase().includes(query) ||
//         (employee.department && employee.department.toLowerCase().includes(query));

//       const matchesDept = deptFilter === "ALL" || employee.department === deptFilter;
//       const matchesStatus = statusFilter === "ALL" || employee.status === statusFilter;

//       return matchesSearch && matchesDept && matchesStatus;
//     });
//   }, [data, searchQuery, deptFilter, statusFilter]);

//   const handleAction = async () => {
//     if (!selectedEmployee) return;
//     setIsProcessing(true);

//     try {
//       if (actionMode === "DELETE") {
//         // PERMANENT DELETE (Admin Only)
//         const result = await deleteEmployee(selectedEmployee.id);
//         if (result.success) toast.success("Record permanently removed", { position: "top-center" });
//         else toast.error(result.error);
//       } else {
//         // MARK AS RESIGNED (Admin & HR)
//         const payload = {
//           firstName: selectedEmployee.firstName,
//           lastName: selectedEmployee.lastName,
//           middleName: selectedEmployee.middleName ?? undefined,
//           suffix: selectedEmployee.suffix ?? undefined,
//           employeeNo: selectedEmployee.employeeNo,
//           status: "RESIGNED",
//           dateResigned: new Date().toISOString(),
//           department: selectedEmployee.department ?? "",
//           position: selectedEmployee.position ?? "",
//           dateOfBirth: selectedEmployee.dateOfBirth ?? "",
//           dateHired: selectedEmployee.dateHired ?? "",
//           email: selectedEmployee.email,
//           basicSalary: (selectedEmployee.basicSalary ?? 0) / 100,
//           allowance: (selectedEmployee.allowance ?? 0) / 100,
//           salaryType: selectedEmployee.salaryType ?? "MONTHLY",
//           sssNo: selectedEmployee.sssNo ?? undefined,
//           philHealthNo: selectedEmployee.philHealthNo ?? undefined,
//           pagIbigNo: selectedEmployee.pagIbigNo ?? undefined,
//           tinNo: selectedEmployee.tinNo ?? undefined,
//           bankName: selectedEmployee.bankName ?? undefined,
//           bankAccountNo: selectedEmployee.bankAccountNo ?? undefined,
//           address: selectedEmployee.address ?? undefined,
//           mobileNumber: selectedEmployee.mobileNumber ?? undefined,
//           emergencyContactName: selectedEmployee.emergencyContactName ?? undefined,
//           emergencyContactPhone: selectedEmployee.emergencyContactPhone ?? undefined,
//           imageUrl: selectedEmployee.imageUrl ?? undefined,
//         };
//         const result = await updateEmployee(selectedEmployee.id, payload as any);
//         if (result.success) toast.success("Employee marked as RESIGNED", { position: "top-center" });
//         else toast.error("Could not update status");
//       }
//       setDeleteDialogOpen(false);
//     } catch (error) {
//       toast.error("An unexpected error occurred", { position: "top-center" });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const clearFilters = () => {
//     setSearchQuery("");
//     setDeptFilter("ALL");
//     setStatusFilter("ALL");
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">Employees</h1>
//           <p className="text-muted-foreground">Manage workforce, departments, and roles.</p>
//         </div>
//         <Button onClick={() => setIsModalOpen(true)} className="shadow-lg hover:shadow-xl transition-all">
//           <Plus className="mr-2 h-4 w-4" /> Add New
//         </Button>
//       </div>

//       {/* STATS CARDS */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//         <StatsCard title="Total Staff" value={stats.total} icon={<Users className="h-4 w-4 text-blue-600" />} bg="bg-blue-100 dark:bg-blue-900/30" />
//         <StatsCard title="Regular" value={stats.active} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} bg="bg-emerald-100 dark:bg-emerald-900/30" />
//         <StatsCard title="Probationary" value={stats.probationary} icon={<Timer className="h-4 w-4 text-amber-600" />} bg="bg-amber-100 dark:bg-amber-900/30" />
//         <StatsCard title="Resigned" value={stats.resigned} icon={<UserX className="h-4 w-4 text-red-600" />} bg="bg-red-100 dark:bg-red-900/30" />
//         <StatsCard title="Units" value={stats.departments} icon={<Building2 className="h-4 w-4 text-purple-600" />} bg="bg-purple-100 dark:bg-purple-900/30" />
//       </div>

//       <Card className="border-muted/60 shadow-sm overflow-hidden bg-card">
//         <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border/50 bg-muted/20">
//           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search employees..."
//                 className="pl-9 bg-background"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="h-10 border-dashed">
//                   <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
//                   Department {deptFilter !== "ALL" && <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-[10px]">{deptFilter}</Badge>}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-48">
//                 <DropdownMenuLabel>Filter by Dept</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuCheckboxItem checked={deptFilter === "ALL"} onCheckedChange={() => setDeptFilter("ALL")}>All</DropdownMenuCheckboxItem>
//                 {uniqueDepartments.map((dept) => (
//                   <DropdownMenuCheckboxItem key={dept} checked={deptFilter === dept} onCheckedChange={() => setDeptFilter(dept)}>{dept}</DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="h-10 border-dashed">
//                   <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
//                   Status {statusFilter !== "ALL" && <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-[10px]">{statusFilter}</Badge>}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-48">
//                 <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuCheckboxItem checked={statusFilter === "ALL"} onCheckedChange={() => setStatusFilter("ALL")}>All</DropdownMenuCheckboxItem>
//                 {["PROBATIONARY", "REGULAR", "CONTRACTUAL", "RESIGNED"].map((st) => (
//                   <DropdownMenuCheckboxItem key={st} checked={statusFilter === st} onCheckedChange={() => setStatusFilter(st)}>{st}</DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {(searchQuery || deptFilter !== "ALL" || statusFilter !== "ALL") && (
//               <Button variant="ghost" onClick={clearFilters} size="sm" className="h-10 px-2 text-muted-foreground">
//                 <X className="mr-2 h-4 w-4" /> Reset
//               </Button>
//             )}
//           </div>
//           <div className="text-sm text-muted-foreground font-medium">
//              Showing <span className="text-foreground">{filteredData.length}</span> records
//           </div>
//         </div>

//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-muted/40">
//               <TableRow>
//                 <TableHead className="w-25 text-xs font-semibold uppercase">ID</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase">Employee</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase hidden md:table-cell">Department</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase hidden sm:table-cell">Position</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase">Status</TableHead>
//                 <TableHead className="text-right text-xs font-semibold uppercase">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredData.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="h-64 text-center">
//                     <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
//                       <Search className="h-8 w-8 opacity-20" />
//                       <p className="font-medium text-lg">No matches found</p>
//                       <Button variant="link" onClick={clearFilters}>Clear filters</Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredData.map((employee) => (
//                   <TableRow key={employee.id} className="group hover:bg-muted/30 transition-colors">
//                     <TableCell className="font-mono text-xs text-muted-foreground">{employee.employeeNo}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-9 w-9 rounded-full border border-muted/50">
//                           {employee.imageUrl && <AvatarImage src={employee.imageUrl} className="object-cover" />}
//                           <AvatarFallback className="text-xs">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
//                         </Avatar>
//                         <div className="flex flex-col">
//                           <span className="font-medium text-sm text-foreground">{employee.firstName} {employee.lastName}</span>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell">
//                       {employee.department ? <Badge variant="outline" className="font-normal bg-muted/20">{employee.department}</Badge> : "—"}
//                     </TableCell>
//                     <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{employee.position || "—"}</TableCell>
//                     <TableCell>
//                       <div className="flex flex-col">
//                         <StatusBadge status={employee.status} />
//                         {employee.status === "RESIGNED" && employee.dateResigned && (
//                           <span className="text-[10px] text-muted-foreground mt-1">
//                             Left: {new Date(employee.dateResigned).toLocaleDateString()}
//                           </span>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                           <DropdownMenuItem asChild>
//                             <Link href={`/dashboard/employees/${employee.id}`}><Eye className="mr-2 h-4 w-4" /> View</Link>
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => { setSelectedEmployee(employee); setEditOpen(true); }}>
//                             <Pencil className="mr-2 h-4 w-4" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />

//                           {/* Resign Option - Available to all */}
//                           <DropdownMenuItem
//                             className="text-amber-600"
//                             onClick={() => {
//                               setSelectedEmployee(employee);
//                               setActionMode("RESIGN");
//                               setDeleteDialogOpen(true);
//                             }}
//                           >
//                             <UserX className="mr-2 h-4 w-4" /> Mark Resigned
//                           </DropdownMenuItem>

//                           {/* Delete Option - Admin Only */}
//                           {userRole === "ADMIN" && (
//                             <DropdownMenuItem
//                               className="text-red-600 font-medium"
//                               onClick={() => {
//                                 setSelectedEmployee(employee);
//                                 setActionMode("DELETE");
//                                 setDeleteDialogOpen(true);
//                               }}
//                             >
//                               <Trash2 className="mr-2 h-4 w-4" /> Permanent Delete
//                             </DropdownMenuItem>
//                           )}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <CreateEmployeeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
//       {selectedEmployee && <EditEmployeeModal open={editOpen} onOpenChange={setEditOpen} employee={selectedEmployee} />}

//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className={actionMode === "DELETE" ? "text-red-600" : "text-amber-600"}>
//               {actionMode === "DELETE" ? "Confirm Permanent Deletion" : "Confirm Resignation"}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {actionMode === "DELETE" ? (
//                 <>Warning: You are about to permanently delete <strong>{selectedEmployee?.firstName}</strong>. This cannot be undone.</>
//               ) : (
//                 <>Setting <strong>{selectedEmployee?.firstName}</strong> as <strong>RESIGNED</strong> will keep their records but remove them from active operations.</>
//               )}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={(e) => { e.preventDefault(); handleAction(); }}
//               className={actionMode === "DELETE" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-amber-600 hover:bg-amber-700 text-white"}
//               disabled={isProcessing}
//             >
//               {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (actionMode === "DELETE" ? "Delete Forever" : "Mark Resigned")}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// function StatsCard({ title, value, icon, bg }: { title: string; value: number; icon: React.ReactNode; bg: string }) {
//   return (
//     <Card className="bg-card shadow-sm border-muted/60">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
//         <div className={`h-8 w-8 rounded-full flex items-center justify-center ${bg}`}>{icon}</div>
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold text-foreground">{value}</div>
//       </CardContent>
//     </Card>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const styles = {
//     REGULAR: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
//     PROBATIONARY: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
//     CONTRACTUAL: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
//     RESIGNED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
//   }[status] || "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400";

//   return <Badge variant="secondary" className={`font-medium border ${styles}`}>{status}</Badge>;
// }

// "use client";

// import { useState, useMemo, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Briefcase,
//   Building2,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   FileClock,
//   Filter,
//   LayoutGrid,
//   Loader2,
//   MoreHorizontal,
//   Pencil,
//   Plus,
//   Search,
//   Timer,
//   Trash2,
//   Users,
//   X,
//   UserX,
// } from "lucide-react";
// import { toast } from "sonner";
// import Link from "next/link";

// import { deleteEmployee, updateEmployee } from "@/src/actions/employees";
// import { CreateEmployeeModal } from "@/components/dashboard/modals/create-employee-modal";
// import { EditEmployeeModal } from "@/components/dashboard/modals/edit-employee-modal";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useRouter, useSearchParams } from "next/navigation";

// type Employee = {
//   id: string;
//   firstName: string;
//   middleName: string | null;
//   lastName: string;
//   suffix: string | null;
//   employeeNo: string;
//   department: string | null;
//   position: string | null;
//   dateResigned: string | null;
//   dateRegularized: string | null;
//   status: string;
//   imageUrl: string | null;
//   email: string;
//   dateOfBirth: string | null;
//   dateHired: string | null;
//   salaryType: string | null;
//   basicSalary: number | null;
//   allowance: number | null;
//   sssNo?: string | null;
//   philHealthNo?: string | null;
//   pagIbigNo?: string | null;
//   tinNo?: string | null;
//   bankName?: string | null;
//   bankAccountNo?: string | null;
//   address?: string | null;
//   mobileNumber?: string | null;
//   emergencyContactName?: string | null;
//   emergencyContactPhone?: string | null;
// };

// interface EmployeesClientProps {
//   data: Employee[];
//   userRole: string;
// }

// export function EmployeesClient({ data, userRole }: EmployeesClientProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [actionMode, setActionMode] = useState<"DELETE" | "RESIGN">("RESIGN");

//   const [searchQuery, setSearchQuery] = useState("");
//   const [deptFilter, setDeptFilter] = useState<string | "ALL">("ALL");
//   const [statusFilter, setStatusFilter] = useState<string | "ALL">("ALL");

//   // --- PAGINATION STATE ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const [isProcessing, setIsProcessing] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     if (searchParams.get("new") === "true") {
//       setIsModalOpen(true);
//       router.replace("/dashboard/employees");
//     }
//   }, [searchParams, router]);

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, deptFilter, statusFilter]);

//   const stats = useMemo(() => {
//     const total = data.length;
//     const active = data.filter((e) => e.status === "REGULAR").length;
//     const probationary = data.filter((e) => e.status === "PROBATIONARY").length;
//     const resigned = data.filter((e) => e.status === "RESIGNED").length;
//     const departments = new Set(data.map((e) => e.department).filter(Boolean)).size;
//     return { total, active, probationary, resigned, departments };
//   }, [data]);

//   const uniqueDepartments = useMemo(() => {
//     const depts = new Set(data.map((e) => e.department).filter(Boolean) as string[]);
//     return Array.from(depts).sort();
//   }, [data]);

//   const filteredData = useMemo(() => {
//     return data.filter((employee) => {
//       const query = searchQuery.toLowerCase();
//       const fullName = `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`.toLowerCase();
//       const matchesSearch =
//         fullName.includes(query) ||
//         employee.employeeNo.toLowerCase().includes(query) ||
//         (employee.department && employee.department.toLowerCase().includes(query));

//       const matchesDept = deptFilter === "ALL" || employee.department === deptFilter;
//       const matchesStatus = statusFilter === "ALL" || employee.status === statusFilter;

//       return matchesSearch && matchesDept && matchesStatus;
//     });
//   }, [data, searchQuery, deptFilter, statusFilter]);

//   // --- PAGINATION CALCULATION ---
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

//   const handleAction = async () => {
//     if (!selectedEmployee) return;
//     setIsProcessing(true);

//     try {
//       if (actionMode === "DELETE") {
//         const result = await deleteEmployee(selectedEmployee.id);
//         if (result.success) toast.success("Record permanently removed", { position: "top-center" });
//         else toast.error(result.error);
//       } else {
//         const payload = {
//           firstName: selectedEmployee.firstName,
//           lastName: selectedEmployee.lastName,
//           middleName: selectedEmployee.middleName ?? undefined,
//           suffix: selectedEmployee.suffix ?? undefined,
//           employeeNo: selectedEmployee.employeeNo,
//           status: "RESIGNED",
//           dateResigned: new Date().toISOString(),
//           dateRegularized: selectedEmployee.dateRegularized ?? null,
//           department: selectedEmployee.department ?? "",
//           position: selectedEmployee.position ?? "",
//           dateOfBirth: selectedEmployee.dateOfBirth ?? "",
//           dateHired: selectedEmployee.dateHired ?? "",
//           email: selectedEmployee.email,
//           basicSalary: (selectedEmployee.basicSalary ?? 0) / 100,
//           allowance: (selectedEmployee.allowance ?? 0) / 100,
//           salaryType: selectedEmployee.salaryType ?? "MONTHLY",
//           sssNo: selectedEmployee.sssNo ?? undefined,
//           philHealthNo: selectedEmployee.philHealthNo ?? undefined,
//           pagIbigNo: selectedEmployee.pagIbigNo ?? undefined,
//           tinNo: selectedEmployee.tinNo ?? undefined,
//           bankName: selectedEmployee.bankName ?? undefined,
//           bankAccountNo: selectedEmployee.bankAccountNo ?? undefined,
//           address: selectedEmployee.address ?? undefined,
//           mobileNumber: selectedEmployee.mobileNumber ?? undefined,
//           emergencyContactName: selectedEmployee.emergencyContactName ?? undefined,
//           emergencyContactPhone: selectedEmployee.emergencyContactPhone ?? undefined,
//           imageUrl: selectedEmployee.imageUrl ?? undefined,
//         };
//         const result = await updateEmployee(selectedEmployee.id, payload as any);
//         if (result.success) toast.success("Employee marked as RESIGNED", { position: "top-center" });
//         else toast.error("Could not update status");
//       }
//       setDeleteDialogOpen(false);
//     } catch (error) {
//       toast.error("An unexpected error occurred", { position: "top-center" });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const clearFilters = () => {
//     setSearchQuery("");
//     setDeptFilter("ALL");
//     setStatusFilter("ALL");
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">Employees</h1>
//           <p className="text-muted-foreground">Manage workforce, departments, and roles.</p>
//         </div>
//         <Button onClick={() => setIsModalOpen(true)} className="shadow-lg hover:shadow-xl transition-all">
//           <Plus className="mr-2 h-4 w-4" /> Add New
//         </Button>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//         <StatsCard title="Total Staff" value={stats.total} icon={<Users className="h-4 w-4 text-blue-600" />} bg="bg-blue-100 dark:bg-blue-900/30" />
//         <StatsCard title="Regular" value={stats.active} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} bg="bg-emerald-100 dark:bg-emerald-900/30" />
//         <StatsCard title="Probationary" value={stats.probationary} icon={<Timer className="h-4 w-4 text-amber-600" />} bg="bg-amber-100 dark:bg-amber-900/30" />
//         <StatsCard title="Resigned" value={stats.resigned} icon={<UserX className="h-4 w-4 text-red-600" />} bg="bg-red-100 dark:bg-red-900/30" />
//         <StatsCard title="Units" value={stats.departments} icon={<Building2 className="h-4 w-4 text-purple-600" />} bg="bg-purple-100 dark:bg-purple-900/30" />
//       </div>

//       <Card className="border-muted/60 shadow-sm overflow-hidden bg-card">
//         <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border/50 bg-muted/20">
//           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search employees..."
//                 className="pl-9 bg-background"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="h-10 border-dashed">
//                   <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
//                   Dept {deptFilter !== "ALL" && <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-[10px]">{deptFilter}</Badge>}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-48">
//                 <DropdownMenuLabel>Filter by Dept</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuCheckboxItem checked={deptFilter === "ALL"} onCheckedChange={() => setDeptFilter("ALL")}>All</DropdownMenuCheckboxItem>
//                 {uniqueDepartments.map((dept) => (
//                   <DropdownMenuCheckboxItem key={dept} checked={deptFilter === dept} onCheckedChange={() => setDeptFilter(dept)}>{dept}</DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="h-10 border-dashed">
//                   <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
//                   Status {statusFilter !== "ALL" && <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-[10px]">{statusFilter}</Badge>}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-48">
//                 <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuCheckboxItem checked={statusFilter === "ALL"} onCheckedChange={() => setStatusFilter("ALL")}>All</DropdownMenuCheckboxItem>
//                 {["PROBATIONARY", "REGULAR", "CONTRACTUAL", "RESIGNED"].map((st) => (
//                   <DropdownMenuCheckboxItem key={st} checked={statusFilter === st} onCheckedChange={() => setStatusFilter(st)}>{st}</DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {(searchQuery || deptFilter !== "ALL" || statusFilter !== "ALL") && (
//               <Button variant="ghost" onClick={clearFilters} size="sm" className="h-10 px-2 text-muted-foreground">
//                 <X className="mr-2 h-4 w-4" /> Reset
//               </Button>
//             )}
//           </div>
//           <div className="text-sm text-muted-foreground font-medium">
//              Showing <span className="text-foreground">{paginatedData.length}</span> of {filteredData.length}
//           </div>
//         </div>

//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-muted/40">
//               <TableRow>
//                 <TableHead className="w-25 text-xs font-semibold uppercase">ID</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase">Employee</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase hidden md:table-cell">Department</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase hidden sm:table-cell">Position</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase">Status</TableHead>
//                 <TableHead className="text-right text-xs font-semibold uppercase">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {paginatedData.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="h-64 text-center">
//                     <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
//                       <Search className="h-8 w-8 opacity-20" />
//                       <p className="font-medium text-lg">No matches found</p>
//                       <Button variant="link" onClick={clearFilters}>Clear filters</Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedData.map((employee) => (
//                   <TableRow key={employee.id} className="group hover:bg-muted/30 transition-colors">
//                     <TableCell className="font-mono text-xs text-muted-foreground">{employee.employeeNo}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-9 w-9 rounded-full border border-muted/50">
//                           {employee.imageUrl && <AvatarImage src={employee.imageUrl} className="object-cover" />}
//                           <AvatarFallback className="text-xs">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
//                         </Avatar>
//                         <div className="flex flex-col">
//                           <span className="font-medium text-sm text-foreground">{employee.firstName} {employee.lastName}</span>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell">
//                       {employee.department ? <Badge variant="outline" className="font-normal bg-muted/20">{employee.department}</Badge> : "—"}
//                     </TableCell>
//                     <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{employee.position || "—"}</TableCell>
//                     <TableCell>
//                       <div className="flex flex-col">
//                         <StatusBadge status={employee.status} />
//                         {employee.status === "RESIGNED" && employee.dateResigned && (
//                           <span className="text-[10px] text-muted-foreground mt-1">
//                             Left: {new Date(employee.dateResigned).toLocaleDateString()}
//                           </span>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                           <DropdownMenuItem asChild>
//                             <Link href={`/dashboard/employees/${employee.id}`}><Eye className="mr-2 h-4 w-4" /> View</Link>
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => { setSelectedEmployee(employee); setEditOpen(true); }}>
//                             <Pencil className="mr-2 h-4 w-4" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             className="text-amber-600"
//                             onClick={() => {
//                               setSelectedEmployee(employee);
//                               setActionMode("RESIGN");
//                               setDeleteDialogOpen(true);
//                             }}
//                           >
//                             <UserX className="mr-2 h-4 w-4" /> Mark Resigned
//                           </DropdownMenuItem>
//                           {userRole === "ADMIN" && (
//                             <DropdownMenuItem
//                               className="text-red-600 font-medium"
//                               onClick={() => {
//                                 setSelectedEmployee(employee);
//                                 setActionMode("DELETE");
//                                 setDeleteDialogOpen(true);
//                               }}
//                             >
//                               <Trash2 className="mr-2 h-4 w-4" /> Permanent Delete
//                             </DropdownMenuItem>
//                           )}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>

//         {/* --- PAGINATION CONTROLS --- */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/5">
//             <div className="text-xs text-muted-foreground">
//               Page <span className="font-medium text-foreground">{currentPage}</span> of {totalPages}
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-8 px-2"
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4 mr-1" /> Previous
//               </Button>
//               <div className="hidden sm:flex items-center gap-1">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                   <Button
//                     key={page}
//                     variant={currentPage === page ? "default" : "ghost"}
//                     size="sm"
//                     className="w-8 h-8 p-0 text-xs"
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </Button>
//                 ))}
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-8 px-2"
//                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//               >
//                 Next <ChevronRight className="h-4 w-4 ml-1" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </Card>

//       <CreateEmployeeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
//       {selectedEmployee && <EditEmployeeModal open={editOpen} onOpenChange={setEditOpen} employee={selectedEmployee} />}

//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className={actionMode === "DELETE" ? "text-red-600" : "text-amber-600"}>
//               {actionMode === "DELETE" ? "Confirm Permanent Deletion" : "Confirm Resignation"}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {actionMode === "DELETE" ? (
//                 <>Warning: You are about to permanently delete <strong>{selectedEmployee?.firstName}</strong>. This cannot be undone.</>
//               ) : (
//                 <>Setting <strong>{selectedEmployee?.firstName}</strong> as <strong>RESIGNED</strong> will keep their records but remove them from active operations.</>
//               )}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={(e) => { e.preventDefault(); handleAction(); }}
//               className={actionMode === "DELETE" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-amber-600 hover:bg-amber-700 text-white"}
//               disabled={isProcessing}
//             >
//               {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (actionMode === "DELETE" ? "Delete Forever" : "Mark Resigned")}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// // StatsCard and StatusBadge components remain the same...
// function StatsCard({ title, value, icon, bg }: { title: string; value: number; icon: React.ReactNode; bg: string }) {
//   return (
//     <Card className="bg-card shadow-sm border-muted/60">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
//         <div className={`h-8 w-8 rounded-full flex items-center justify-center ${bg}`}>{icon}</div>
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold text-foreground">{value}</div>
//       </CardContent>
//     </Card>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const styles = {
//     REGULAR: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
//     PROBATIONARY: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
//     CONTRACTUAL: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
//     RESIGNED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
//   }[status] || "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400";

//   return <Badge variant="secondary" className={`font-medium border ${styles}`}>{status}</Badge>;
// }

"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileClock,
  Filter,
  LayoutGrid,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Timer,
  Trash2,
  Users,
  X,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { deleteEmployee, updateEmployee } from "@/src/actions/employees";
import { CreateEmployeeModal } from "@/components/dashboard/modals/create-employee-modal";
import { EditEmployeeModal } from "@/components/dashboard/modals/edit-employee-modal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, useSearchParams } from "next/navigation";

type Employee = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  employeeNo: string;
  department: string | null;
  position: string | null;
  dateResigned: string | null;
  dateRegularized: string | null; // Added field
  status: string;
  imageUrl: string | null;
  email: string;
  dateOfBirth: string | null;
  dateHired: string | null;
  salaryType: string | null;
  basicSalary: number | null;
  allowance: number | null;
  sssNo?: string | null;
  philHealthNo?: string | null;
  pagIbigNo?: string | null;
  tinNo?: string | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
  address?: string | null;
  mobileNumber?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
};

interface EmployeesClientProps {
  data: Employee[];
  userRole: string;
}

export function EmployeesClient({ data, userRole }: EmployeesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [actionMode, setActionMode] = useState<"DELETE" | "RESIGN">("RESIGN");

  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<string | "ALL">("ALL");

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isProcessing, setIsProcessing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsModalOpen(true);
      router.replace("/dashboard/employees");
    }
  }, [searchParams, router]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, deptFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((e) => e.status === "REGULAR").length;
    const probationary = data.filter((e) => e.status === "PROBATIONARY").length;
    const contractual = data.filter((e) => e.status === "CONTRACTUAL").length;
    const resigned = data.filter((e) => e.status === "RESIGNED").length;
    const departments = new Set(data.map((e) => e.department).filter(Boolean))
      .size;
    return { total, active, probationary, contractual, resigned, departments };
  }, [data]);

  const uniqueDepartments = useMemo(() => {
    const depts = new Set(
      data.map((e) => e.department).filter(Boolean) as string[],
    );
    return Array.from(depts).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((employee) => {
      const query = searchQuery.toLowerCase();
      const fullName =
        `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(query) ||
        employee.employeeNo.toLowerCase().includes(query) ||
        (employee.department &&
          employee.department.toLowerCase().includes(query));

      const matchesDept =
        deptFilter === "ALL" || employee.department === deptFilter;
      const matchesStatus =
        statusFilter === "ALL" || employee.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [data, searchQuery, deptFilter, statusFilter]);

  // --- PAGINATION CALCULATION ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleAction = async () => {
    if (!selectedEmployee) return;
    setIsProcessing(true);

    try {
      if (actionMode === "DELETE") {
        const result = await deleteEmployee(selectedEmployee.id);
        if (result.success)
          toast.success("Record permanently removed", {
            position: "top-center",
          });
        else toast.error(result.error);
      } else {
        const payload = {
          firstName: selectedEmployee.firstName,
          lastName: selectedEmployee.lastName,
          middleName: selectedEmployee.middleName ?? undefined,
          suffix: selectedEmployee.suffix ?? undefined,
          employeeNo: selectedEmployee.employeeNo,
          status: "RESIGNED",
          dateResigned: new Date().toISOString(),
          dateRegularized: selectedEmployee.dateRegularized ?? null, // Preserve regular date
          department: selectedEmployee.department ?? "",
          position: selectedEmployee.position ?? "",
          dateOfBirth: selectedEmployee.dateOfBirth ?? "",
          dateHired: selectedEmployee.dateHired ?? "",
          email: selectedEmployee.email,
          basicSalary: (selectedEmployee.basicSalary ?? 0) / 100,
          allowance: (selectedEmployee.allowance ?? 0) / 100,
          salaryType: selectedEmployee.salaryType ?? "MONTHLY",
          sssNo: selectedEmployee.sssNo ?? undefined,
          philHealthNo: selectedEmployee.philHealthNo ?? undefined,
          pagIbigNo: selectedEmployee.pagIbigNo ?? undefined,
          tinNo: selectedEmployee.tinNo ?? undefined,
          bankName: selectedEmployee.bankName ?? undefined,
          bankAccountNo: selectedEmployee.bankAccountNo ?? undefined,
          address: selectedEmployee.address ?? undefined,
          mobileNumber: selectedEmployee.mobileNumber ?? undefined,
          emergencyContactName:
            selectedEmployee.emergencyContactName ?? undefined,
          emergencyContactPhone:
            selectedEmployee.emergencyContactPhone ?? undefined,
          imageUrl: selectedEmployee.imageUrl ?? undefined,
        };
        const result = await updateEmployee(
          selectedEmployee.id,
          payload as any,
        );
        if (result.success)
          toast.success("Employee marked as RESIGNED", {
            position: "top-center",
          });
        else toast.error("Could not update status");
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred", { position: "top-center" });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDeptFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Employees
          </h1>
          <p className="text-muted-foreground">
            Manage workforce, departments, and roles.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatsCard
          title="Total Staff"
          value={stats.total}
          icon={<Users className="h-4 w-4 text-blue-600" />}
          bg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          title="Regular"
          value={stats.active}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          bg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatsCard
          title="Probationary"
          value={stats.probationary}
          icon={<Timer className="h-4 w-4 text-amber-600" />}
          bg="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatsCard 
          title="Contractual" 
          value={stats.contractual} 
          icon={<FileClock className="h-4 w-4 text-orange-600" />} 
          bg="bg-orange-100 dark:bg-orange-900/30" 
        />
        <StatsCard
          title="Resigned"
          value={stats.resigned}
          icon={<UserX className="h-4 w-4 text-red-600" />}
          bg="bg-red-100 dark:bg-red-900/30"
        />
        <StatsCard
          title="Units"
          value={stats.departments}
          icon={<Building2 className="h-4 w-4 text-purple-600" />}
          bg="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      <Card className="border-muted/60 shadow-sm overflow-hidden bg-card">
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border/50 bg-muted/20">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 border-dashed"
                >
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  Department{" "}
                  {deptFilter !== "ALL" && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1 rounded-sm text-[10px]"
                    >
                      {deptFilter}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Filter by Dept</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={deptFilter === "ALL"}
                  onCheckedChange={() => setDeptFilter("ALL")}
                >
                  All
                </DropdownMenuCheckboxItem>
                {uniqueDepartments.map((dept) => (
                  <DropdownMenuCheckboxItem
                    key={dept}
                    checked={deptFilter === dept}
                    onCheckedChange={() => setDeptFilter(dept)}
                  >
                    {dept}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 border-dashed"
                >
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  Status{" "}
                  {statusFilter !== "ALL" && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1 rounded-sm text-[10px]"
                    >
                      {statusFilter}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "ALL"}
                  onCheckedChange={() => setStatusFilter("ALL")}
                >
                  All
                </DropdownMenuCheckboxItem>
                {["PROBATIONARY", "REGULAR", "CONTRACTUAL", "RESIGNED"].map(
                  (st) => (
                    <DropdownMenuCheckboxItem
                      key={st}
                      checked={statusFilter === st}
                      onCheckedChange={() => setStatusFilter(st)}
                    >
                      {st}
                    </DropdownMenuCheckboxItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {(searchQuery ||
              deptFilter !== "ALL" ||
              statusFilter !== "ALL") && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                size="sm"
                className="h-10 px-2 text-muted-foreground"
              >
                <X className="mr-2 h-4 w-4" /> Reset
              </Button>
            )}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Showing{" "}
            <span className="text-foreground">{paginatedData.length}</span> of{" "}
            {filteredData.length}
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-25 text-xs font-semibold uppercase tracking-wider">
                  ID
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Employee
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase hidden md:table-cell tracking-wider">
                  Department
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase hidden sm:table-cell tracking-wider">
                  Position
                </TableHead>

                {/* --- NEW HEADERS --- */}
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Date Hired
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Date Regularized
                </TableHead>

                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  {/* Updated colSpan to 8 to match new column count */}
                  <TableCell colSpan={8} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                      <Search className="h-8 w-8 opacity-20" />
                      <p className="font-medium text-lg">No matches found</p>
                      <Button variant="link" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    {/* 1. ID */}
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {employee.employeeNo}
                    </TableCell>

                    {/* 2. EMPLOYEE */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-full border border-muted/50">
                          {employee.imageUrl && (
                            <AvatarImage
                              src={employee.imageUrl}
                              className="object-cover"
                            />
                          )}
                          <AvatarFallback className="text-xs">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-foreground">
                            {employee.firstName} {employee.lastName}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 3. DEPARTMENT */}
                    <TableCell className="hidden md:table-cell">
                      {employee.department ? (
                        <Badge
                          variant="outline"
                          className="font-normal bg-muted/20"
                        >
                          {employee.department}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    {/* 4. POSITION */}
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {employee.position || "—"}
                    </TableCell>

                    {/* 5. STATUS (Cleaned up, moved dates to their own columns) */}
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={employee.status} />
                        {/* We keep Resigned date here since it doesn't have its own column */}
                        {employee.status === "RESIGNED" &&
                          employee.dateResigned && (
                            <span className="text-[10px] text-red-500 font-medium">
                              Left:{" "}
                              {new Date(
                                employee.dateResigned,
                              ).toLocaleDateString()}
                            </span>
                          )}
                      </div>
                    </TableCell>

                    {/* 6. DATE HIRED (New Column) */}
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {employee.dateHired
                        ? new Date(employee.dateHired).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    {/* 7. DATE REGULARIZED (New Column) */}
                    <TableCell className="text-sm whitespace-nowrap">
                      {employee.dateRegularized ? (
                        <span className="text-emerald-600 font-medium">
                          {new Date(
                            employee.dateRegularized,
                          ).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* 8. ACTIONS */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/employees/${employee.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setEditOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-amber-600"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setActionMode("RESIGN");
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <UserX className="mr-2 h-4 w-4" /> Mark Resigned
                          </DropdownMenuItem>
                          {userRole === "ADMIN" && (
                            <DropdownMenuItem
                              className="text-red-600 font-medium"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setActionMode("DELETE");
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Permanent
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/5">
            <div className="text-xs text-muted-foreground">
              Page{" "}
              <span className="font-medium text-foreground">{currentPage}</span>{" "}
              of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      className="w-8 h-8 p-0 text-xs"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <CreateEmployeeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      {selectedEmployee && (
        <EditEmployeeModal
          open={editOpen}
          onOpenChange={setEditOpen}
          employee={selectedEmployee}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={
                actionMode === "DELETE" ? "text-red-600" : "text-amber-600"
              }
            >
              {actionMode === "DELETE"
                ? "Confirm Permanent Deletion"
                : "Confirm Resignation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionMode === "DELETE" ? (
                <>
                  Warning: You are about to permanently delete{" "}
                  <strong>{selectedEmployee?.firstName}</strong>. This cannot be
                  undone.
                </>
              ) : (
                <>
                  Setting <strong>{selectedEmployee?.firstName}</strong> as{" "}
                  <strong>RESIGNED</strong> will keep their records but remove
                  them from active operations.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleAction();
              }}
              className={
                actionMode === "DELETE"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : actionMode === "DELETE" ? (
                "Delete Forever"
              ) : (
                "Mark Resigned"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <Card className="bg-card shadow-sm border-muted/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${bg}`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    REGULAR:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    PROBATIONARY:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    CONTRACTUAL:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
    RESIGNED:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  };
  const currentStyle =
    styles[status] ||
    "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400";

  return (
    <Badge variant="secondary" className={`font-medium border ${currentStyle}`}>
      {status}
    </Badge>
  );
}
