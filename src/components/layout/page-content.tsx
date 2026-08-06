import { cn } from "@/lib/cn";
import { ReactNode } from "react";

export type PageContentProps = {
  className?: string;
  children: ReactNode;
};

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div
      className={cn(
        "h-full py-8 flex flex-col gap-8 justify-center-safe items-center overflow-y-hidden hover:overflow-y-auto scrollbar-gutter-both",
        className,
      )}
    >
      {children}
    </div>
  );
}
