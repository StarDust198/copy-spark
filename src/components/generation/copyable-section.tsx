"use client";

import { useEffect, useRef, useState } from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

type CopyableSectionProps = {
  title: string;
  content: string;
};

export function CopyableSection({ title, content }: CopyableSectionProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);

    setCopied(true);
    setOpen(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div className="group flex flex-col gap-1.5">
      <div className="flex items-center">
        <h3 className="text-sm font-medium">{title}</h3>

        {/* Force the tooltip open while `copied` is set so it stays visible
            for the full 3s, then fall back to hover state afterwards. */}
        <Tooltip open={open || copied} onOpenChange={setOpen}>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Copy"
                onClick={handleCopy}
                className={cn(
                  "opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
                  copied && "opacity-100",
                )}
              />
            }
          >
            <Copy />
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied" : "Copy"}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <p className="text-sm text-muted-foreground">{content}</p>
    </div>
  );
}
