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
    <div className="bg-graphite border border-electric-blue/30 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">
          Detected {regions.length} text region{regions.length !== 1 ? 's' : ''}
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-electric-blue hover:text-electric-blue/80 underline"
        >
          Clear
        </button>
      </div>
      <div className="max-h-40 overflow-y-auto space-y-2">
        {regions.map((region, idx) => (
          <div key={idx} className="text-sm text-white bg-void-black p-2 rounded-lg">
            <span className="font-medium">"{region.text}"</span>
            <span className="text-muted-gray ml-2">
              ({Math.round(region.confidence * 100)}% confidence)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

