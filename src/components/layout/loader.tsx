import { ReactNode } from "react";
import { Spinner } from "../ui/spinner";

export function Loader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <Spinner />

      <p className="text-center">{title}</p>

      {action}
    </div>
  );
}
