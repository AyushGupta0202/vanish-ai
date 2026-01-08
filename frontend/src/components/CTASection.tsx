import { Button } from '@/components/ui/button'
import { aurora } from '@/styles/aurora'

interface CTASectionProps {
  onStartClick: () => void
}

export default function CTASection({ onStartClick }: CTASectionProps) {
  return (
    <section className="py-12 px-4 md:px-6">
      <div className="mx-auto max-w-4xl text-center rounded-2xl border border-white/10 bg-white/6 backdrop-blur-xl p-8 ring-1 ring-white/6">
        <h2 className="text-4xl font-semibold tracking-[-0.015em] mb-4 text-white/92">
          Ready to remove the unnecessary?
        </h2>
        <Button
          onClick={onStartClick}
          size="lg"
          className={`${aurora.buttonPrimary} mt-8`}
        >
          Start Vanish AI
        </Button>
      </div>
    </section>
  )
}

