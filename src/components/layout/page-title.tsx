import { cn } from "@/lib/cn";

export type PageTitleProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h1 className="text-xl text-center">{title}</h1>

      {description ? (
        <p className="text-muted-foreground text-center">{description}</p>
      ) : null}
    </div>
  );
}
