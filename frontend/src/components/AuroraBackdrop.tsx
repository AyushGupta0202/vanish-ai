import { cn } from "@/lib/utils"

export default function AuroraBackdrop({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#071018] via-[#060B0D] to-[#060B0D]" />
      <div
        className={cn(
          "absolute inset-0 opacity-60",
          "bg-[radial-gradient(circle_at_50%_45%,transparent_0_180px,rgba(255,255,255,0.12)_180px_181px,transparent_181px_270px,rgba(255,255,255,0.09)_270px_271px,transparent_271px_370px,rgba(255,255,255,0.07)_370px_371px,transparent_371px_520px,rgba(255,255,255,0.05)_520px_521px,transparent_521px)]",
        )}
      />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_35%,rgba(59,214,255,0.40)_0%,rgba(59,214,255,0.18)_28%,rgba(155,109,255,0.10)_48%,rgba(6,11,13,0.00)_72%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.00)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  )
}


