import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DetectionSettingsProps {
  confidenceThreshold: number
  expandPixels: number
  onConfidenceChange: (value: number) => void
  onExpandChange: (value: number) => void
}

export default function DetectionSettings({
  confidenceThreshold,
  expandPixels,
  onConfidenceChange,
  onExpandChange
}: DetectionSettingsProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg">Detection Settings</CardTitle>
        <CardDescription>Configure text detection parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/86">
              Confidence Threshold: {Math.round(confidenceThreshold * 100)}%
            </label>
          </div>
          <Slider
            value={[confidenceThreshold]}
            onValueChange={(value) => onConfidenceChange(value[0])}
            min={0.1}
            max={1.0}
            step={0.05}
            className="w-full"
          />
          <p className="text-xs text-white/56">
            Higher values = more confident detections only
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/86">
              Mask Expansion: {expandPixels}px
            </label>
          </div>
          <Slider
            value={[expandPixels]}
            onValueChange={(value) => onExpandChange(value[0])}
            min={0}
            max={20}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-white/56">
            Pixels to expand mask around detected text
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

