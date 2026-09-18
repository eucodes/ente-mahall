"use client";

import * as React from "react";
import { Input, type InputProps } from "./input";
import { Eye, EyeOff, Lock } from "./icons";

export type PasswordInputProps = Omit<InputProps, "type" | "trailingIcon" | "leadingIcon">;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      leadingIcon={<Lock />}
      trailingIcon={
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="pointer-events-auto flex h-4 w-4 items-center justify-center rounded text-muted-foreground hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";
