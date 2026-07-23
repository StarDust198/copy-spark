import { ReactNode } from "react";
import { EditGenerationDialog } from "@/components/generation/edit-generation-dialog";
import { GenerationDialogProvider } from "@/components/generation/generation-dialog-provider";

// The dialog is hosted here rather than inside the generation page because every
// edit-and-regenerate flips the row to PENDING and refreshes the route, which swaps
// the page's status branch and would take a page-level dialog down with it.
export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <GenerationDialogProvider>
      {children}

      <EditGenerationDialog />
    </GenerationDialogProvider>
  );
}
