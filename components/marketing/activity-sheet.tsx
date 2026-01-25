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
import { ActivityMarketing } from "@/app/marketing/activity/columns";

interface ActivityDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityMarketing;
}

export function ActivityDetailSheet({
  open,
  onOpenChange,
  activity,
}: ActivityDetailSheetProps) {
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
      <SheetContent className="max-w-100 md:max-w-150 w-full overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            Campaign Details
          </SheetTitle>
          <SheetDescription>
            Review detailed information for selected campaign.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-3 p-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              Date
            </span>
            <span className="col-span-3 text-sm font-semibold">
              : {activity.date}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              Send To
            </span>
            <span className="col-span-3 text-sm font-semibold">
              : {activity.receiver}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              Time
            </span>
            <span className="col-span-3 text-sm font-semibold">
              : {activity.time}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              Brief of Campaign
            </span>
            <span className="col-span-3 text-sm font-semibold">
              : {activity.brief}
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
