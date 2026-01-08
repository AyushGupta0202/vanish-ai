import { cn } from "@/lib/utils"

export const aurora = {
  page: "relative min-h-screen overflow-hidden bg-ink-base font-helvetica text-white",
  container: "mx-auto w-full max-w-7xl px-4 md:px-6",
  text: {
    primary: "text-white/92",
    secondary: "text-white/72",
    muted: "text-white/56",
    faint: "text-white/52",
  },
  glass: cn(
    "rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl",
    "ring-1 ring-white/8",
    "shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
  ),
  glassSubtle: cn(
    "rounded-2xl border border-white/10 bg-white/6 backdrop-blur-xl",
    "ring-1 ring-white/6",
  ),
  pill: cn(
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium",
    "border border-white/12 bg-white/6 text-white/72 backdrop-blur-xl",
    "hover:bg-white/10 hover:text-white/90",
  ),
  pillActive: cn(
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium",
    "border border-white/16 bg-white/12 text-white/92 backdrop-blur-xl",
    "shadow-[0_0_32px_rgba(59,214,255,0.10)]",
  ),
  focusRing:
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-base",
  buttonPrimary: cn(
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold",
    "bg-white text-ink-base hover:bg-white/95",
    "shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
  ),
  buttonSecondary: cn(
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold",
    "border border-white/16 bg-white/7 text-white/90 backdrop-blur-xl",
    "hover:bg-white/10",
  ),
  link: "text-white/72 hover:text-white/92",
  linkAccent: "text-aurora-cyan hover:text-aurora-cyan/80",
} as const


