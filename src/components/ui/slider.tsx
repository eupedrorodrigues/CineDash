import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number[];
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
  className?: string;
}

export function Slider({
  value,
  max,
  step,
  onValueChange,
  className,
}: SliderProps) {
  return (
    <input
      type="range"
      min={0}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      className={cn(
        "h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border/60 accent-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
        className,
      )}
    />
  );
}
