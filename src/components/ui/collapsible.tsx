"use client";

import { ReactNode } from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/cn";

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  );
}

function CollapsibleChevronTrigger({
  title,
  className,
  ...props
}: Omit<CollapsiblePrimitive.Trigger.Props, "title"> & { title: ReactNode }) {
  return (
    <CollapsibleTrigger
      className={cn(
        "group/collapsible flex items-center gap-2 py-1",
        className,
      )}
      {...props}
    >
      <div>{title}</div>

      <ChevronDownIcon
        size={16}
        className="transition-transform group-data-panel-open/collapsible:-scale-y-100"
      />
    </CollapsibleTrigger>
  );
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
  );
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleChevronTrigger,
  CollapsibleContent,
};
