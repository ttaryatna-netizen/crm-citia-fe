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
import { useRouter } from "next/navigation";
import { ActivityDetailSheet } from "@/components/marketing/activity-sheet";
import { ActivityForm } from "@/components/marketing/activity-form";
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

export type ActivityMarketing = {
  id: string;
  date: string;
  time: string;
  receiver: string;
  brief: string;
  status: string;
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
    accessorKey: "date",
    enableGlobalFilter: true,
    meta: {
      className: "w-[200px]",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
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
          <span className="text-sm">{row.getValue("date")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    meta: {
      className: "w-[250px]",
    },
    enableGlobalFilter: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
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
          <span className="text-sm">{row.getValue("time")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "receiver",
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
          <span className="text-sm">{row.getValue("receiver")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
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
      const status = row.getValue("status") as string;
      const isSent = status?.toLowerCase() === "send";

      return (
        <div className="flex items-center h-full px-3">
          <Badge
            variant={isSent ? "default" : "destructive"}
            className={
              isSent
                ? "bg-green-500 hover:bg-green-600 border-transparent text-white"
                : ""
            }
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableGlobalFilter: false,
    header: () => <div className="w-auto md:w-15 px-auto md:px-4">Action</div>,
    cell: ({ row }) => {
      return (
        <div className="w-auto md:w-15 px-0">
          <ActionCell activityMarketing={row.original} />
        </div>
      );
    },
  },
];

const ActionCell = ({
  activityMarketing,
}: {
  activityMarketing: ActivityMarketing;
}) => {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    /* try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        router.refresh();

    } catch (error) {
        alert("Failed to delete user");
    }
    */
  };

  const handleSaveEdit = async (formData: ActivityMarketing) => {
    console.log("Updating user:", activityMarketing.id, formData);
    // await fetch(`/api/users/${userMarketing.id}`, { method: 'PUT', body: ... })
    router.refresh();
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
        onSave={(data) => console.log("Save:", data)}
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
              activity campaign to{" "}
              <span className="font-bold text-foreground">
                {activityMarketing.receiver}
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
