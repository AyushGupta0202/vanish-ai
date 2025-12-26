import ImageUploader from './ImageUploader'
import { Button } from '@/components/ui/button'

interface LiveDemoProps {
  onUpload: (file: File) => void
  image: string | null
  processedImage: string | null
  onProcess: () => void
  isProcessing: boolean
  isUploading?: boolean
}

export default function LiveDemo({ onUpload, image, processedImage, onProcess, isProcessing, isUploading = false }: LiveDemoProps) {
  return (
    <section id="live-demo" className="py-20 px-4 bg-graphite">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Live Demo</h2>
        
        {!image ? (
          <div className="max-w-2xl mx-auto">
            <ImageUploader onUpload={onUpload} isUploading={isUploading} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="bg-void-black rounded-xl p-4 border border-electric-blue/20">
                <h3 className="text-white font-semibold mb-2">Original Image</h3>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Original"
                    className="w-full h-auto"
                  />
                  <div className="absolute top-2 left-2 bg-electric-blue/90 text-white px-2 py-1 rounded text-xs">
                    Selection
                  </div>
                </div>
              </div>

              {/* Result Preview */}
              <div className="bg-void-black rounded-xl p-4 border border-electric-blue/20">
                <h3 className="text-white font-semibold mb-2">Result (Preview)</h3>
                <div className="relative rounded-lg overflow-hidden bg-graphite min-h-[200px] flex items-center justify-center">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="Result"
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="text-muted-gray text-center">
                      <div className="text-4xl mb-2">✨</div>
                      <p>Process to see result</p>
                    </div>
                  )}
                  {processedImage && (
                    <div className="absolute top-2 left-2 bg-green-500/90 text-white px-2 py-1 rounded text-xs">
                      Vanished
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={onProcess}
                disabled={isProcessing}
                size="lg"
                className="bg-electric-blue hover:bg-electric-blue/90 text-white px-8 py-6 text-lg"
              >
                {isProcessing ? 'Processing...' : 'Make it Vanish'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

