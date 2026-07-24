"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { type EditGenerationFormValues } from "@/components/forms";
import { TemplateId } from "@/constants/templates";

export type GenerationDialogTarget = {
  templateId: TemplateId;
  input: unknown;
  model: string;
};

// Registered by whichever view currently owns the generation — the streamer, the
// result, the error panel or the poller. The dialog outlives all of them, so it has
// to call through the live registration instead of a handler captured when it was
// opened: an edit submitted from the result page refreshes the route, which swaps
// `GenerationResult` for `GenerationStreamer` while the dialog stays put.
export type GenerationController = {
  isStreaming: boolean;
  hasError: boolean;
  stop?: () => void;
  editRegenerate: (fields: EditGenerationFormValues) => void | Promise<void>;
};

type GenerationDialogActions = {
  openDialog: (target: GenerationDialogTarget) => void;
  // Leaves an already-open dialog alone. Takes the updater form so callers never
  // have to subscribe to `target` just to ask whether it is open.
  ensureDialogOpen: (target: GenerationDialogTarget) => void;
  closeDialog: () => void;
  registerController: (controller: GenerationController | null) => void;
  stop: () => void;
  editRegenerate: (fields: EditGenerationFormValues) => void | Promise<void>;
};

type GenerationDialogState = {
  target: GenerationDialogTarget | null;
  isStreaming: boolean;
  hasController: boolean;
  hasError: boolean;
};

// Two contexts, deliberately: the actions object is stable for as long as the route
// is, so the views that only register into it never re-render when the streaming flag
// flips — only the dialog does.
const GenerationDialogActionsContext =
  createContext<GenerationDialogActions | null>(null);
const GenerationDialogStateContext =
  createContext<GenerationDialogState | null>(null);

export function useGenerationDialogActions() {
  const actions = useContext(GenerationDialogActionsContext);

  if (!actions) {
    throw new Error(
      "useGenerationDialogActions must be used inside GenerationDialogProvider",
    );
  }

  return actions;
}

export function useGenerationDialogState() {
  const state = useContext(GenerationDialogStateContext);

  if (!state) {
    throw new Error(
      "useGenerationDialogState must be used inside GenerationDialogProvider",
    );
  }

  return state;
}

// Keeps the provider pointed at the controller of whatever is mounted right now.
// The callbacks are read through a ref so a re-render of the owner does not force a
// re-registration — only the streaming flag does, because that one has to re-render
// the dialog.
export function useRegisterGenerationController(
  controller: GenerationController,
) {
  const { registerController } = useGenerationDialogActions();
  const { isStreaming, hasError } = controller;

  const controllerRef = useRef(controller);

  useEffect(() => {
    controllerRef.current = controller;
  });

  useEffect(() => {
    registerController({
      isStreaming,
      hasError,
      stop: () => controllerRef.current.stop?.(),
      editRegenerate: (fields) => controllerRef.current.editRegenerate(fields),
    });

    return () => registerController(null);
  }, [isStreaming, hasError, registerController]);
}

export function GenerationDialogProvider({
  children,
}: {
  children: ReactNode;
}) {
  // The provider spans the whole private group, so a target has to remember which
  // route opened it — otherwise an open dialog would follow the user to the dashboard.
  // Tagging and deriving beats clearing it in an effect: a regenerate refreshes the
  // route without touching the pathname, which is exactly the case that must survive.
  const pathname = usePathname();

  const [storedTarget, setStoredTarget] = useState<
    (GenerationDialogTarget & { pathname: string }) | null
  >(null);
  // `isStreaming` drives the dialog's button, so it has to be state. The callbacks
  // only ever run from event handlers, so they stay in a ref — invoking them must
  // not re-render anything.
  const [controllerState, setControllerState] = useState({
    isStreaming: false,
    hasController: false,
    hasError: false,
  });
  const controllerRef = useRef<GenerationController | null>(null);

  const target = storedTarget?.pathname === pathname ? storedTarget : null;

  const actions = useMemo<GenerationDialogActions>(() => {
    return {
      openDialog: (next) => setStoredTarget({ ...next, pathname }),
      ensureDialogOpen: (next) => {
        setStoredTarget((previous) => {
          return previous?.pathname === pathname
            ? previous
            : { ...next, pathname };
        });
      },
      closeDialog: () => setStoredTarget(null),
      // Handle and flag are written together, so `isStreaming` being true always
      // implies there is something live to stop.
      registerController: (controller) => {
        controllerRef.current = controller;

        setControllerState({
          isStreaming: controller?.isStreaming ?? false,
          hasController: controller !== null,
          hasError: controller?.hasError ?? false,
        });
      },
      stop: () => controllerRef.current?.stop?.(),
      editRegenerate: (fields) => controllerRef.current?.editRegenerate(fields),
    };
  }, [pathname]);

  const state = useMemo<GenerationDialogState>(() => {
    return { target, ...controllerState };
  }, [target, controllerState]);

  return (
    <GenerationDialogActionsContext.Provider value={actions}>
      <GenerationDialogStateContext.Provider value={state}>
        {children}
      </GenerationDialogStateContext.Provider>
    </GenerationDialogActionsContext.Provider>
  );
}
