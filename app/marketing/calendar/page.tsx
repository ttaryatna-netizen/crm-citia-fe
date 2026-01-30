"use client";

import { useEffect, useState } from "react";
import CalendarView from "./calendar-view";
import { ActivityFormData } from "@/components/marketing/activity-form";
import { toast } from "sonner";
export const dynamic = "force-dynamic";
import { AddActivityButton } from "@/components/marketing/add-activity";
import { ActivityMarketing } from "@/app/marketing/activity/columns";

export default function Page() {
  const [activities, setActivities] = useState<ActivityMarketing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // fetch activities
  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/marketing/activities`);
      const json = await res.json();

      if (json.data) {
        setActivities(json.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to load calendar events.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // handle update
  const handleUpdate = async (id: string, data: ActivityFormData) => {
    const toastId = toast.loading("Updating activity...");
    try {
      const res = await fetch(`${baseUrl}/api/marketing/activities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Activity updated", {
        id: toastId,
        description: "Activity details have been updated successfully.",
      });
      fetchActivities();
    } catch (err) {
      const error = err as Error;
      console.error(error);
      toast.error("Update failed", {
        id: toastId,
        description: error.message || "Failed to update activity.",
      });
    }
  };

  // handle delete
  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting activity...");
    try {
      const res = await fetch(`${baseUrl}/api/marketing/activities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Activity deleted", {
        id: toastId,
        description: `Activity has been removed.`,
      });
      fetchActivities();
    } catch (error) {
      console.error(error);
      toast.error("Deletion failed", {
        id: toastId,
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-col">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Calendar Campaign
          </h3>
          <p className="text-sm text-muted-foreground">
            Create your campaign here
          </p>
        </div>
        <AddActivityButton onSuccess={fetchActivities} />
      </div>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Loading calendar...
          </div>
        ) : (
          <CalendarView
            activities={activities}
            onUpdateActivity={handleUpdate}
            onDeleteActivity={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
