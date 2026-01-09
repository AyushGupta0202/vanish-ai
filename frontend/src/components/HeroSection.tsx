import { Button } from '@/components/ui/button'
import BeforeAfterSlider from './BeforeAfterSlider'
import { aurora } from '@/styles/aurora'

export default function HeroSection({ onTryClick }: { onTryClick: () => void }) {
  // Real before/after example images
  const beforeImage = "/images/before-example.svg"
  const afterImage = "/images/after-example.svg"

  return (
    <section className="py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Copy */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-[-0.03em] text-white/92">
              MAKE ANYTHING VANISH.
              <br />
              <span className="text-aurora-cyan">INSTANTLY.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/62 leading-relaxed">
              AI-powered object removal with zero residue, zero effort, zero compromise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onTryClick}
                size="lg"
                className={aurora.buttonPrimary}
              >
                Try Vanish AI
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={aurora.buttonSecondary}
              >
                See it in action
              </Button>
            </div>
          </div>

          {/* Right Side - Before/After Slider */}
          <div className="relative">
            <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
          </div>
        </div>
      </div>
    </section>
  )
}

