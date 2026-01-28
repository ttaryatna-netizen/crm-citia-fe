"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, User } from "lucide-react";
import { UserMarketing } from "@/app/marketing/users/columns";

interface UserDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserMarketing;
}

export function UserDetailSheet({
  open,
  onOpenChange,
  user,
}: UserDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-blue-50 hover:text-blue-500 hidden md:block"
        >
          Detail
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-70 md:max-w-100 w-full overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            User Details
          </SheetTitle>
          <SheetDescription>
            Review detailed information for selected user.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-3 p-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              Name
            </span>
            <span className="col-span-3 text-sm font-semibold">
              : {user.name}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              User Type
            </span>
            <span className="flex">
              :
              <Badge
                variant="secondary"
                className="font-normal capitalize ml-1 text-sm"
              >
                {user.type}
              </Badge>
            </span>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">
            <History className="h-4 w-4" /> Activity History
          </p>
          <div className="relative pl-2 space-y-6">
            <div className="absolute left-2 top-3 bottom-2 w-0.5 bg-muted" />

            <div className="relative pl-6">
              <div className="absolute -left-1.25 top-1 h-3 w-3 rounded-full bg-muted-foreground/30 ring-4 ring-background" />
              <p className="text-sm font-medium leading-none">
                Send campaign - 7 Jan 26
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                10:00 | Brief Send a price quotation for Item XXXX
              </p>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-1.25 top-1 h-3 w-3 rounded-full bg-muted-foreground/30 ring-4 ring-background" />
              <p className="text-sm font-medium leading-none">
                Send campaign - 7 Jan 26
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                10:00 | Brief Send a price quotation for Item XXXX
              </p>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-1.25 top-1 h-3 w-3 rounded-full bg-muted-foreground/30 ring-4 ring-background" />
              <p className="text-sm font-medium leading-none">
                Send campaign - 7 Jan 26
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                10:00 | Brief Send a price quotation for Item XXXX
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
