import ImageUploader from './ImageUploader'
import { Button } from '@/components/ui/button'
import { aurora } from '@/styles/aurora'

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
    <section id="live-demo" className="py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-semibold tracking-[-0.015em] text-center mb-12 text-white/92">
          Live demo
        </h2>
        
        {!image ? (
          <div className="max-w-2xl mx-auto">
            <ImageUploader onUpload={onUpload} isUploading={isUploading} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl p-6 ring-1 ring-white/8">
                <h3 className="text-white/92 font-semibold mb-4">Original Image</h3>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Original"
                    className="w-full h-auto"
                  />
                  <div className="absolute top-2 left-2 rounded-full border border-white/12 bg-white/8 backdrop-blur-xl text-white/86 px-4 py-2 text-xs">
                    Selection
                  </div>
                </div>
              </div>

              {/* Result Preview */}
              <div className="rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl p-6 ring-1 ring-white/8">
                <h3 className="text-white/92 font-semibold mb-4">Result (Preview)</h3>
                <div className="relative rounded-lg overflow-hidden bg-white/5 min-h-[200px] flex items-center justify-center">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="Result"
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="text-white/56 text-center">
                      <div className="text-4xl mb-2">✨</div>
                      <p>Process to see result</p>
                    </div>
                  )}
                  {processedImage && (
                    <div className="absolute top-2 left-2 rounded-full border border-white/12 bg-aurora-green/12 text-white/86 px-4 py-2 text-xs">
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
                className={aurora.buttonPrimary}
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

