import { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Providers from "./providers";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Separator } from "@base-ui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CopySpark — AI marketing copy generator",
    template: "%s · CopySpark", // child pages: "History · CopySpark"
  },
  description:
    "Generate ad headlines, product descriptions, and email subject lines in seconds. Pick a template, describe your product, get 5 ready-to-use variants.",
  openGraph: {
    title: "CopySpark — AI marketing copy generator",
    description:
      "Pick a template, describe your product, get 5 ready-to-use copy variants. Built with Next.js and the Vercel AI SDK.",
    // images: "",
    // url: "",
    type: "website",
    siteName: "CopySpark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-screen flex flex-col">
        <Providers>
          <AppSidebar />

          <SidebarInset className="flex flex-col flex-1 min-w-0">
            <AppHeader />

            <Separator />

            <div className="flex-1 min-h-0 max-w-5xl w-full mx-auto p-4">
              {children}
            </div>
          </SidebarInset>
        </Providers>
      </body>
    </html>
  );
}
