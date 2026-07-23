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
  return function FormWithEditActions(props: P & { onStop?: () => void }) {
    return (
      <Form {...props}>
        {({ isSubmitting }) =>
          props.disabled ? (
            <Button
              type="button"
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
          )
        }
      </Form>
    );
  };
}
