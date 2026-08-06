import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Frown className="w-10 h-10" />
      <h2 className="text-xl font-semibold">404</h2>
      <p>Page not found</p>

      <Link
        href="/dashboard"
        className={buttonVariants({
          variant: "ghost",
        })}
      >
        Go Back
      </Link>
    </div>
  );
}
