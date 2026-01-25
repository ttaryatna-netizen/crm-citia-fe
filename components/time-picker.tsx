"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string; // Format "HH:mm"
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);

  const [h = "00", m = "00"] = value?.split(":") ?? [];

  const setTime = (hh: string, mm: string) => {
    onChange(`${hh}:${mm}`);
  };

  const hourOptions = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
    [],
  );

  const minuteOptions = React.useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")),
    [],
  );

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");

    if (val.length > 2) {
      val = val.slice(-2);
    }

    setTime(val, m);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");

    if (val.length > 2) {
      val = val.slice(-2);
    }

    setTime(h, val);
  };

  const clamp = (num: number, max: number) =>
    Math.min(Math.max(num, 0), max).toString().padStart(2, "0");

  const handleBlur = (type: "hour" | "minute") => {
    if (type === "hour") {
      const parsed = parseInt(h, 10);
      const hh = isNaN(parsed) ? "00" : clamp(parsed, 23);
      setTime(hh, m);
    } else {
      const parsed = parseInt(m, 10);
      const mm = isNaN(parsed) ? "00" : clamp(parsed, 59);
      setTime(h, mm);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleListSelect = (type: "hour" | "minute", val: string) => {
    if (type === "hour") {
      setTime(val, m);
    } else {
      setTime(h, val);
      setOpen(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <div className="flex items-center w-full rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 pl-10 h-10">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                <ScrollArea className="h-full w-16 sm:w-20 p-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-center p-2 text-xs font-medium text-muted-foreground">
                      Hours
                    </div>
                    {hourOptions.map((option) => (
                      <Button
                        key={option}
                        variant={h === option ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleListSelect("hour", option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
                <ScrollArea className="h-full w-16 sm:w-20 p-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-center p-2 text-xs font-medium text-muted-foreground">
                      Min
                    </div>
                    {minuteOptions.map((option) => (
                      <Button
                        key={option}
                        variant={m === option ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleListSelect("minute", option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>

          <input
            ref={hourRef}
            type="text"
            value={h}
            onChange={handleHourChange}
            onBlur={() => handleBlur("hour")}
            onFocus={handleFocus}
            inputMode="numeric"
            className="w-8 bg-transparent text-center outline-none p-0 text-sm placeholder:text-muted-foreground"
            placeholder="HH"
          />

          <span className="mx-1 text-muted-foreground font-bold">:</span>

          <input
            ref={minuteRef}
            type="text"
            value={m}
            onChange={handleMinuteChange}
            onBlur={() => handleBlur("minute")}
            onFocus={handleFocus}
            inputMode="numeric"
            className="w-8 bg-transparent text-center outline-none p-0 text-sm placeholder:text-muted-foreground"
            placeholder="MM"
          />
          <div
            className="flex-1 h-full"
            onClick={() => hourRef.current?.focus()}
          />
        </div>
      </div>
    </div>
  );
}
