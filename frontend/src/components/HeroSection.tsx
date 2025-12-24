import { Button } from '@/components/ui/button'
import BeforeAfterSlider from './BeforeAfterSlider'

export default function HeroSection({ onTryClick }: { onTryClick: () => void }) {
  // Real before/after example images
  const beforeImage = "/images/before-example.svg"
  const afterImage = "/images/after-example.svg"

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Copy */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Make anything vanish.
              <br />
              <span className="text-electric-blue">Instantly.</span>
            </h1>
            <p className="text-xl text-muted-gray leading-relaxed">
              AI-powered object removal with zero residue, zero effort, zero compromise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onTryClick}
                size="lg"
                className="bg-electric-blue hover:bg-electric-blue/90 text-white px-8 py-6 text-lg"
              >
                Try Vanish AI
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-graphite bg-transparent text-white hover:bg-graphite hover:text-white px-8 py-6 text-lg"
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

