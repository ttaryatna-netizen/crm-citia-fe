"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ActivityMarketing } from "@/app/marketing/activity/columns";
import { cn } from "@/lib/utils";
import {
  format,
  startOfYear,
  endOfYear,
  eachYearOfInterval,
  eachMonthOfInterval,
  setHours,
  setMinutes,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Calendar as CalendarIcon,
  ChevronDownIcon,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/time-picker";
import RichTextEditor from "@/components/rich-text-editor";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DayPickerProps } from "react-day-picker";

const formSchema = z.object({
  scheduledAt: z.any().transform((val) => {
    if (val instanceof Date) return val;
    if (typeof val === "string" || typeof val === "number")
      return new Date(val);
    return new Date();
  }),
  clientId: z.string().min(1, "Client is required"),
  brief: z.string().refine(
    (value) => {
      const cleanText = value.replace(/<[^>]*>/g, "").trim();
      return cleanText.length > 0;
    },
    {
      message: "Brief description is required.",
    },
  ),
  color: z.string().min(1, "Color is required"),
});

type ActivityFormValues = z.infer<typeof formSchema>;

export type ActivityFormData = Omit<ActivityFormValues, "clientId"> & {
  clientId: string;
};

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: ActivityMarketing | null;
  onSave: (data: ActivityFormData) => void;
}

type ClientOption = {
  id: string;
  fullName: string;
};

const startDate = new Date(1980, 0);
const endDate = new Date(2100, 11);
const years = eachYearOfInterval({
  start: startOfYear(startDate),
  end: endOfYear(endDate),
});

const colorOptions = [
  { value: "#ef4444", label: "Merah", tw: "bg-red-500 border-red-500" },
  { value: "#f97316", label: "Jingga", tw: "bg-orange-500 border-orange-500" },
  { value: "#eab308", label: "Kuning", tw: "bg-yellow-500 border-yellow-500" },
  { value: "#22c55e", label: "Hijau", tw: "bg-green-500 border-green-500" },
  { value: "#3b82f6", label: "Biru", tw: "bg-blue-500 border-blue-500" },
  { value: "#6366f1", label: "Nila", tw: "bg-indigo-500 border-indigo-500" },
  { value: "#a855f7", label: "Ungu", tw: "bg-purple-500 border-purple-500" },
  { value: "#64748b", label: "Abu-abu", tw: "bg-slate-500 border-slate-500" },
];

export function ActivityForm({
  open,
  onOpenChange,
  activity,
  onSave,
}: ActivityFormProps) {
  const isEditMode = !!activity;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isYearView, setIsYearView] = useState(false);
  const [month, setMonth] = useState<Date>(new Date());

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [isClientOpen, setIsClientOpen] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduledAt: new Date(),
      clientId: "",
      brief: "",
      color: "",
    },
  });

  // Reset form
  useEffect(() => {
    if (open) {
      form.reset({
        scheduledAt: activity?.scheduledAt
          ? new Date(activity.scheduledAt)
          : new Date(),
        clientId: activity?.client?.id || "",
        brief: activity?.brief || "",
        color: activity?.color?.trim() || "",
      });
      if (activity?.scheduledAt) {
        setMonth(new Date(activity.scheduledAt));
      }
      setSearchQuery("");
    }
  }, [open, activity, form]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      const fetchClients = async () => {
        setLoadingClients(true);
        try {
          const query = new URLSearchParams({
            page: "1",
            limit: "20",
            search: searchQuery,
          });

          const res = await fetch(
            `${baseUrl}/api/marketing/clients?${query.toString()}`,
          );
          const data = await res.json();
          setClients(data.data || []);
        } catch (error) {
          console.error("Failed to fetch clients", error);
        } finally {
          setLoadingClients(false);
        }
      };
      fetchClients();
    }, 300);

    return () => clearTimeout(timer);
  }, [open, searchQuery, baseUrl]);

  const onSubmit = (values: ActivityFormValues) => {
    const payload: ActivityFormData = {
      ...values,
      clientId: values.clientId,
    };
    onSave(payload);
    onOpenChange(false);
  };

  const handleTimeChange = (timeStr: string) => {
    if (!timeStr) return;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const currentDate = form.getValues("scheduledAt") || new Date();
    const newDate = setMinutes(setHours(currentDate, hours), minutes);
    form.setValue("scheduledAt", newDate, { shouldDirty: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Activity" : "Create Activity"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Make changes to the campaign activity here."
              : "Fill in the form to create a new campaign activity."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-start gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right pt-2">Date & Time</FormLabel>
                  <div className="col-span-3 grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                const current = field.value || new Date();
                                const newDate = setMinutes(
                                  setHours(date, current.getHours()),
                                  current.getMinutes(),
                                );
                                field.onChange(newDate);
                                setMonth(newDate);
                              }
                            }}
                            month={month}
                            onMonthChange={setMonth}
                            className="overflow-hidden rounded-md border p-2"
                            classNames={{
                              month_caption: "ml-2.5 mr-20 justify-start",
                              nav: "flex absolute w-fit right-0 items-center",
                            }}
                            components={{
                              CaptionLabel: (props) => (
                                <CaptionLabel
                                  isYearView={isYearView}
                                  setIsYearView={setIsYearView}
                                  {...props}
                                />
                              ),
                              MonthGrid: (props) => (
                                <MonthGrid
                                  className={props.className}
                                  isYearView={isYearView}
                                  setIsYearView={setIsYearView}
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
                    </div>

                    <div className="col-span-1">
                      <TimePicker
                        value={
                          field.value ? format(field.value, "HH:mm") : "00:00"
                        }
                        onChange={handleTimeChange}
                      />
                    </div>
                  </div>
                  <FormMessage className="md:col-start-2 md:col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-center gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right">Client</FormLabel>
                  <div className="col-span-3">
                    <Popover open={isClientOpen} onOpenChange={setIsClientOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isClientOpen}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? clients.find(
                                  (client) => client.id === field.value,
                                )?.fullName || "Selected Client"
                              : loadingClients
                                ? "Loading..."
                                : "Select client..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[375px] p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search client..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList>
                            {loadingClients ? (
                              <div className="py-6 text-center text-sm text-muted-foreground">
                                Loading...
                              </div>
                            ) : clients.length === 0 ? (
                              <CommandEmpty>No client found.</CommandEmpty>
                            ) : (
                              <CommandGroup>
                                {clients.map((client) => (
                                  <CommandItem
                                    key={client.id}
                                    value={client.fullName}
                                    onSelect={() => {
                                      form.setValue("clientId", client.id);
                                      setIsClientOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === client.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span>{client.fullName}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-start gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right pt-2">Label Color</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-wrap gap-3"
                      >
                        {colorOptions.map((color) => (
                          <FormItem
                            key={color.value}
                            className="flex items-center space-x-0 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={color.value}
                                className={cn(
                                  "h-6 w-6 rounded-full cursor-pointer transition-all text-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-background data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:scale-110",
                                  color.tw,
                                )}
                                aria-label={color.label}
                              />
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brief"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-start gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right pt-2">Brief</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Save Changes" : "Create Activity"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface CustomCaptionLabelProps {
  children?: React.ReactNode;
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
}

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
      onClick={() => setIsYearView((prev) => !prev)}
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

interface CustomMonthGridProps {
  className?: string;
  children: React.ReactNode;
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
  currentYear: number;
  currentMonth: number;
  onMonthSelect: (date: Date) => void;
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
      scrollContainerRef.current.scrollTop = currentYearRef.current.offsetTop;
      setTimeout(() => currentMonthButtonRef.current?.focus(), 100);
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
                      {eachMonthOfInterval({
                        start: startOfYear(year),
                        end: endOfYear(year),
                      }).map((month) => {
                        const isCurrent =
                          month.getMonth() === currentMonth &&
                          year.getFullYear() === currentYear;
                        return (
                          <Button
                            key={month.getTime()}
                            ref={isCurrent ? currentMonthButtonRef : undefined}
                            variant={isCurrent ? "default" : "outline"}
                            size="sm"
                            className="h-7 w-full"
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
