"use client";

import { format } from "date-fns";
import { Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ActivityMarketing } from "@/app/marketing/activity/columns";

interface CalendarDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  activities: ActivityMarketing[];
  onEdit: (activity: ActivityMarketing) => void;
  onDelete: (activity: ActivityMarketing) => void;
}

export function CalendarDetailSheet({
  open,
  onOpenChange,
  date,
  activities,
  onEdit,
  onDelete,
}: CalendarDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-100 w-full overflow-y-auto">
        <ScrollArea>
          <SheetHeader>
            <SheetTitle className="text-xl font-bold flex items-center">
              {date ? format(date, "EEEE, d MMMM yyyy") : "Details"}
            </SheetTitle>
            <SheetDescription>
              Scheduled activities for this day.
            </SheetDescription>
          </SheetHeader>

          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
              <p>No activities scheduled.</p>
            </div>
          ) : (
            <div>
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group relative flex gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className="w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: activity.color }}
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 font-normal">
                          <Clock className="h-3 w-3" />
                          {format(new Date(activity.scheduledAt), "HH:mm")}
                        </Badge>
                        <span className="font-semibold text-sm">
                          {activity.client.fullName}
                        </span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEdit(activity)}
                            className="focus:text-yellow-500"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:text-red-500"
                            onClick={() => onDelete(activity)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {activity.client.company}
                    </p>

                    <div className="mt-2 text-sm text-foreground/80">
                      <div
                        dangerouslySetInnerHTML={{ __html: activity.brief }}
                        className="prose prose-sm max-w-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
