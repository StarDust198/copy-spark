"use client";

import { ComponentType, ReactNode } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type FormActionProps = {
  disabled?: boolean;
  children?: (state: { isSubmitting: boolean }) => ReactNode;
};

export function withCreateActions<P extends FormActionProps>(
  Form: ComponentType<P>,
) {
  return function FormWithCreateActions(props: P) {
    return (
      <Form {...props}>
        {({ isSubmitting }) => (
          <Button type="submit" disabled={isSubmitting}>
            Generate
          </Button>
        )}
      </Form>
    );
  };
}

export function withEditActions<P extends FormActionProps>(
  Form: ComponentType<P>,
) {
  return function FormWithEditActions(
    props: P & { onStop?: () => void; error?: ReactNode },
  ) {
    return (
      <Form {...props}>
        {({ isSubmitting }) => (
          <>
            {props.error}

            {props.disabled ? (
              // No `onStop` means there is nothing live to abort — during a route
              // transition, say — so the button reads as unavailable instead of
              // silently doing nothing.
              <Button
                type="button"
                disabled={!props.onStop}
                onClick={(event) => {
                  event.preventDefault();
                  props.onStop?.();
                }}
              >
                <Spinner />
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                Generate
              </Button>
            )}
          </>
        )}
      </Form>
    );
  };
}
