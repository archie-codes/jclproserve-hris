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
//   FileClock, // Imported for Contractual Icon
//   LayoutGrid,
//   Loader2,
//   MoreHorizontal,
//   Pencil,
//   Plus,
//   Router,
//   Search,
//   Timer,
//   Trash2,
//   Users,
// } from "lucide-react";
// import { toast } from "sonner";
// import Link from "next/link";

// import { deleteEmployee } from "@/src/actions/employees";
// import { CreateEmployeeModal } from "@/components/dashboard/modals/create-employee-modal";
// import { EditEmployeeModal } from "../modals/edit-employee-modal";
// import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
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
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
//     null,
//   );
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     // Check if the URL has "?new=true"
//     if (searchParams.get("new") === "true") {
//       setIsModalOpen(true); // Open the modal (Note: using your variable 'setIsModalOpen')

//       // Clean the URL so refreshing doesn't re-open it
//       router.replace("/dashboard/employees");
//     }
//   }, [searchParams, router]);

//   // 1. UPDATED STATS LOGIC
//   const stats = useMemo(() => {
//     const total = data.length;

//     const active = data.filter(
//       (e) => e.status === "ACTIVE" || e.status === "REGULAR",
//     ).length;

//     const probationary = data.filter((e) => e.status === "PROBATIONARY").length;

//     // 👇 ADDED: Count Contractual & Project Based
//     const contractual = data.filter(
//       (e) => e.status === "CONTRACTUAL" || e.status === "PROJECT_BASED",
//     ).length;

//     const departments = new Set(data.map((e) => e.department).filter(Boolean))
//       .size;

//     return { total, active, probationary, contractual, departments };
//   }, [data]);

//   // 2. Filter Logic
//   const filteredData = data.filter((employee) => {
//     const query = searchQuery.toLowerCase();
//     const fullName =
//       `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`.toLowerCase();
//     return (
//       fullName.includes(query) ||
//       employee.employeeNo.toLowerCase().includes(query) ||
//       (employee.department && employee.department.toLowerCase().includes(query))
//     );
//   });

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
//         toast.error("Could not delete employee", { position: "top-center" });
//       }
//     } catch {
//       toast.error("An unexpected error occurred", { position: "top-center" });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       {/* HEADER SECTION */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">
//             Employees
//           </h1>
//           <p className="text-muted-foreground">
//             Manage workforce, departments, and roles.
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             onClick={() => setIsModalOpen(true)}
//             className="shadow-lg hover:shadow-xl transition-all"
//           >
//             <Plus className="mr-2 h-4 w-4" /> Add New
//           </Button>
//         </div>
//       </div>

//       {/* --- UPDATED QUICK STATS CARDS (5 Columns) --- */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//         {/* Card 1: Total */}
//         <Card className="bg-card shadow-sm border-muted/60">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Total Employees
//             </CardTitle>
//             <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//               <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-foreground">
//               {stats.total}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Total workforce
//             </p>
//           </CardContent>
//         </Card>

//         {/* Card 2: Regular */}
//         <Card className="bg-card shadow-sm border-muted/60">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Regular
//             </CardTitle>
//             <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
//               <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-foreground">
//               {stats.active}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Regularized staff
//             </p>
//           </CardContent>
//         </Card>

//         {/* Card 3: Probationary */}
//         <Card className="bg-card shadow-sm border-muted/60">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Probationary
//             </CardTitle>
//             <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
//               <Timer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-foreground">
//               {stats.probationary}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Under evaluation
//             </p>
//           </CardContent>
//         </Card>

//         {/* Card 4: Contractual (NEW) */}
//         <Card className="bg-card shadow-sm border-muted/60">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Contractual
//             </CardTitle>
//             <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
//               <FileClock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-foreground">
//               {stats.contractual}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Fixed term / Project
//             </p>
//           </CardContent>
//         </Card>

//         {/* Card 5: Departments */}
//         <Card className="bg-card shadow-sm border-muted/60">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Departments
//             </CardTitle>
//             <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
//               <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-foreground">
//               {stats.departments}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">Active units</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* MAIN TABLE CARD */}
//       <Card className="border-muted/60 shadow-sm overflow-hidden bg-card">
//         {/* ... (Rest of table code remains the same as before) ... */}
//         <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border/50 bg-muted/20">
//           <div className="flex items-center gap-2">
//             <LayoutGrid className="h-5 w-5 text-muted-foreground" />
//             <h3 className="font-semibold text-foreground">All Records</h3>
//             <Badge variant="outline" className="ml-2 bg-background">
//               {filteredData.length}
//             </Badge>
//           </div>
//           <div className="relative w-full sm:w-72">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by name, ID, or dept..."
//               className="pl-9 bg-background border-muted hover:border-ring/50 transition-colors"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-muted/40">
//               <TableRow className="hover:bg-transparent">
//                 <TableHead className="w-25 text-xs font-semibold uppercase tracking-wider">
//                   ID
//                 </TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider">
//                   Employee
//                 </TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
//                   Department
//                 </TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
//                   Position
//                 </TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider">
//                   Status
//                 </TableHead>
//                 <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">
//                   Actions
//                 </TableHead>
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
//                       <div>
//                         <p className="font-medium text-lg">No matches found</p>
//                         <p className="text-sm">
//                           Try adjusting your search filters
//                         </p>
//                       </div>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredData.map((employee) => (
//                   <TableRow
//                     key={employee.id}
//                     className="group hover:bg-muted/30 transition-colors cursor-pointer"
//                   >
//                     <TableCell className="font-mono text-xs text-muted-foreground">
//                       {employee.employeeNo}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-9 w-9 rounded-full border border-muted/50 overflow-hidden">
//                           {/* 👇 FIX: Only render AvatarImage if employee.imageUrl exists */}
//                           {employee.imageUrl ? (
//                             <AvatarImage
//                               src={employee.imageUrl}
//                               alt={employee.firstName}
//                               className="object-cover h-full w-full"
//                             />
//                           ) : null}

//                           <AvatarFallback className="flex items-center justify-center w-full h-full rounded-full font-bold bg-linear-to-tr from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 text-xs">
//                             {employee.firstName[0]}
//                             {employee.lastName[0]}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex flex-col">
//                           <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
//                             {employee.firstName} {employee.lastName}
//                           </span>
//                           <span className="text-xs text-muted-foreground hidden sm:inline">
//                             {employee.position || "No position"}
//                           </span>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell">
//                       {employee.department ? (
//                         <Badge
//                           variant="outline"
//                           className="font-normal text-muted-foreground bg-muted/20"
//                         >
//                           <Building2 className="mr-1 h-3 w-3" />
//                           {employee.department}
//                         </Badge>
//                       ) : (
//                         <span className="text-muted-foreground text-xs">—</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <Briefcase className="h-3 w-3 opacity-70" />
//                         {employee.position || "—"}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant="secondary"
//                         className={`
//                           font-medium border 
//                           ${
//                             employee.status === "ACTIVE" ||
//                             employee.status === "REGULAR"
//                               ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
//                               : employee.status === "PROBATIONARY"
//                                 ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
//                                 : employee.status === "CONTRACTUAL" ||
//                                     employee.status === "PROJECT_BASED"
//                                   ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
//                                   : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
//                           }
//                         `}
//                       >
//                         {employee.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100"
//                           >
//                             <span className="sr-only">Open menu</span>
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-40">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                           <DropdownMenuItem asChild>
//                             <Link href={`/dashboard/employees/${employee.id}`}>
//                               <Eye className="mr-2 h-4 w-4" />
//                               View Profile
//                             </Link>
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => {
//                               setSelectedEmployee(employee);
//                               setEditOpen(true);
//                             }}
//                           >
//                             <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
//                             onClick={() => promptDelete(employee)}
//                           >
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

//       {/* Modals */}
//       <CreateEmployeeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
//       <EditEmployeeModal
//         open={editOpen}
//         onOpenChange={setEditOpen}
//         employee={selectedEmployee}
//       />

//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
//               <Trash2 className="h-5 w-5" /> Confirm Deletion
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-base">
//               You are about to permanently delete the record for{" "}
//               <strong className="text-foreground">
//                 {selectedEmployee?.firstName} {selectedEmployee?.lastName}
//               </strong>
//               .
//               <br />
//               <br />
//               <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded block text-sm border border-red-100 dark:border-red-900/50">
//                 ⚠️ This action cannot be undone. All associated data will be
//                 removed.
//               </span>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleConfirmDelete();
//               }}
//               className="bg-red-600 hover:bg-red-700 text-white"
//               disabled={isDeleting}
//             >
//               {isDeleting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
//                   Processing...
//                 </>
//               ) : (
//                 "Delete Record"
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }



// With Filtering Feature

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
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { deleteEmployee } from "@/src/actions/employees";
import { CreateEmployeeModal } from "@/components/dashboard/modals/create-employee-modal";
import { EditEmployeeModal } from "@/components/dashboard/modals/edit-employee-modal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, useSearchParams } from "next/navigation";

type Employee = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  employeeNo: string;
  department: string | null;
  position: string | null;
  status: string;
  imageUrl: string | null;
};

export function EmployeesClient({ data }: { data: Employee[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // --- FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<string | "ALL">("ALL");

  const [isDeleting, setIsDeleting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle URL params for "New Employee" modal
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsModalOpen(true);
      router.replace("/dashboard/employees");
    }
  }, [searchParams, router]);

  // 1. STATS LOGIC
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((e) => e.status === "ACTIVE" || e.status === "REGULAR").length;
    const probationary = data.filter((e) => e.status === "PROBATIONARY").length;
    const contractual = data.filter((e) => e.status === "CONTRACTUAL" || e.status === "PROJECT_BASED").length;
    const departments = new Set(data.map((e) => e.department).filter(Boolean)).size;

    return { total, active, probationary, contractual, departments };
  }, [data]);

  // 2. EXTRACT UNIQUE DEPARTMENTS (For Filter Dropdown)
  const uniqueDepartments = useMemo(() => {
    const depts = new Set(data.map((e) => e.department).filter(Boolean) as string[]);
    return Array.from(depts).sort();
  }, [data]);

  // 3. FILTERING LOGIC (Search + Dropdowns)
  const filteredData = useMemo(() => {
    return data.filter((employee) => {
      // A. Search Query
      const query = searchQuery.toLowerCase();
      const fullName = `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(query) ||
        employee.employeeNo.toLowerCase().includes(query) ||
        (employee.department && employee.department.toLowerCase().includes(query));

      // B. Department Filter
      const matchesDept = deptFilter === "ALL" || employee.department === deptFilter;

      // C. Status Filter
      const matchesStatus = statusFilter === "ALL" || employee.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [data, searchQuery, deptFilter, statusFilter]);

  // --- ACTIONS ---
  const promptDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    setIsDeleting(true);
    try {
      const result = await deleteEmployee(selectedEmployee.id);
      if (result.success) {
        toast.success("Employee record removed", { position: "top-center" });
        setDeleteDialogOpen(false);
      } else {
        toast.error("Could not delete employee" , { position: "top-center" });//
      }
    } catch {
      toast.error("An unexpected error occurred", { position: "top-center" });
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDeptFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage workforce, departments, and roles.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg hover:shadow-xl transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Employees" value={stats.total} icon={<Users className="h-4 w-4 text-blue-600" />} bg="bg-blue-100 dark:bg-blue-900/30" />
        <StatsCard title="Regular" value={stats.active} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} bg="bg-emerald-100 dark:bg-emerald-900/30" />
        <StatsCard title="Probationary" value={stats.probationary} icon={<Timer className="h-4 w-4 text-amber-600" />} bg="bg-amber-100 dark:bg-amber-900/30" />
        <StatsCard title="Contractual" value={stats.contractual} icon={<FileClock className="h-4 w-4 text-orange-600" />} bg="bg-orange-100 dark:bg-orange-900/30" />
        <StatsCard title="Departments" value={stats.departments} icon={<Building2 className="h-4 w-4 text-purple-600" />} bg="bg-purple-100 dark:bg-purple-900/30" />
      </div>

      {/* MAIN TABLE */}
      <Card className="border-muted/60 shadow-sm overflow-hidden bg-card">
        
        {/* --- TOOLBAR SECTION (Search + Filters) --- */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border/50 bg-muted/20">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 border-dashed">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  Department
                  {deptFilter !== "ALL" && (
                    <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-[10px]">
                      {deptFilter}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Filter by Dept</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={deptFilter === "ALL"} onCheckedChange={() => setDeptFilter("ALL")}>
                  All Departments
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

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 border-dashed">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  Status
                  {statusFilter !== "ALL" && (
                    <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-[10px]">
                      {statusFilter}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={statusFilter === "ALL"} onCheckedChange={() => setStatusFilter("ALL")}>
                  All Statuses
                </DropdownMenuCheckboxItem>
                {["PROBATIONARY", "REGULAR", "CONTRACTUAL", "RESIGNED"].map((st) => (
                  <DropdownMenuCheckboxItem
                    key={st}
                    checked={statusFilter === st}
                    onCheckedChange={() => setStatusFilter(st)}
                  >
                    {st}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button (Only shows if filters are active) */}
            {(searchQuery || deptFilter !== "ALL" || statusFilter !== "ALL") && (
              <Button variant="ghost" onClick={clearFilters} size="sm" className="h-10 px-2 lg:px-3 text-muted-foreground">
                <X className="mr-2 h-4 w-4" /> Reset
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Showing</span>
            <strong className="text-foreground">{filteredData.length}</strong>
            <span className="hidden sm:inline">records</span>
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-25 text-xs font-semibold uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Employee</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Department</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Position</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                      <div className="bg-muted/50 p-4 rounded-full">
                        <Search className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="font-medium text-lg">No matches found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                      <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((employee) => (
                  <TableRow key={employee.id} className="group hover:bg-muted/30 transition-colors cursor-pointer">
                    <TableCell className="font-mono text-xs text-muted-foreground">{employee.employeeNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-full border border-muted/50">
                          {employee.imageUrl && <AvatarImage src={employee.imageUrl} className="object-cover" />}
                          <AvatarFallback className="text-xs">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                            {employee.firstName} {employee.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground sm:hidden">{employee.position}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {employee.department ? (
                        <Badge variant="outline" className="font-normal text-muted-foreground bg-muted/20">
                          {employee.department}
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{employee.position || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={employee.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/employees/${employee.id}`}><Eye className="mr-2 h-4 w-4" /> View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedEmployee(employee); setEditOpen(true); }}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => promptDelete(employee)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODALS */}
      <CreateEmployeeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <EditEmployeeModal open={editOpen} onOpenChange={setEditOpen} employee={selectedEmployee} />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2"><Trash2 className="h-5 w-5" /> Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedEmployee?.firstName} {selectedEmployee?.lastName}</strong>?
              <br /><br />
              <span className="bg-red-50 text-red-600 p-2 rounded block text-sm border border-red-100">
                ⚠️ This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 text-white" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatsCard({ title, value, icon, bg }: { title: string; value: number; icon: React.ReactNode; bg: string }) {
  return (
    <Card className="bg-card shadow-sm border-muted/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${bg}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    REGULAR: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    PROBATIONARY: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    CONTRACTUAL: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
    RESIGNED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  }[status] || "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400";

  return (
    <Badge variant="secondary" className={`font-medium border ${styles}`}>
      {status}
    </Badge>
  );
}