import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Stat = {
  label: string
  value: string
  delta: string
  trend: "up" | "down"
}

type ContentRow = {
  title: string
  platform: "YouTube" | "TikTok" | "Instagram"
  views: string
  engagement: string
  revenue: string
}

const stats: Stat[] = [
  { label: "Followers", value: "218,430", delta: "+3.2% this week", trend: "up" },
  { label: "Views", value: "4.82M", delta: "+11.4% this week", trend: "up" },
  { label: "Engagement", value: "6.8%", delta: "-0.4% this week", trend: "down" },
  { label: "Revenue", value: "$18,920", delta: "+5.1% this week", trend: "up" },
]

const topContent: ContentRow[] = [
  { title: "30s Hook Formula (that actually converts)", platform: "YouTube", views: "812K", engagement: "7.9%", revenue: "$3,420" },
  { title: "Editing stack: 5 settings that change everything", platform: "TikTok", views: "1.34M", engagement: "9.1%", revenue: "$2,180" },
  { title: "Brand deals: pricing without sounding insecure", platform: "Instagram", views: "522K", engagement: "6.4%", revenue: "$1,120" },
  { title: "The analytics mistake creators keep repeating", platform: "YouTube", views: "403K", engagement: "5.8%", revenue: "$890" },
]

const viewsSeries = [12, 18, 14, 22, 26, 20, 28, 34, 30, 38, 44, 40]

function GlassCard({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl",
        "shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
        "ring-1 ring-white/8",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Pill({
  active,
  children,
  className,
}: {
  active?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium",
        active
          ? "bg-white/12 text-white ring-1 ring-white/16"
          : "text-white/72 hover:text-white/90",
        className,
      )}
    >
      {children}
    </span>
  )
}

export default function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-base font-helvetica text-white">
      {/* Background system: atmosphere + orbital rings + horizon glow + vignette */}
      <div className="pointer-events-none absolute inset-0">
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

      {/* Top bar */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/7 ring-1 ring-white/12 backdrop-blur-xl">
              <div className="h-2.5 w-2.5 rounded-full bg-aurora-cyan shadow-[0_0_28px_rgba(59,214,255,0.35)]" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[-0.01em] text-white/92">
                CreatorIQ
              </div>
              <div className="text-xs text-white/52">Analytics Platform</div>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Pill active>Dashboard</Pill>
            <Pill>Content</Pill>
            <Pill>Audience</Pill>
            <Pill>Revenue</Pill>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <div className="flex h-11 items-center rounded-full border border-white/14 bg-white/6 px-4 backdrop-blur-xl">
                <span className="mr-2 text-white/52">⌕</span>
                <input
                  className="w-64 bg-transparent text-sm text-white/90 placeholder:text-white/45 focus:outline-none"
                  placeholder="Search content, deals, campaigns…"
                />
              </div>
            </div>
            <a
              href="#/"
              className="hidden rounded-full border border-white/16 bg-white/7 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl hover:bg-white/10 md:inline-flex"
            >
              Back
            </a>
            <button
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold",
                "bg-white text-ink-base",
                "shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
                "hover:bg-white/95",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-base",
              )}
            >
              Connect account
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 pb-16 md:grid-cols-[280px_1fr] md:px-8">
        {/* Sidebar */}
        <aside className="md:sticky md:top-6 md:self-start">
          <GlassCard className="p-4">
            <div className="mb-3 text-xs font-semibold tracking-[0.10em] text-white/52">
              NAVIGATION
            </div>
            <div className="space-y-2">
              {[
                { label: "Overview", active: true },
                { label: "Earnings", active: false },
                { label: "Brand Deals", active: false },
                { label: "Audience Insights", active: false },
                { label: "Settings", active: false },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#/dashboard"
                  className={cn(
                    "flex items-center justify-between rounded-full px-4 py-2 text-sm",
                    item.active
                      ? "bg-white/12 text-white ring-1 ring-white/16 shadow-[0_0_32px_rgba(59,214,255,0.12)]"
                      : "text-white/72 hover:bg-white/8 hover:text-white/90",
                  )}
                >
                  <span>{item.label}</span>
                  {item.active ? (
                    <span className="h-2 w-2 rounded-full bg-aurora-cyan shadow-[0_0_20px_rgba(59,214,255,0.35)]" />
                  ) : null}
                </a>
              ))}
            </div>

            <div className="my-4 h-px bg-white/8" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold tracking-[0.10em] text-white/52">
                  ACCOUNT
                </div>
                <span className="rounded-full border border-white/12 bg-white/6 px-2 py-0.5 text-[11px] text-white/70">
                  Pro
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                <div className="text-sm font-semibold text-white/92">
                  Liam Bennett
                </div>
                <div className="text-xs text-white/52">liam@creatoriq.io</div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-aurora-green shadow-[0_0_18px_rgba(63,226,100,0.25)]" />
                  <span className="text-xs text-white/70">Connected</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </aside>

        {/* Main content */}
        <main className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-semibold tracking-[0.10em] text-white/52">
                CREATOR DASHBOARD
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.015em] text-white/92 md:text-4xl">
                Achieve your goals, effortlessly.
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/62">
                One surface for growth, revenue, and content performance. Clean numbers. No noise.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex h-11 items-center rounded-full border border-white/14 bg-white/6 px-4 text-sm text-white/72 backdrop-blur-xl">
                Weekly
              </span>
              <span className="inline-flex h-11 items-center rounded-full border border-white/10 bg-transparent px-4 text-sm text-white/52 hover:bg-white/6">
                Monthly
              </span>
              <span className="inline-flex h-11 items-center rounded-full border border-white/10 bg-transparent px-4 text-sm text-white/52 hover:bg-white/6">
                Yearly
              </span>
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <GlassCard key={s.label} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold tracking-[0.10em] text-white/52">
                      {s.label.toUpperCase()}
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-white/92">
                      {s.value}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      s.trend === "up"
                        ? "border-aurora-green/30 bg-aurora-green/12 text-white/86"
                        : "border-aurora-violet/30 bg-aurora-violet/12 text-white/86",
                    )}
                  >
                    {s.trend === "up" ? "↗" : "↘"}
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/56">{s.delta}</div>
              </GlassCard>
            ))}
          </div>

          {/* Charts + feed */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white/92">Views</div>
                  <div className="text-xs text-white/56">Last 12 weeks</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs text-white/70">
                    <span className="h-2 w-2 rounded-full bg-aurora-violet" />
                    Total
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs text-white/70">
                    <span className="h-2 w-2 rounded-full bg-aurora-cyan" />
                    New
                  </span>
                </div>
              </div>

              <div className="mt-6 flex h-56 items-end gap-2">
                {viewsSeries.map((v, idx) => (
                  <div key={idx} className="flex-1">
                    <div
                      className={cn(
                        "w-full rounded-xl",
                        "bg-gradient-to-t from-aurora-violet/55 via-aurora-violet/22 to-white/0",
                        "ring-1 ring-white/8",
                        idx === viewsSeries.length - 2
                          ? "shadow-[0_0_32px_rgba(155,109,255,0.16)]"
                          : "",
                      )}
                      style={{ height: `${(v / 48) * 100}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-white/52">
                <span>Week 1</span>
                <span>Week 12</span>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white/92">New transactions</div>
                  <div className="text-xs text-white/56">Today</div>
                </div>
                <Pill className="border border-white/12 bg-white/6 text-white/70">Live</Pill>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { title: "Transfer sent for processing", meta: "Due in 08:00", state: "info" as const },
                  { title: "Brand deal approved", meta: "Paid in 2 days", state: "success" as const },
                  { title: "Fee applied", meta: "Settlement updated", state: "danger" as const },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/6 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-white/86">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs text-white/52">{item.meta}</div>
                      </div>
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          item.state === "success"
                            ? "bg-aurora-green shadow-[0_0_18px_rgba(63,226,100,0.22)]"
                            : item.state === "danger"
                              ? "bg-[#FF4D4D] shadow-[0_0_18px_rgba(255,77,77,0.18)]"
                              : "bg-aurora-cyan shadow-[0_0_18px_rgba(59,214,255,0.22)]",
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Table */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white/92">Top content</div>
                <div className="text-xs text-white/56">Best performing posts across platforms</div>
              </div>
              <button className="rounded-full border border-white/16 bg-white/7 px-4 py-2 text-sm font-medium text-white/86 hover:bg-white/10">
                Export
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.6fr_0.7fr_0.6fr_0.6fr_0.6fr] gap-3 bg-white/5 px-5 py-3 text-xs font-semibold tracking-[0.10em] text-white/52">
                <div>TITLE</div>
                <div>PLATFORM</div>
                <div className="text-right">VIEWS</div>
                <div className="text-right">ENG.</div>
                <div className="text-right">REV.</div>
              </div>
              <div className="divide-y divide-white/8">
                {topContent.map((row) => (
                  <div
                    key={row.title}
                    className="grid grid-cols-[1.6fr_0.7fr_0.6fr_0.6fr_0.6fr] gap-3 px-5 py-4 text-sm text-white/72 hover:bg-white/6"
                  >
                    <div className="text-white/86">{row.title}</div>
                    <div>
                      <span className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/70">
                        {row.platform}
                      </span>
                    </div>
                    <div className="text-right font-medium text-white/86">{row.views}</div>
                    <div className="text-right">{row.engagement}</div>
                    <div className="text-right font-medium text-white/86">{row.revenue}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  )
}


