"use client";

import React, { useState, useRef, useEffect } from "react";
import { ActivityMarketing } from "@/app/marketing/activity/columns";
import { cn } from "@/lib/utils";
import {
  format,
  startOfYear,
  endOfYear,
  eachYearOfInterval,
  eachMonthOfInterval,
  isBefore,
  isAfter,
} from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Calendar as CalendarIcon, ChevronDownIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/time-picker";
import RichTextEditor from "@/components/rich-text-editor";
import {
  MonthGridProps,
  CaptionLabelProps,
  MonthGridProps as ReactDayPickerMonthGridProps,
} from "react-day-picker";

interface CustomCaptionLabelProps extends CaptionLabelProps {
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CustomMonthGridProps extends ReactDayPickerMonthGridProps {
  className?: string;
  children: React.ReactNode;
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: Date;
  endDate: Date;
  years: Date[];
  currentYear: number;
  currentMonth: number;
  onMonthSelect: (date: Date) => void;
}

export type ActivityFormData = {
  date: string;
  time: string;
  receiver: string;
  brief: string;
  status: string;
};

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: ActivityMarketing | null;
  onSave: (data: ActivityFormData) => void;
}

// Calendar
const startDate = new Date(1980, 0); // Start Jan 1980
const endDate = new Date(2100, 11); // End Dec 2100
const years = eachYearOfInterval({
  start: startOfYear(startDate),
  end: endOfYear(endDate),
});

function CaptionLabel({
  children,
  isYearView,
  setIsYearView,
  ...props
}: CustomCaptionLabelProps) {
  return (
    <Button
      className="data-[state=open]:text-muted-foreground/80 -ms-2 flex items-center gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
      variant="ghost"
      size="sm"
      onClick={() => setIsYearView((prev: boolean) => !prev)}
      data-state={isYearView ? "open" : "closed"}
    >
      {children}
      <ChevronDownIcon
        className="text-muted-foreground/80 shrink-0 transition-transform duration-200 h-4 w-4"
        aria-hidden="true"
      />
    </Button>
  );
}

function MonthGrid({
  className,
  children,
  isYearView,
  currentYear,
  currentMonth,
  onMonthSelect,
}: CustomMonthGridProps) {
  const currentYearRef = useRef<HTMLDivElement>(null);
  const currentMonthButtonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isYearView && currentYearRef.current && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const yearElement = currentYearRef.current;
      const yearTop = yearElement.offsetTop;
      scrollContainer.scrollTop = yearTop;
      setTimeout(() => {
        currentMonthButtonRef.current?.focus();
      }, 100);
    }
  }, [isYearView]);

  return (
    <div className="relative">
      <table className={className}>{children}</table>
      {isYearView && (
        <div className="bg-background absolute inset-0 z-20 -mx-2 -mb-2">
          <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto w-full pr-2 scrollbar-hide"
          >
            {years.map((year) => {
              const months = eachMonthOfInterval({
                start: startOfYear(year),
                end: endOfYear(year),
              });
              const isCurrentYear = year.getFullYear() === currentYear;
              return (
                <div
                  key={year.getFullYear()}
                  ref={isCurrentYear ? currentYearRef : undefined}
                >
                  <CollapsibleYear
                    title={year.getFullYear().toString()}
                    open={isCurrentYear}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month) => {
                        const isDisabled =
                          isBefore(month, startDate) || isAfter(month, endDate);
                        const isCurrentMonth =
                          month.getMonth() === currentMonth &&
                          year.getFullYear() === currentYear;
                        return (
                          <Button
                            key={month.getTime()}
                            ref={
                              isCurrentMonth ? currentMonthButtonRef : undefined
                            }
                            variant={isCurrentMonth ? "default" : "outline"}
                            size="sm"
                            className="h-7 w-full"
                            disabled={isDisabled}
                            onClick={() => onMonthSelect(month)}
                            type="button"
                          >
                            {format(month, "MMM")}
                          </Button>
                        );
                      })}
                    </div>
                  </CollapsibleYear>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CollapsibleYear({
  title,
  children,
  open,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <Collapsible className="border-t px-2 py-1.5" defaultOpen={open}>
      <CollapsibleTrigger asChild>
        <Button
          className="flex w-full justify-start gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
          variant="ghost"
          size="sm"
          type="button"
        >
          <ChevronDownIcon
            className="text-muted-foreground/80 shrink-0 transition-transform duration-200 h-4 w-4"
            aria-hidden="true"
          />
          {title}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden px-3 py-1 text-sm transition-all">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ActivityForm({
  open,
  onOpenChange,
  activity,
  onSave,
}: ActivityFormProps) {
  const isEditMode = !!activity;

  const [date, setDate] = useState<Date | undefined>(
    activity?.date ? new Date(activity.date) : new Date(),
  );
  const [month, setMonth] = useState<Date>(date || new Date());
  const [isYearView, setIsYearView] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [timeValue, setTimeValue] = useState<string>(activity?.time || "00:00");

  const [briefContent, setBriefContent] = useState(activity?.brief || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: ActivityFormData = {
      date: date ? format(date, "yyyy-MM-dd") : "",
      time: timeValue,
      receiver: formData.get("receiver") as string,
      brief: formData.get("brief") as string,
      status: formData.get("status") as string,
    };

    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-300">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Make changes to the activity campaign here."
              : "Fill in the details to create a new activity campaign."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Select Date & Time
              </Label>
              <div className="col-span-3 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          if (newDate) {
                            setMonth(newDate);
                            setIsCalendarOpen(false);
                          }
                        }}
                        month={month}
                        onMonthChange={setMonth}
                        startMonth={startDate}
                        endMonth={endDate}
                        className="overflow-hidden rounded-md border p-2"
                        classNames={{
                          month_caption: "ml-2.5 mr-20 justify-start",
                          nav: "flex absolute w-fit right-0 items-center",
                        }}
                        components={{
                          CaptionLabel: (props: CaptionLabelProps) => (
                            <CaptionLabel
                              isYearView={isYearView}
                              setIsYearView={setIsYearView}
                              {...props}
                            />
                          ),
                          MonthGrid: (props: MonthGridProps) => (
                            <MonthGrid
                              className={props.className}
                              isYearView={isYearView}
                              setIsYearView={setIsYearView}
                              startDate={startDate}
                              endDate={endDate}
                              years={years}
                              currentYear={month.getFullYear()}
                              currentMonth={month.getMonth()}
                              onMonthSelect={(selectedMonth: Date) => {
                                setMonth(selectedMonth);
                                setIsYearView(false);
                              }}
                            >
                              {props.children}
                            </MonthGrid>
                          ),
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <input
                    type="hidden"
                    name="date"
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                  />
                </div>
                <TimePicker value={timeValue} onChange={setTimeValue} />
              </div>
            </div>

            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label htmlFor="receiver" className="text-right">
                Send To
              </Label>
              <div className="col-span-3">
                <Select name="receiver" defaultValue={activity?.receiver || ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label htmlFor="brief" className="text-right">
                Brief of Campaign
              </Label>
              <div className="col-span-3">
                <RichTextEditor
                  value={briefContent}
                  onChange={setBriefContent}
                />
                <input type="hidden" name="brief" value={briefContent} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditMode ? "Save Changes" : "Create Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
