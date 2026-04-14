import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────
   Shadcn-style Badge
   Variants map to medpin status colours
───────────────────────────────────────── */

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:    "bg-slate-100 text-slate-700",
        success:    "bg-emerald-50 text-emerald-700",
        warning:    "bg-amber-50 text-amber-700",
        danger:     "bg-rose-50 text-rose-700",
        primary:    "bg-emerald-500 text-white",
        outline:    "border border-slate-200 text-slate-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
