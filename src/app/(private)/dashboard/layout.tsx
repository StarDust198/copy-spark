import { ReactNode } from "react";
import { PageContent } from "@/components/layout/page-content";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <PageContent
      title="Pick a template, get ready-to-use variants in seconds"
      description="What do you want to write today?"
    >
      {children}
    </PageContent>
  );
}
