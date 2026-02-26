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
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Timer,
  Trash2,
  UserX,
  Users,
  UserCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { deleteEmployee, updateEmployee } from "@/src/actions/employees";
import { CreateEmployeeModal } from "@/components/dashboard/modals/create-employee-modal";
import { EditEmployeeModal } from "@/components/dashboard/modals/edit-employee-modal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChangePinModal } from "./change-pin-modal";

// --- TYPE DEFINITIONS ---
type Employee = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  employeeNo: string;

  // Relations
  department: { id: string; name: string; code: string } | null;
  position: { id: string; title: string } | null;
  shift: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  } | null;

  dateResigned: string | null;
  dateRegularized: string | null;
  status: string;
  imageUrl: string | null;
  email: string;
  dateOfBirth: string | null;
  dateHired: string | null;
  salaryType: string | null;
  basicSalary: number | null;
  allowance: number | null;

  // Gov IDs & Contact
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
  // --- STATE ---
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isProcessing, setIsProcessing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- EFFECTS ---
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsModalOpen(true);
      router.replace("/dashboard/employees");
    }
  }, [searchParams, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, deptFilter, statusFilter]);

  // --- MEMOIZED DATA ---
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((e) => e.status === "REGULAR").length;
    const probationary = data.filter((e) => e.status === "PROBATIONARY").length;
    const contractual = data.filter((e) => e.status === "CONTRACTUAL").length;
    const resigned = data.filter((e) => e.status === "RESIGNED").length;
    const departments = new Set(
      data.map((e) => e.department?.name).filter(Boolean),
    ).size;

    return { total, active, probationary, contractual, resigned, departments };
  }, [data]);

  const uniqueDepartments = useMemo(() => {
    const depts = new Set(
      data.map((e) => e.department?.name).filter(Boolean) as string[],
    );
    return Array.from(depts).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((employee) => {
      const query = searchQuery.toLowerCase();
      const fullName =
        `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`.toLowerCase();
      const deptName = employee.department?.name?.toLowerCase() || "";

      const matchesSearch =
        fullName.includes(query) ||
        employee.employeeNo.toLowerCase().includes(query) ||
        deptName.includes(query);

      const matchesDept =
        deptFilter === "ALL" || employee.department?.name === deptFilter;

      const matchesStatus =
        statusFilter === "ALL" || employee.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [data, searchQuery, deptFilter, statusFilter]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // --- HANDLERS ---
  const handleAction = async () => {
    if (!selectedEmployee) return;
    setIsProcessing(true);

    try {
      if (actionMode === "DELETE") {
        const result = await deleteEmployee(selectedEmployee.id);
        if (result.success) toast.success("Record permanently removed");
        else toast.error(result.error);
      } else {
        // Prepare payload for resignation
        const payload = {
          firstName: selectedEmployee.firstName,
          lastName: selectedEmployee.lastName,
          middleName: selectedEmployee.middleName ?? undefined,
          suffix: selectedEmployee.suffix ?? undefined,
          employeeNo: selectedEmployee.employeeNo,
          status: "RESIGNED",
          dateResigned: new Date().toISOString(),
          dateRegularized: selectedEmployee.dateRegularized ?? null,
          departmentId: selectedEmployee.department?.id,
          positionId: selectedEmployee.position?.id,
          shiftId: selectedEmployee.shift?.id,
          dateOfBirth: selectedEmployee.dateOfBirth ?? "",
          dateHired: selectedEmployee.dateHired ?? "",
          email: selectedEmployee.email,
          basicSalary: selectedEmployee.basicSalary ?? 0,
          allowance: selectedEmployee.allowance ?? 0,
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

        if (result.success) toast.success("Employee marked as RESIGNED");
        else toast.error("Could not update status");
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred");
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Employees
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage workforce, departments, and positions.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* 2. STATS CARDS (Matching Users Page Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-linear-to-br from-white to-blue-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Staff
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              across {stats.departments} departments
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm bg-linear-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regular
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm bg-linear-to-br from-white to-amber-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Probationary
            </CardTitle>
            <Timer className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.probationary}</div>
            <p className="text-xs text-muted-foreground">Under observation</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm bg-linear-to-br from-white to-red-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resigned
            </CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resigned}</div>
            <p className="text-xs text-muted-foreground">Past employees</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. MAIN CONTENT CARD */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-slate-950">
        {/* Toolbar */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, ID, or dept..."
                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 border-slate-200 bg-white dark:bg-slate-900"
                >
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  Department
                  {deptFilter !== "ALL" && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1 rounded-sm text-[10px] bg-indigo-50 text-indigo-700"
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

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 border-slate-200 bg-white dark:bg-slate-900"
                >
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  Status
                  {statusFilter !== "ALL" && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1 rounded-sm text-[10px] bg-blue-50 text-blue-700"
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
                className="h-10 px-2 text-muted-foreground hover:text-red-600"
              >
                <X className="mr-2 h-4 w-4" /> Reset
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Showing{" "}
            <span className="text-foreground">{paginatedData.length}</span> of{" "}
            {filteredData.length}
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                <TableHead className="w-[100px] text-xs font-semibold uppercase tracking-wider">
                  ID
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider pl-4">
                  Employee
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase hidden md:table-cell tracking-wider">
                  Department
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase hidden sm:table-cell tracking-wider">
                  Position
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Date Hired
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Regularized
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                        <Search className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="font-medium">No matches found</p>
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
                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors border-slate-100 dark:border-slate-800"
                  >
                    {/* 1. ID */}
                    <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                      {employee.employeeNo}
                    </TableCell>

                    {/* 2. EMPLOYEE */}
                    <TableCell className="pl-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-white dark:border-slate-800 shadow-sm">
                          {employee.imageUrl ? (
                            <AvatarImage
                              src={employee.imageUrl}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-foreground group-hover:text-indigo-600 transition-colors">
                            {employee.firstName} {employee.lastName}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 3. DEPARTMENT */}
                    <TableCell className="hidden md:table-cell">
                      {employee.department ? (
                        <div className="flex flex-col items-start">
                          <Badge
                            variant="outline"
                            className="font-normal bg-white dark:bg-slate-800 border-slate-200"
                          >
                            {employee.department.code}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground mt-1">
                            {employee.department.name}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    {/* 4. POSITION */}
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {employee.position?.title || "—"}
                    </TableCell>

                    {/* 5. STATUS */}
                    <TableCell>
                      <StatusBadge status={employee.status} />
                      {employee.status === "RESIGNED" &&
                        employee.dateResigned && (
                          <div className="text-[10px] text-red-500 font-medium mt-1">
                            Left:{" "}
                            {new Date(
                              employee.dateResigned,
                            ).toLocaleDateString()}
                          </div>
                        )}
                    </TableCell>

                    {/* 6. DATE HIRED */}
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {employee.dateHired
                        ? new Date(employee.dateHired).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    {/* 7. DATE REGULARIZED */}
                    <TableCell className="text-sm whitespace-nowrap">
                      {employee.dateRegularized ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {new Date(
                            employee.dateRegularized,
                          ).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground opacity-50">
                          —
                        </span>
                      )}
                    </TableCell>

                    {/* 8. ACTIONS */}
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        {/* <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/employees/${employee.id}`}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4 text-blue-500" />{" "}
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setEditOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4 text-indigo-500" />{" "}
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-amber-600 focus:text-amber-700 focus:bg-amber-50 cursor-pointer"
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
                              className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setActionMode("DELETE");
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent> */}
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Actions
                          </DropdownMenuLabel>

                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/employees/${employee.id}`}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4 text-blue-500" />{" "}
                              View Profile
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setEditOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4 text-indigo-500" />{" "}
                            Edit Details
                          </DropdownMenuItem>

                          {/* 👇 NEW: The Change PIN Modal Trigger */}
                          <div>
                            <ChangePinModal
                              employeeId={employee.id}
                              employeeName={`${employee.firstName} ${employee.lastName}`}
                            />
                          </div>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-amber-600 focus:text-amber-700 focus:bg-amber-50 cursor-pointer"
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
                              className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setActionMode("DELETE");
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Record
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

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t bg-slate-50/50 dark:bg-slate-900/50">
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
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
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

      {/* Modals & Dialogs */}
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
                actionMode === "DELETE"
                  ? "text-red-600 flex items-center gap-2"
                  : "text-amber-600 flex items-center gap-2"
              }
            >
              {actionMode === "DELETE" ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <UserX className="h-5 w-5" />
              )}
              {actionMode === "DELETE"
                ? "Confirm Permanent Deletion"
                : "Confirm Resignation"}
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              {actionMode === "DELETE" ? (
                <>
                  Are you sure you want to permanently delete{" "}
                  <strong>
                    {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                  </strong>
                  ?<br />
                  <br />
                  This action cannot be undone. All payroll and attendance
                  records associated with this employee will be lost.
                </>
              ) : (
                <>
                  Setting <strong>{selectedEmployee?.firstName}</strong> as{" "}
                  <strong>RESIGNED</strong> will keep their historical records
                  but remove them from active payroll and attendance lists.
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
              ) : null}
              {actionMode === "DELETE" ? "Delete Forever" : "Mark Resigned"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    REGULAR:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    PROBATIONARY:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    CONTRACTUAL:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
    RESIGNED:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Badge
      variant="secondary"
      className={`font-medium border px-2.5 py-0.5 rounded-full ${styles[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}
    >
      {status}
    </Badge>
  );
}
