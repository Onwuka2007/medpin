import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "medpin-btn-default border shadow-[0_14px_30px_rgba(31,86,73,0.16)]",
        ghost:
          "medpin-btn-ghost",
      },
      size: {
        default: "h-11 rounded-full px-5 text-sm font-semibold",
        lg: "h-13 rounded-full px-7 text-[0.98rem] font-semibold",
        icon: "h-13 w-13 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? React.Fragment : "button";

  if (asChild) {
    const child = React.Children.only(props.children);
    return React.cloneElement(child, {
      className: cn(buttonVariants({ variant, size, className }), child.props.className),
    });
  }

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
