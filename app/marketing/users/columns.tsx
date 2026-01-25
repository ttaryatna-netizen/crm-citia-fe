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
import { UserDetailSheet } from "@/components/marketing/user-detail-sheet";
import { UserForm } from "@/components/marketing/user-form";
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

export type UserMarketing = {
  id: string;
  name: string;
  type: string;
};

export const columns: ColumnDef<UserMarketing>[] = [
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
    accessorKey: "name",
    meta: {
      className: "w-[400px]",
    },
    enableGlobalFilter: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
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
          <span className="text-sm">{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    meta: {
      className: "w-[400px]",
    },
    enableGlobalFilter: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Type
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
          <span className="text-sm">{row.getValue("type")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    meta: {
      className: "w-[200px]",
    },
    enableGlobalFilter: false,
    header: () => <div className="w-auto md:w-15 px-auto md:px-4">Action</div>,
    cell: ({ row }) => {
      return (
        <div className="w-auto md:w-15 px-0">
          <ActionCell userMarketing={row.original} />
        </div>
      );
    },
  },
];

const ActionCell = ({ userMarketing }: { userMarketing: UserMarketing }) => {
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

  const handleSaveEdit = async (formData: UserMarketing) => {
    console.log("Updating user:", userMarketing.id, formData);
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
      <UserDetailSheet
        open={openSheet}
        onOpenChange={setOpenSheet}
        user={userMarketing}
      />

      {/*Edit*/}
      <Button
        variant="ghost"
        onClick={() => setOpenEdit(true)}
        className="hover:bg-yellow-50 hover:text-yellow-600 hidden md:block"
      >
        Edit
      </Button>

      <UserForm
        open={openEdit}
        onOpenChange={setOpenEdit}
        user={userMarketing}
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
              user account for{" "}
              <span className="font-bold text-foreground">
                {userMarketing.name}
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
