import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  // Define "employeeImage" endpoint
  employeeImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", file.url);
      // This code runs on your server after upload
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;