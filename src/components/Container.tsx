/** @format */

import React from "react";
import { cn } from "@/utils/cn";

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "w-full rounded-xl flex py-4 shadow-lg backdrop-filter backdrop-blur-lg bg-black/30 border border-white/20", // Glassmorphism styles
        props.className
      )}
    />
  );
}