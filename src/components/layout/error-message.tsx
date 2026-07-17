import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

export function ErrorMessage({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <AlertTriangle />

      <p className="text-center">{title}</p>

      {action}
    </div>
  );
}
