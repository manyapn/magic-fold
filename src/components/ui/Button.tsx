"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-6 py-3 rounded-full font-medium text-sm bg-[var(--color-button-bg)] text-[var(--color-button-text)] hover:brightness-95 active:scale-[0.98] transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-mauve)] ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
