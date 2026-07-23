import { CircleStop } from "lucide-react";
import { ReactNode } from "react";

export function StoppedMessage({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <CircleStop />

      <p className="text-center">{title}</p>

      {action}
    </div>
  );
}
