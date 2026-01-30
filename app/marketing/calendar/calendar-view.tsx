"use client";

import * as motion from "motion/react-client";
import {
  Calendar,
  dateFnsLocalizer,
  View,
  Views,
  Navigate,
  ToolbarProps,
  EventPropGetter,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TriangleAlertIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/motion-tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDetailSheet } from "@/components/marketing/calendar-detail-sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ActivityForm,
  ActivityFormData,
} from "@/components/marketing/activity-form";
import { ActivityMarketing } from "@/app/marketing/activity/columns";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ActivityMarketing;
}

interface CalendarViewProps {
  activities: ActivityMarketing[];
  onUpdateActivity: (id: string, data: ActivityFormData) => void;
  onDeleteActivity: (id: string) => void;
}

const CustomToolbar = ({
  onNavigate,
  onView,
  view,
  label,
}: ToolbarProps<CalendarEvent>) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
      <h2 className="text-xl font-semibold capitalize text-foreground">
        {label}
      </h2>
      <div className="flex items-center gap-4 w-full md:w-auto justify-between">
        <div className="divide-primary-foreground/30 inline-flex w-fit divide-x rounded-md shadow-xs">
          <Button
            className="rounded-none rounded-l-md transition-none focus-visible:z-10"
            onClick={() => onNavigate(Navigate.PREVIOUS)}
            asChild
          >
            <motion.button whileTap={{ scale: 0.9 }}>
              <ChevronLeft />
            </motion.button>
          </Button>
          <Button
            className="rounded-none transition-none focus-visible:z-10"
            onClick={() => onNavigate(Navigate.TODAY)}
            asChild
          >
            <motion.button whileTap={{ scale: 0.9 }}>Today</motion.button>
          </Button>
          <Button
            className="rounded-none rounded-r-md transition-none focus-visible:z-10"
            onClick={() => onNavigate(Navigate.NEXT)}
            asChild
          >
            <motion.button whileTap={{ scale: 0.9 }}>
              <ChevronRight />
            </motion.button>
          </Button>
        </div>

        <Tabs
          value={view}
          onValueChange={(val) => onView(val as View)}
          className="w-full md:w-auto hidden md:block"
        >
          <TabsList className="bg-muted p-1 rounded-lg w-full md:w-auto">
            {["month", "week", "day", "agenda"].map((viewName) => (
              <TabsTrigger
                key={viewName}
                value={viewName}
                className="capitalize px-4 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                {viewName}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full capitalize gap-2 justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-normal">
                    View:
                  </span>
                  {view}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["month", "week", "day", "agenda"].map((viewName) => (
                <DropdownMenuItem
                  key={viewName}
                  onClick={() => onView(viewName as View)}
                  className="capitalize"
                >
                  {viewName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default function CalendarView({
  activities = [],
  onUpdateActivity,
  onDeleteActivity,
}: CalendarViewProps) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] =
    useState<ActivityMarketing | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] =
    useState<ActivityMarketing | null>(null);

  const events = useMemo(() => {
    return activities.map((activity) => {
      const start = new Date(activity.scheduledAt);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        id: activity.id,
        title: `${activity.client.fullName}`,
        start,
        end,
        resource: activity,
      };
    });
  }, [activities]);

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setSelectedDate(slotInfo.start);
    setIsSheetOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedDate(event.start);
    setIsSheetOpen(true);
  };

  const selectedDayActivities = useMemo(() => {
    if (!selectedDate) return [];
    return activities
      .filter((a) => isSameDay(new Date(a.scheduledAt), selectedDate))
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );
  }, [selectedDate, activities]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const color = event.resource.color || "#3b82f6";
    return {
      style: {
        backgroundColor: color,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "0.75rem",
      },
    };
  };

  const handleEditClick = (activity: ActivityMarketing) => {
    setActivityToEdit(activity);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (id: ActivityMarketing) => {
    setActivityToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (activityToDelete) {
      onDeleteActivity(activityToDelete.id);
      setIsDeleteOpen(false);
      setActivityToDelete(null);
    }
  };

  return (
    <>
      <div className="h-full py-4 calendar-wrapper font-sans antialiased">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", minHeight: "600px" }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          popup={true}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>

      {/*detail*/}
      <CalendarDetailSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        date={selectedDate}
        activities={selectedDayActivities}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/*edit*/}
      {activityToEdit && (
        <ActivityForm
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setActivityToEdit(null);
          }}
          activity={activityToEdit}
          onSave={(data) => {
            if (activityToEdit) {
              onUpdateActivity(activityToEdit.id, data);
            }
          }}
        />
      )}

      {/*Delete*/}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
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
                {activityToDelete?.client.fullName}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
