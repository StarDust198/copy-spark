import { ReactNode } from "react";
import { PageContent } from "@/components/layout/page-content";

export default function Layout({ children }: { children: ReactNode }) {
  return <PageContent>{children}</PageContent>;
}
