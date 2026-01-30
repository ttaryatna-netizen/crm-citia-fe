"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardPlus } from "lucide-react";
import {
  ActivityForm,
  ActivityFormData,
} from "@/components/marketing/activity-form";
import { toast } from "sonner";

interface AddActivityButtonProps {
  onSuccess?: () => void;
}

export function AddActivityButton({ onSuccess }: AddActivityButtonProps) {
  const [open, setOpen] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleCreateActivity = async (formData: ActivityFormData) => {
    const toastId = toast.loading("Creating activity campaign...");
    try {
      const response = await fetch(`${baseUrl}/api/marketing/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: Failed to create activity`,
        );
      }

      toast.success("Activity Created", {
        id: toastId,
        description: "Activity has been successfully added.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const error = err as Error;
      console.error("Failed to create activity:", error);

      toast.error("Failed", {
        id: toastId,
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Add Campaign <ClipboardPlus className="ml-2 h-4 w-4" />
      </Button>

      <ActivityForm
        open={open}
        onOpenChange={setOpen}
        onSave={handleCreateActivity}
        activity={null}
      />
    </>
  );
}
