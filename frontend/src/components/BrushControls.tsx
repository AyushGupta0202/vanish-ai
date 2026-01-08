import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BrushControlsProps {
  brushSize: number
  onBrushSizeChange: (size: number) => void
}

export default function BrushControls({ brushSize, onBrushSizeChange }: BrushControlsProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Brush Size</CardTitle>
        <CardDescription>Adjust the size of the eraser brush</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/86">Size: {brushSize}px</span>
          </div>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => onBrushSizeChange(value[0])}
            min={5}
            max={100}
            step={5}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
