import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

type WeatherIconProps = React.HTMLProps<HTMLDivElement> & { iconName: string };

export default function WeatherIcon({ iconName, ...props }: WeatherIconProps) {
  return (
    <div {...props} className={cn('relative h-20 w-20', props.className)}>
      <Image
        width={80}
        height={80}
        alt="weather-icon"
        className="absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${iconName}@4x.png`}
      />
    </div>
  );
}