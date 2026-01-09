import { useState } from 'react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
}

export default function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/12 bg-white/6 backdrop-blur-xl ring-1 ring-white/8"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={() => setSliderPosition(50)}
    >
      {/* Before Image (Background) */}
      <img
        src={beforeImage}
        alt="Before"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* After Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt="After"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.25)] z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_24px_80px_rgba(0,0,0,0.45)] flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-aurora-cyan rounded"></div>
            <div className="w-1 h-4 bg-aurora-cyan rounded"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 rounded-full border border-white/12 bg-white/8 backdrop-blur-xl text-white/86 px-4 py-2 text-sm font-semibold">
        Before
      </div>
      <div className="absolute top-4 right-4 rounded-full border border-white/12 bg-white/8 backdrop-blur-xl text-white/86 px-4 py-2 text-sm font-semibold">
        After
      </div>
    </div>
  )
}

