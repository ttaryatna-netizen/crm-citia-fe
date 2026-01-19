"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, Trash2, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

export type User = {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  role: {
    id: string;
    name: string;
  };
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
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
          <span className="text-sm">
            {row.getValue("fullName")}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "email",
    enableGlobalFilter: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
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
          <span className="text-sm">
            {row.getValue("email")}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "isActive",
    enableGlobalFilter: false,
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
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="flex items-center h-full px-3">
          <Badge
            className={cn(
              "capitalize shadow-none",
              isActive 
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            {isActive? "Active" : "Inactive"}
          </Badge>
        </div>
      )
    }
  },
  {
    accessorKey: "role.name",
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
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
      const roleName = row.original.role?.name || "-";
      return (
        <div className="flex items-center h-full px-3">
          <span className="text-sm">
            {roleName}
          </span>
        </div>
      )
    }
  },
  {
    id: "actions",
    enableGlobalFilter: false,
    header: "Action",
    cell: ({ row }) => <ActionCell user={row.original} />,
  },
];

const ActionCell = ({ user }: { user: User }) => {
  const router = useRouter();

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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <div className='bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full'>
            <TriangleAlertIcon className='text-destructive size-6' />
          </div>
          <AlertDialogTitle>Are you absolutely sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription className='text-center'>
            This action cannot be undone. This will permanently delete the user account for{" "}
            <span className="font-bold text-foreground">{user.fullName}</span>.
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
  );
};
