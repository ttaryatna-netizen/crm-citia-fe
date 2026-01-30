"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  TriangleAlertIcon,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityDetailSheet } from "@/components/marketing/activity-sheet";
import {
  ActivityForm,
  ActivityFormData,
} from "@/components/marketing/activity-form";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
//  import { id } from "date-fns/locale";
import { toast } from "sonner";

export type ActivityMarketing = {
  id: string;
  scheduledAt: string;
  brief: string;
  isSent: string;
  sentAt: string;
  color: string;
  client: {
    id: string;
    fullName: string;
    company: string;
  };
};

export const columns: ColumnDef<ActivityMarketing>[] = [
  {
    id: "no",
    meta: {
      className: "w-[100px]",
    },
    header: () => <div className="px-auto md:px-4">No</div>,
    cell: ({ row, table }) => {
      return (
        <div className="px-auto md:px-4">
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            row.index +
            1}
        </div>
      );
    },
  },
  {
    accessorKey: "scheduledAt",
    enableGlobalFilter: true,
    meta: {
      className: "w-[400px]",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date & Time
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const rawDate = row.getValue("scheduledAt") as string | Date;
      if (!rawDate) {
        return <div className="px-3 text-muted-foreground">-</div>;
      }
      const formattedDate = format(new Date(rawDate), "d MMMM yyyy 'at' HH.mm");
      return (
        <div className="flex items-center h-full px-3">
          <span className="text-sm">{formattedDate}</span>
        </div>
      );
    },
  },
  {
    id: "client",
    accessorFn: (row) => row.client?.fullName,
    meta: {
      className: "w-[500px]",
    },
    enableGlobalFilter: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Receiver
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center h-full px-3">
          <span className="text-sm">{row.getValue("client")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isSent",
    meta: {
      className: "w-[200px]",
    },
    enableGlobalFilter: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("isSent") as string;
      return (
        <div className="flex items-center h-full px-3">
          <Badge
            variant={status ? "default" : "destructive"}
            className={
              status
                ? "bg-green-500 hover:bg-green-600 border-transparent text-white"
                : ""
            }
          >
            {status ? "Sent" : "Not Sent"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableGlobalFilter: false,
    header: () => <div className="w-auto md:w-15 px-auto md:px-4">Action</div>,
    cell: ({ row, table }) => {
      return (
        <div className="w-auto md:w-15 px-0">
          <ActionCell
            activityMarketing={row.original}
            onSuccess={() => table.options.meta?.refreshData()}
          />
        </div>
      );
    },
  },
];

const ActionCell = ({
  activityMarketing,
  onSuccess,
}: {
  activityMarketing: ActivityMarketing;
  onSuccess: () => void;
}) => {
  const [openSheet, setOpenSheet] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting activity...");

    try {
      const response = await fetch(
        `${baseUrl}/api/marketing/activities/${activityMarketing.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      toast.success("Activity deleted", {
        id: toastId,
        description: `Activity has been removed.`,
      });
      onSuccess();
      setOpenDelete(false);
    } catch (error) {
      console.error(error);
      toast.error("Deletion failed", {
        id: toastId,
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleSaveEdit = async (formData: ActivityFormData) => {
    const toastId = toast.loading("Updating activity...");
    try {
      const response = await fetch(
        `${baseUrl}/api/marketing/activities/${activityMarketing.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update activity");
      }

      toast.success("Activity updated", {
        id: toastId,
        description: "Activity details have been updated successfully.",
      });

      onSuccess();
    } catch (err) {
      const error = err as Error;
      console.error(error);
      toast.error("Update failed", {
        id: toastId,
        description: error.message || "Failed to update activity.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/*Screen Small*/}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 flex md:hidden">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setOpenSheet(true)}
            className="cursor-pointer flex justify-between items-center focus:bg-gray-50 focus:text-blue-500"
          >
            Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenEdit(true)}
            className="cursor-pointer flex justify-between items-center focus:bg-gray-50 focus:text-yellow-500"
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="cursor-pointer flex justify-between items-center focus:bg-gray-50 focus:text-red-500"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/*Details*/}
      <ActivityDetailSheet
        open={openSheet}
        onOpenChange={setOpenSheet}
        activity={activityMarketing}
      />

      {/*Edit*/}
      <Button
        variant="ghost"
        onClick={() => setOpenEdit(true)}
        className="hover:bg-yellow-50 hover:text-yellow-600 hidden md:block"
      >
        Edit
      </Button>

      <ActivityForm
        open={openEdit}
        onOpenChange={setOpenEdit}
        activity={activityMarketing}
        onSave={handleSaveEdit}
      />

      {/*Delete*/}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-red-50 hover:text-red-500 hidden md:block"
          >
            Delete
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader className="items-center">
            <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
              <TriangleAlertIcon className="text-destructive size-6" />
            </div>
            <AlertDialogTitle>
              Are you absolutely sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This action cannot be undone. This will permanently delete the
              campaign activity to{" "}
              <span className="font-bold text-foreground">
                {activityMarketing.client.fullName}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
