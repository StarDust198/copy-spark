"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { ComponentProps, useEffect, useRef, useState } from "react";

type TruncatedTextProps = ComponentProps<"div"> & {
  tooltipDisabled?: boolean;
};

export function TruncatedText({
  children,
  className,
  tooltipDisabled,
  ...props
}: TruncatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => setTruncated(el.scrollWidth > el.clientWidth);
    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => ro.disconnect();
  }, [children]);

  return (
    <Tooltip>
      <TooltipTrigger
        disabled={!truncated || tooltipDisabled}
        render={
          <div ref={ref} className={cn("truncate", className)} {...props}>
            {children}
          </div>
        }
      />

      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}
