import { cn } from "@/lib/cn";
import { PageTitle } from "./page-title";
import { ReactNode } from "react";

export type PageContentProps = {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function PageContent({
  title,
  description,
  children,
  className,
}: PageContentProps) {
  return (
    <div className={cn("flex flex-col gap-8 h-full py-8", className)}>
      {title && (
        <PageTitle
          title={title}
          description={description}
          className="shrink-0"
        />
      )}

      <div className="grow min-h-0 overflow-y-hidden hover:overflow-y-auto scrollbar-gutter-both py-1">
        <div className="flex flex-col items-center justify-center min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
