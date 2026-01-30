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
import { ActivityMarketing } from "@/app/marketing/activity/columns";
import { format } from "date-fns";

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
      <SheetContent className="max-w-100 w-full overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            Campaign Details
          </SheetTitle>
          <SheetDescription>
            Review detailed information for selected campaign.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-3 p-4 pt-0">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              Date
            </span>
            <span className="col-span-3 text-sm font-semibold">
              :{" "}
              {activity.scheduledAt
                ? format(new Date(activity.scheduledAt), "d MMMM yyyy")
                : "-"}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              Time
            </span>
            <span className="col-span-3 text-sm font-semibold">
              :{" "}
              {activity.scheduledAt
                ? format(new Date(activity.scheduledAt), "HH:mm")
                : "-"}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              Send To
            </span>
            <span className="col-span-3 text-sm font-semibold">
              : {activity.client.fullName}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <span className="font-semibold col-span-1 text-sm text-muted-foreground">
              Brief of Campaign
            </span>
            <div className="col-span-3 flex text-sm">
              <span className="font-semibold mr-2 shrink-0">:</span>
              <div
                className="
                    flex-1
                    /* Styling Manual agar rapi (Solusi 1) */
                    [&_p]:mb-2 [&_p]:leading-relaxed last:[&_p]:mb-0
                    [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2
                    [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-2
                    [&_strong]:font-bold
                    text-muted-foreground
                  "
                dangerouslySetInnerHTML={{
                  __html: activity.brief || "<p>-</p>",
                }}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
