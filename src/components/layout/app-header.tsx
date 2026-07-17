// "use client";

import { Show, UserButton } from "@clerk/nextjs";
import { ThemeSwitcher } from "../themes/theme-switcher";
import { SidebarTrigger } from "../ui/sidebar";
import { RouteTitle } from "./route-title";
import { cn } from "@/lib/cn";

export type AppHeaderProps = {
  className?: string;
};

export function AppHeader({ className }: AppHeaderProps) {
  return (
    <div
      className={cn("flex gap-4 items-center shrink-0 py-4 px-6", className)}
    >
      <SidebarTrigger className="shrink-0" />

      <h1 className="text-2xl font-medium grow truncate min-w-0">
        <RouteTitle />
      </h1>

      <ThemeSwitcher />

      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
