"use client";

import { useState, useMemo } from "react";
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
  FileClock, // Imported for Contractual Icon
  LayoutGrid,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Timer,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { deleteEmployee } from "@/src/actions/employees";
import { CreateEmployeeModal } from "@/components/dashboard/modals/create-employee-modal";
import { EditEmployeeModal } from "../modals/edit-employee-modal";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. UPDATED STATS LOGIC
  const stats = useMemo(() => {
    const total = data.length;

    const active = data.filter(
      (e) => e.status === "ACTIVE" || e.status === "REGULAR",
    ).length;

    const probationary = data.filter((e) => e.status === "PROBATIONARY").length;

    // 👇 ADDED: Count Contractual & Project Based
    const contractual = data.filter(
      (e) => e.status === "CONTRACTUAL" || e.status === "PROJECT_BASED",
    ).length;

    const departments = new Set(data.map((e) => e.department).filter(Boolean))
      .size;

    return { total, active, probationary, contractual, departments };
  }, [data]);

  // 2. Filter Logic
  const filteredData = data.filter((employee) => {
    const query = searchQuery.toLowerCase();
    const fullName =
      `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`.toLowerCase();
    return (
      fullName.includes(query) ||
      employee.employeeNo.toLowerCase().includes(query) ||
      (employee.department && employee.department.toLowerCase().includes(query))
    );
  });

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
        toast.error("Could not delete employee", { position: "top-center" });
      }
    } catch {
      toast.error("An unexpected error occurred", { position: "top-center" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Employees
          </h1>
          <p className="text-muted-foreground">
            Manage workforce, departments, and roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
      </div>

      {/* --- UPDATED QUICK STATS CARDS (5 Columns) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Total */}
        <Card className="bg-card shadow-sm border-muted/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employees
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total workforce
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Regular */}
        <Card className="bg-card shadow-sm border-muted/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regular
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Regularized staff
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Probationary */}
        <Card className="bg-card shadow-sm border-muted/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Probationary
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Timer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.probationary}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Under evaluation
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Contractual (NEW) */}
        <Card className="bg-card shadow-sm border-muted/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contractual
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <FileClock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.contractual}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fixed term / Project
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Departments */}
        <Card className="bg-card shadow-sm border-muted/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departments
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.departments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active units</p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN TABLE CARD */}
      <Card className="border-muted/60 shadow-sm overflow-hidden bg-card">
        {/* ... (Rest of table code remains the same as before) ... */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">All Records</h3>
            <Badge variant="outline" className="ml-2 bg-background">
              {filteredData.length}
            </Badge>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or dept..."
              className="pl-9 bg-background border-muted hover:border-ring/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-25 text-xs font-semibold uppercase tracking-wider">
                  ID
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Employee
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                  Department
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                  Position
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </TableHead>
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
                      <div>
                        <p className="font-medium text-lg">No matches found</p>
                        <p className="text-sm">
                          Try adjusting your search filters
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="group hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {employee.employeeNo}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-full border border-muted/50 overflow-hidden">
                          {/* 👇 FIX: Only render AvatarImage if employee.imageUrl exists */}
                          {employee.imageUrl ? (
                            <AvatarImage
                              src={employee.imageUrl}
                              alt={employee.firstName}
                              className="object-cover h-full w-full"
                            />
                          ) : null}

                          <AvatarFallback className="flex items-center justify-center w-full h-full rounded-full font-bold bg-linear-to-tr from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 text-xs">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                            {employee.firstName} {employee.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {employee.position || "No position"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {employee.department ? (
                        <Badge
                          variant="outline"
                          className="font-normal text-muted-foreground bg-muted/20"
                        >
                          <Building2 className="mr-1 h-3 w-3" />
                          {employee.department}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 opacity-70" />
                        {employee.position || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`
                          font-medium border 
                          ${
                            employee.status === "ACTIVE" ||
                            employee.status === "REGULAR"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                              : employee.status === "PROBATIONARY"
                                ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                                : employee.status === "CONTRACTUAL" ||
                                    employee.status === "PROJECT_BASED"
                                  ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
                                  : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                          }
                        `}
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/employees/${employee.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setEditOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                            onClick={() => promptDelete(employee)}
                          >
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

      {/* Modals */}
      <CreateEmployeeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <EditEmployeeModal
        open={editOpen}
        onOpenChange={setEditOpen}
        employee={selectedEmployee}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You are about to permanently delete the record for{" "}
              <strong className="text-foreground">
                {selectedEmployee?.firstName} {selectedEmployee?.lastName}
              </strong>
              .
              <br />
              <br />
              <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded block text-sm border border-red-100 dark:border-red-900/50">
                ⚠️ This action cannot be undone. All associated data will be
                removed.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                "Delete Record"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
