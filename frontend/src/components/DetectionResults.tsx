interface DetectionRegion {
  bbox: number[][]
  bbox_rect: number[]
  text: string
  confidence: number
}

interface DetectionResultsProps {
  regions: DetectionRegion[]
  onClear: () => void
}

export default function DetectionResults({ regions, onClear }: DetectionResultsProps) {
  if (regions.length === 0) return null

  return (
    <div className="rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl ring-1 ring-white/8 p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white/92">
          Detected {regions.length} text region{regions.length !== 1 ? 's' : ''}
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-aurora-cyan hover:text-aurora-cyan/80 underline"
        >
          Clear
        </button>
      </div>
      <div className="max-h-40 overflow-y-auto space-y-2">
        {regions.map((region, idx) => (
          <div key={idx} className="text-sm text-white/86 bg-white/6 border border-white/10 p-3 rounded-2xl">
            <span className="font-medium">"{region.text}"</span>
            <span className="text-white/52 ml-2">
              ({Math.round(region.confidence * 100)}% confidence)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

