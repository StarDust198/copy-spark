"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getQueryClient } from "@/lib/query/get-query-client";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import type * as React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ClerkProvider
      appearance={{
        theme: "simple",
        variables: {
          colorPrimary: "var(--primary)",
          colorBackground: "var(--sidebar)",
          colorForeground: "var(--foreground)",
          colorMutedForeground: "var(--muted-foreground)",
          colorInput: "var(--input)",
          colorBorder: "var(--border)",
          borderRadius: "var(--radius)",
          fontFamily: "inherit",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <TooltipProvider>{children}</TooltipProvider>

            <Toaster />
            <ReactQueryDevtools />
          </SidebarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
