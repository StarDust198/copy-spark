"use client";

import { ReactNode, useState } from "react";
import type { Generation } from "@prisma/client";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Show, SignOutButton } from "@clerk/nextjs";
import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
  privateRoutes,
  publicRoutes,
  RouteData,
  RouteKey,
  SIGN_OUT_TITLE,
} from "@/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { generationOptions } from "@/lib/query/generations-options";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  EllipsisVertical,
  LayoutDashboardIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { useDeleteGeneration } from "@/lib/query/use-generation-hooks";
import { RenameGenerationDialog } from "./rename-generation-dialog";
import { TruncatedText } from "./truncated-text";

export type AppSidebarItem = {
  title: string;
  url: string;
  icon: ReactNode;
};

export type AppSidebarProps = {
  items: AppSidebarItem[];
};

const routeIconsMap: Record<RouteKey, ReactNode> = {
  signin: <ArrowRightEndOnRectangleIcon />,
  signup: <UserPlusIcon />,
  dashboard: <LayoutDashboardIcon />,
};

export function AppSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { state } = useSidebar();
  const { data: generations } = useQuery(generationOptions());

  const deleteChatMutation = useDeleteGeneration();

  const [renameTarget, setRenameTarget] = useState<Generation | null>(null);

  const isExpanded = state === "expanded";

  const handleDeleteGeneration = (generationId: string) => {
    deleteChatMutation.mutateAsync({
      id: generationId,
    });

    const paramsGenerationId = params.generationId;

    if (paramsGenerationId !== generationId) return;

    router.push("/dashboard");
  };

  const renderRouteGroup = (
    routeGroup: Partial<Record<RouteKey, RouteData>>,
  ) => {
    return Object.entries(routeGroup).map(([routeKey, { url, title }]) => {
      return (
        <SidebarMenuItem key={url}>
          <SidebarMenuButton
            tooltip={title}
            isActive={pathname === url}
            render={
              <Link href={url}>
                {routeIconsMap[routeKey as RouteKey]}

                <span>{title}</span>
              </Link>
            }
          />
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex justify-between items-center">
          {isExpanded && <h2 className="px-2 py-1 font-semibold">CopySpark</h2>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <Show when="signed-out">{renderRouteGroup(publicRoutes)}</Show>

              <Show when="signed-in">
                {renderRouteGroup(privateRoutes)}

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={SIGN_OUT_TITLE}
                    className="cursor-pointer"
                    render={
                      <SignOutButton>
                        <button className="cursor-pointer">
                          <ArrowRightStartOnRectangleIcon />

                          <span>{SIGN_OUT_TITLE}</span>
                        </button>
                      </SignOutButton>
                    }
                  />
                </SidebarMenuItem>
              </Show>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Show when="signed-in">
          <SidebarGroup className="min-h-0">
            <SidebarGroupLabel>Generations</SidebarGroupLabel>

            <SidebarGroupContent className="flex flex-col grow min-h-0 gap-0.5 px-1 overflow-hidden hover:overflow-y-auto">
              <SidebarMenu>
                {generations?.map((generation) => {
                  const chatUrl = `/generation/${generation.id}`;
                  const isActiveChat = pathname === chatUrl;

                  return (
                    <SidebarMenuItem
                      key={generation.id}
                      className="flex items-center gap-2 justify-between"
                    >
                      {/* TODO: Fix double tooltip on collapsed sidebar state  */}
                      <SidebarMenuButton
                        tooltip={generation.title}
                        isActive={isActiveChat}
                        className="pr-2! group-hover/menu-item:pr-8! group-focus-within/menu-item:pr-8! group-has-aria-expanded/menu-item:pr-8!"
                        render={
                          <Link href={chatUrl}>
                            <TruncatedText>{generation.title}</TruncatedText>
                          </Link>
                        }
                      />

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <SidebarMenuAction showOnHover>
                              <EllipsisVertical />

                              <span className="sr-only">
                                Generation actions
                              </span>
                            </SidebarMenuAction>
                          }
                        />

                        <DropdownMenuContent className="min-w-24">
                          <DropdownMenuItem
                            onClick={() => setRenameTarget(generation)}
                          >
                            <Pencil />
                            Rename
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            disabled={deleteChatMutation.isPending}
                            onClick={() =>
                              handleDeleteGeneration(generation.id)
                            }
                            variant="destructive"
                          >
                            <Trash2 />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Show>
      </SidebarContent>

      <RenameGenerationDialog
        key={renameTarget?.id}
        generation={renameTarget}
        open={!!renameTarget}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
      />
    </Sidebar>
  );
}
