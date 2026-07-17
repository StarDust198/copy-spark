"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { ComponentProps, ReactNode, useEffect, useRef, useState } from "react";

export function TruncatedText({
  children,
  className,
  ...props
}: ComponentProps<"div"> & { children: ReactNode }) {
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
        disabled={!truncated}
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
