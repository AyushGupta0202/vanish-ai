import { Button } from '@/components/ui/button'

interface CTASectionProps {
  onStartClick: () => void
}

export default function CTASection({ onStartClick }: CTASectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">
          Ready to remove the unnecessary?
        </h2>
        <Button
          onClick={onStartClick}
          size="lg"
          className="bg-electric-blue hover:bg-electric-blue/90 text-white px-12 py-6 text-xl mt-8"
        >
          Start Vanish AI
        </Button>
      </div>
    </section>
  )
}

