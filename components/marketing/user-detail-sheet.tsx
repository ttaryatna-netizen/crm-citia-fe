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
import { format } from "date-fns";
import useSWR from "swr";
import { ScrollArea } from "@/components/ui/scroll-area";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UserDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

interface ClientCategory {
  id: number;
  name: string;
}

interface Activity {
  id: string;
  scheduledAt: Date | string;
  brief: string;
}

interface UserDetail {
  id: string;
  fullName: string;
  company: string;
  title?: string | null;
  personalInformation?: string | null;
  clientCategory: ClientCategory;
  activities?: Activity[];
}

export function UserDetailSheet({
  open,
  userId,
  onOpenChange,
}: UserDetailSheetProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const { data, isLoading } = useSWR(
    open && userId ? `${baseUrl}/api/marketing/clients/${userId}` : null,
    fetcher,
  );

  const user: UserDetail | undefined = data?.data || data;

  const formatDate = (date: string | Date, formatStr: string) => {
    try {
      return format(new Date(date), formatStr);
    } catch (e) {
      return "-";
    }
  };

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
        <ScrollArea>
          <SheetHeader className="text-left">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              User Details
            </SheetTitle>
            <SheetDescription>
              Review detailed information for selected user.
            </SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Loading details...
            </div>
          ) : !user ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              User data not found.
            </div>
          ) : (
            <>
              <div className="grid gap-3 p-4 pt-0">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold col-span-1 text-sm text-muted-foreground">
                    Name
                  </span>
                  <span className="col-span-3 text-sm font-semibold">
                    : {user.fullName}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold col-span-1 text-sm text-muted-foreground">
                    Category
                  </span>
                  <span className="flex items-center col-span-3">
                    <span className="text-sm font-semibold">:</span>
                    <Badge
                      variant="secondary"
                      className="font-normal capitalize ml-1 text-sm"
                    >
                      {user.clientCategory?.name || "-"}
                    </Badge>
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold col-span-1 text-sm text-muted-foreground">
                    Company
                  </span>
                  <span className="col-span-3 text-sm font-semibold">
                    : {user.company}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold col-span-1 text-sm text-muted-foreground">
                    Title
                  </span>
                  <span className="col-span-3 text-sm font-semibold">
                    : {user.title || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="font-semibold col-span-1 text-sm text-muted-foreground pt-1">
                    Personal Information
                  </span>
                  <span className="col-span-3 text-sm font-semibold">
                    : {user.personalInformation || "-"}
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <p className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">
                  <History className="h-4 w-4" /> Activity History
                </p>
                <div className="relative pl-2 space-y-6">
                  <div className="absolute left-2 top-3 bottom-2 w-0.5 bg-muted" />

                  {/* Loop activity client */}
                  {user.activities && user.activities.length > 0 ? (
                    user.activities.map((activity) => (
                      <div key={activity.id} className="relative pl-6">
                        <div className="absolute -left-1.25 top-0.5 h-3 w-3 rounded-full bg-muted-foreground/70 ring-4 ring-background" />

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center">
                            <span className="text-sm font-medium leading-none">
                              Send campaign -{" "}
                              {formatDate(activity.scheduledAt, "dd MMM yyyy")}{" "}
                              • {formatDate(activity.scheduledAt, "HH:mm")}
                            </span>
                          </div>
                          <div
                            className="
                              text-sm mt-1 text-muted-foreground
                              /* Styling untuk konten HTML dari Tiptap */
                              [&_p]:mb-1 [&_p]:leading-normal last:[&_p]:mb-0
                              [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-1
                              [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-1
                              [&_strong]:font-semibold text-justify
                            "
                            dangerouslySetInnerHTML={{
                              __html:
                                activity.brief ||
                                "<p class='italic text-xs'>No brief content</p>",
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="pl-8 text-sm text-muted-foreground italic">
                      No activity history found.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
