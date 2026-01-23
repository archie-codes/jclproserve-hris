// // "use client";

// // import { Modal } from "@/components/ui/modal";
// // import { EditUserForm } from "../edit-user-form";

// // export function EditUserModal({
// //   open,
// //   onClose,
// //   user,
// // }: {
// //   open: boolean;
// //   onClose: () => void;
// //   user: any;
// // }) {
// //   return (
// //     <Modal open={open} onClose={onClose}>
// //       <h2 className="text-lg font-semibold mb-4">Edit User</h2>
// //       <EditUserForm user={user} />
// //     </Modal>
// //   );
// // }


// "use client";

// import { Modal } from "@/components/ui/modal";
// import { EditUserForm } from "../edit-user-form";

// export function EditUserModal({
//   open,
//   onClose,
//   user,
// }: {
//   open: boolean;
//   onClose: () => void;
//   user: any;
// }) {
//   return (
//     <Modal open={open} onClose={onClose}>
//       <div className="mb-4">
//         <h2 className="text-lg font-semibold">Edit User</h2>
//         <p className="text-sm text-muted-foreground">
//           Make changes to the user profile here. Click save when you're done.
//         </p>
//       </div>
      
//       {/* ✅ Pass onClose to the form so it can close the modal on success */}
//       <EditUserForm user={user} onSuccess={onClose} />
//     </Modal>
//   );
// }

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditUserForm } from "../edit-user-form";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

type Props = {
  open: boolean;
  user: User;
  onOpenChange: (open: boolean) => void;
};

export function EditUserModal({ open, user, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <EditUserForm
          user={user}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
