// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { auth } from "@/lib/auth";
 
// const f = createUploadthing();
 
// export const ourFileRouter = {
//   // Define "employeeImage" endpoint
//   employeeImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete for userId:", file.url);
//       // This code runs on your server after upload
//     }),

//     userImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
//     .middleware(async ({ req }) => {
//       const session = await auth();
//       if (!session?.user) throw new Error("Unauthorized");
//       return { userId: session.user.id };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       return { url: file.url };
//     }),
// } satisfies FileRouter;
 
// export type OurFileRouter = typeof ourFileRouter;

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { requireAuth } from "@/lib/require-auth"; // 👈 Using the fixed file

const f = createUploadthing();

export const ourFileRouter = {
  // 1. Employee Image
  employeeImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // This will automatically throw "Unauthorized" if not logged in
      const user = await requireAuth(); 
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  // 2. User Profile Image
  userImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireAuth();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("User Image uploaded by:", metadata.userId);
      return { url: file.url };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;