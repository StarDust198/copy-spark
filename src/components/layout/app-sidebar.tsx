"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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
import { Button } from "../ui/button";
import { EllipsisVertical, LayoutDashboardIcon } from "lucide-react";
import { useDeleteGeneration } from "@/lib/query/use-generation-hooks";

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
  const { state } = useSidebar();
  const { data: generations } = useQuery(generationOptions());

  const deleteChatMutation = useDeleteGeneration();

  const isExpanded = state === "expanded";

  // const isNewChatRoute = useMemo(() => {
  //   const match = pathname.match(/^\/chat\/([^/]+)$/);

  //   if (!match) return false;

  //   const id = match[1];

  //   return !chats?.map((chat) => chat.id).includes(id);
  // }, [chats, pathname]);

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

                {/* <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={NEW_CHAT_TITLE}
                    isActive={isNewChatRoute}
                    render={
                      <Link href="/chat">
                        <ChatBubbleLeftRightIcon />

                        <span>{NEW_CHAT_TITLE}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem> */}

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
                      <SidebarMenuButton
                        tooltip={generation.title}
                        isActive={isActiveChat}
                        render={
                          <Link href={chatUrl}>
                            <span className="truncate">{generation.title}</span>
                          </Link>
                        }
                      />

                      {!isActiveChat && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                className="shrink-0 md:not-group-hover/menu-item:not-data-popup-open:hidden group-data-[state=collapsed]:hidden"
                              >
                                <EllipsisVertical />
                              </Button>
                            }
                          />

                          <DropdownMenuContent>
                            <DropdownMenuItem
                              disabled={deleteChatMutation.isPending}
                              onClick={() =>
                                deleteChatMutation.mutateAsync({
                                  id: generation.id,
                                })
                              }
                            >
                              Delete Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Show>
      </SidebarContent>
    </Sidebar>
  );
}
