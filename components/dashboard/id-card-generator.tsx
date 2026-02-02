"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IdCard, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface IdCardProps {
  employee: {
    firstName: string;
    lastName: string;
    middleName?: string | null;
    position: string | null;
    department: string | null;
    employeeNo: string;
    imageUrl?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    sssNo?: string | null;
    tinNo?: string | null;
    philHealthNo?: string | null;
    pagIbigNo?: string | null;
  };
}

// Helper to load image from URL to Base64
async function loadImage(url: string): Promise<string | null> {
  if (!url) return null;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
}

export function IdCardGenerator({ employee }: IdCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateID = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating ID Card PDF...");

    try {
      // 1. Load Assets (Employee Photo + Template Backgrounds)
      // NOTE: Ensure these 2 images exist in your /public folder
      const frontTemplate = await loadImage("/id-front.jpg");
      const backTemplate = await loadImage("/id-back.jpg");
      
      let userPhoto: string | null = null;
      if (employee.imageUrl) {
        userPhoto = await loadImage(employee.imageUrl);
      }

      if (!frontTemplate || !backTemplate) {
        throw new Error("Could not load ID Card templates. Please ensure /public/id-front.jpg and /public/id-back.jpg exist.");
      }

      // 2. Setup PDF (Portrait CR80 Size: 54mm x 85.6mm)
      const doc = new jsPDF({
        orientation: "p", // Portrait
        unit: "mm",
        format: [54, 85.6], 
      });

      // ==========================================
      // PAGE 1: FRONT
      // ==========================================
      
      // A. Draw Background Template
      doc.addImage(frontTemplate, "JPEG", 0, 0, 54, 85.6);

      // B. Place Employee Photo
      // Coordinates estimated based on your image
      // We draw a white box first to cover the "1x1 PICTURE" text
      const photoX = 14.5;
      const photoY = 25.5;
      const photoSize = 25; // 25mm square (approx 1 inch)
      
      doc.setFillColor(255, 255, 255);
      doc.rect(photoX, photoY, photoSize, photoSize, "F"); 

      if (userPhoto) {
        doc.addImage(userPhoto, "JPEG", photoX, photoY, photoSize, photoSize);
      } else {
        // Fallback: Initials if no photo
        doc.setFontSize(20);
        doc.setTextColor(200);
        doc.text(employee.firstName[0], 27, 38, { align: "center" });
      }
      // Add a thin border around photo to match design style
      doc.setDrawColor(50); 
      doc.setLineWidth(0.1);
      doc.rect(photoX, photoY, photoSize, photoSize);


      // C. NAME
      // We assume the template has the word "NAME". We "White Out" it first.
      doc.setFillColor(242, 242, 242); // Match the light grey bg of the card roughly, or just white
      // Actually the card bg is textured white. Pure white might stand out slightly but is cleaner for text.
      doc.setFillColor(255, 255, 255); 
      
      // Cover "NAME" placeholder
      doc.rect(5, 62, 44, 5, "F"); 
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const fullName = `${employee.firstName} ${employee.lastName}`.toUpperCase();
      doc.text(fullName, 27, 66, { align: "center" }); // 27 is horizontal center


      // D. POSITION
      // Cover "POSITION" placeholder
      doc.rect(5, 71, 44, 5, "F");

      doc.setFont("helvetica", "bold"); // Changed to Bold to match ID style
      doc.setFontSize(8);
      // If position is long, shrink font
      const position = (employee.position || "STAFF").toUpperCase();
      if (position.length > 20) doc.setFontSize(6);
      doc.text(position, 27, 75, { align: "center" });


      // E. ID NO
      // The template says "ID NO.: _______". We want to overlay the number on the line.
      // We don't need to white out the label "ID NO.:", just place the text next to it.
      // Based on image, the line starts around x=22
      doc.setFont("courier", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(employee.employeeNo, 24, 79);


      // ==========================================
      // PAGE 2: BACK
      // ==========================================
      doc.addPage();
      doc.addImage(backTemplate, "JPEG", 0, 0, 54, 85.6);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5); // Adjust to match template text size
      doc.setTextColor(0, 0, 0);

      // COORDS (Estimated from uploaded image)
      const valueX = 22; // X position for values

      // 1. SSS No
      // Label is at Y ~19. Value goes next to it.
      doc.text(employee.sssNo || "N/A", valueX, 19.5);

      // 2. TIN No
      doc.text(employee.tinNo || "N/A", valueX, 23);

      // 3. PHIC No
      doc.text(employee.philHealthNo || "N/A", valueX, 26.5);

      // 4. HDMF No
      doc.text(employee.pagIbigNo || "N/A", valueX, 30);


      // 5. EMERGENCY CONTACT NAME
      // The line is labeled "Name: _________". 
      // We write on top of the line.
      const emergNameY = 38.5;
      const emergNameX = 16; 
      doc.setFontSize(8);
      doc.text(employee.emergencyContactName || "N/A", emergNameX, emergNameY);


      // 6. EMERGENCY CONTACT NO
      // The line is labeled "Contact No.: ________".
      const emergContactY = 43;
      const emergContactX = 22;
      doc.text(employee.emergencyContactPhone || "N/A", emergContactX, emergContactY);


      // 3. Save PDF
      doc.save(`${employee.lastName}_ID_Card.pdf`);
      toast.success("ID Card PDF Generated!", { id: toastId });

    } catch (error) {
      console.error(error);
      toast.error("Failed to generate ID. Missing templates?", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={generateID} 
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <IdCard className="h-4 w-4" />}
      Generate ID
    </Button>
  );
}