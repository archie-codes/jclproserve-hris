"use client";

import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  User as UserIcon,
} from "lucide-react";
import { CreateUserModal } from "@/components/dashboard/modals/create-user-modal";
import { EditUserModal } from "@/components/dashboard/modals/edit-user-modal";
import { DeleteUserModal } from "@/components/dashboard/modals/delete-user-modal";

// Define a type for your role logic if needed
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
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
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Optional: Simple search state (visual only for now)
  const [searchQuery, setSearchQuery] = useState("");

  // Simple client-side filtering (optional)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-1">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your team members and their account permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              className="h-10 w-50 rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 lg:w-75"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Add Button */}
          {/* <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </button> */}
          {currentUser.role === "ADMIN" && (
            <button
              onClick={() => setCreateOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Add User
            </button>
          )}
        </div>
      </div>

      {/* 2. USER TABLE / LIST */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        {filteredUsers.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <UserIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No users found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              {users.length === 0
                ? "Get started by creating a new user."
                : "No results match your search terms."}
            </p>
            {users.length === 0 && (
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Create your first user
              </button>
            )}
          </div>
        ) : (
          // Table Layout
          <div className="w-full overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 align-middle font-medium">Name</th>
                  <th className="h-12 px-4 align-middle font-medium">Role</th>
                  <th className="h-12 px-4 align-middle font-medium">Status</th>
                  <th className="h-12 px-4 align-middle font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        {/* Avatar Placeholder */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {u.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${u.isActive ? "bg-green-500" : "bg-gray-300"}`}
                        />
                        <span
                          className={
                            u.isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        {/* <button
                          onClick={() => setEditUser(u)}
                          className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit User"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteUser(u)}
                          className="p-2 hover:bg-red-50 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button> */}
                        {currentUser.role === "ADMIN" && (
                          <>
                            <button onClick={() => setEditUser(u)}>
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button onClick={() => setDeleteUser(u)}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. MODALS */}
      <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />

      {/* We conditionally render these to ensure fresh state when opening */}
      {editUser && (
        <EditUserModal
          open={!!editUser}
          user={editUser}
          onOpenChange={(open) => !open && setEditUser(null)}
        />
      )}

      {deleteUser && (
        <DeleteUserModal
          open={true}
          user={deleteUser}
          onOpenChange={(open) => !open && setDeleteUser(null)}
        />
      )}
    </div>
  );
}
