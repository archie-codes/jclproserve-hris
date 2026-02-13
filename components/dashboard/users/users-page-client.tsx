// "use client";

// import { useState } from "react";
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
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
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
//   Loader2,
//   MoreHorizontal,
//   Pencil,
//   Plus,
//   Search,
//   Trash2,
//   ShieldCheck,
//   Shield,
//   UserCog,
//   KeyRound,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { toast } from "sonner";

// import { CreateUserModal } from "@/components/dashboard/modals/create-user-modal";
// import { EditUserModal } from "@/components/dashboard/modals/edit-user-modal";
// import { deleteUser } from "@/src/actions/users";

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   isActive: boolean;
//   image: string | null;
// };

// type CurrentUser = {
//   id: string;
//   name: string;
//   email: string;
//   role: "ADMIN" | "HR";
//   isActive: boolean;
// };

// type Props = {
//   users: User[];
//   currentUser: CurrentUser;
// };

// export default function UsersPageClient({ users, currentUser }: Props) {
//   const [createOpen, setCreateOpen] = useState(false);
//   const [editUser, setEditUser] = useState<User | null>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);

//   const filteredUsers = users.filter((user) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       user.name.toLowerCase().includes(query) ||
//       user.email.toLowerCase().includes(query)
//     );
//   });

//   const promptDelete = (user: User) => {
//     setSelectedUser(user);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!selectedUser) return;
//     setIsDeleting(true);

//     try {
//       // 1. Call the server action
//       const result = await deleteUser(selectedUser.id);

//       // 2. Check the result object
//       if (result.success) {
//         toast.success("User access delete successfully", {
//           position: "top-center",
//         });
//         setDeleteDialogOpen(false);
//       } else {
//         // 3. Display the SPECIFIC error from the server (e.g., "You cannot delete your own account")
//         toast.error(result.error || "Failed to delete user", {
//           position: "top-center",
//         });
//       }
//     } catch (error) {
//       // This catch block will now only trigger on network failures, not validation logic
//       toast.error("A network error occurred", { position: "top-center" });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">
//             System Users
//           </h1>
//           <p className="text-muted-foreground">
//             Configure access levels and roles for the HR platform.
//           </p>
//         </div>
//         {currentUser.role === "ADMIN" && (
//           <Button
//             onClick={() => setCreateOpen(true)}
//             className="shadow-lg hover:shadow-xl transition-all"
//           >
//             <Plus className="mr-2 h-4 w-4" /> Create User
//           </Button>
//         )}
//       </div>

//       {/* CONTENT CARD */}
//       <Card className="border-muted/60 shadow-sm overflow-hidden bg-card">
//         <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border/50 bg-muted/20">
//           <div className="flex items-center gap-2">
//             <UserCog className="h-5 w-5 text-muted-foreground" />
//             <h3 className="font-semibold text-foreground">Access List</h3>
//             <Badge variant="secondary" className="ml-2">
//               {filteredUsers.length}
//             </Badge>
//           </div>
//           <div className="relative w-full md:w-80">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Find by name or email..."
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
//                 <TableHead className="w-75 text-xs font-semibold uppercase tracking-wider">
//                   User Profile
//                 </TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider">
//                   Access Level
//                 </TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider">
//                   Account Status
//                 </TableHead>
//                 <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredUsers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="h-64 text-center">
//                     <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
//                       <div className="bg-muted/50 p-4 rounded-full">
//                         <KeyRound className="h-8 w-8 opacity-50" />
//                       </div>
//                       <div>
//                         <p className="font-medium text-lg">No users found</p>
//                         <p className="text-sm">
//                           Check your search criteria or add a new user
//                         </p>
//                       </div>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredUsers.map((user) => (
//                   <TableRow
//                     key={user.id}
//                     className="group hover:bg-muted/30 transition-colors"
//                   >
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-10 w-10 border border-muted/50">
//                           {/* 1. Show Image if it exists */}
//                           {user.image ? (
//                             <AvatarImage
//                               src={user.image}
//                               alt={user.name}
//                               className="object-cover"
//                             />
//                           ) : null}

//                           {/* 2. Show Initials if no image (Fallback) */}
//                           <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary font-bold">
//                             {user.name.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex flex-col">
//                           <span className="font-medium text-sm text-foreground">
//                             {user.name}
//                           </span>
//                           <span className="text-xs text-muted-foreground">
//                             {user.email}
//                           </span>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       {/* Role Badge with Icon */}
//                       <div
//                         className={`
//                          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border
//                          ${
//                            user.role === "ADMIN"
//                              ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
//                              : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
//                          }
//                        `}
//                       >
//                         {user.role === "ADMIN" ? (
//                           <ShieldCheck className="h-3.5 w-3.5" />
//                         ) : (
//                           <Shield className="h-3.5 w-3.5" />
//                         )}
//                         {user.role}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant="outline"
//                         className={`
//                           ${
//                             user.isActive
//                               ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
//                               : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400"
//                           }
//                         `}
//                       >
//                         {user.isActive ? "Active Account" : "Suspended"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {currentUser.role === "ADMIN" ? (
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100"
//                             >
//                               <span className="sr-only">Open menu</span>
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end" className="w-40">
//                             <DropdownMenuLabel>Account</DropdownMenuLabel>
//                             <DropdownMenuItem onClick={() => setEditUser(user)}>
//                               <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
//                               Modify Role
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                               className="text-red-600 dark:text-red-400 focus:text-red-600"
//                               onClick={() => promptDelete(user)}
//                             >
//                               <Trash2 className="mr-2 h-4 w-4" /> Delete User
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       ) : (
//                         <span className="text-xs text-muted-foreground italic pr-2 opacity-50">
//                           View Only
//                         </span>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Modals */}
//       <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />

//       {editUser && (
//         <EditUserModal
//           open={!!editUser}
//           user={editUser}
//           onOpenChange={(open) => !open && setEditUser(null)}
//         />
//       )}

//       {/* Delete Dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
//               <Trash2 className="h-5 w-5" /> Delete User Account
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               Permanently delete{" "}
//               <strong className="text-foreground">{selectedUser?.name}</strong>?
//               <br />
//               This user will immediately lose access to the platform.
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
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Delete...
//                 </>
//               ) : (
//                 "Delete User"
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
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
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  ShieldCheck,
  Shield,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

import { CreateUserModal } from "@/components/dashboard/modals/create-user-modal";
import { EditUserModal } from "@/components/dashboard/modals/edit-user-modal";
import { deleteUser } from "@/src/actions/users";

// --- TYPES ---
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  image: string | null;
};

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "HR";
  isActive: boolean;
};

type Props = {
  users: User[];
  currentUser: CurrentUser;
};

export default function UsersPageClient({ users, currentUser }: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FILTERING ---
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // --- STATS CALCULATION ---
  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  };

  // --- HANDLERS ---
  const promptDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);

    try {
      const result = await deleteUser(selectedUser.id);
      if (result.success) {
        toast.success("User access revoked successfully");
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("A network error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            System Users
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage access permissions and administrative roles.
          </p>
        </div>
        {currentUser.role === "ADMIN" && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        )}
      </div>

      {/* 2. STATS CARDS (New Addition) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-linear-to-br from-white to-blue-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 shadow-sm bg-linear-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Accounts
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 shadow-sm bg-linear-to-br from-white to-purple-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administrators
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* 3. MAIN CONTENT */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-slate-950">
        {/* Toolbar */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 focus:ring-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Showing {filteredUsers.length} records
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                <TableHead className="w-[300px] pl-6">User Profile</TableHead>
                <TableHead>Role Access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                        <UserX className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="font-medium">No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors border-slate-100 dark:border-slate-800"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                          {user.image ? (
                            <AvatarImage
                              src={user.image}
                              alt={user.name}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-foreground group-hover:text-indigo-600 transition-colors">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border
                          ${
                            user.role === "ADMIN"
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                              : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                          }
                        `}
                      >
                        {user.role === "ADMIN" ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <Shield className="h-3 w-3" />
                        )}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${user.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                        />
                        <span
                          className={`text-sm font-medium ${user.isActive ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}
                        >
                          {user.isActive ? "Active" : "Suspended"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {currentUser.role === "ADMIN" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Manage Access
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setEditUser(user)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4 text-indigo-500" />
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer"
                              onClick={() => promptDelete(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground opacity-50 select-none">
                          View Only
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />

      {editUser && (
        <EditUserModal
          open={!!editUser}
          user={editUser}
          onOpenChange={(open) => !open && setEditUser(null)}
        />
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Trash2 className="h-5 w-5" />
              </div>
              Delete User Account
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">{selectedUser?.name}</strong>?
              <br />
              <br />
              This action cannot be undone. The user will immediately lose
              access to the system.
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
