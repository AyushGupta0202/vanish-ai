import { useRef } from 'react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  onUpload: (file: File) => void
  isUploading?: boolean
}

export default function ImageUploader({ onUpload, isUploading = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-graphite rounded-xl p-12 text-center bg-graphite/50 hover:border-electric-blue transition-colors cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="space-y-4">
        {isUploading ? (
          <>
            <div className="text-6xl animate-pulse">⏳</div>
            <h3 className="text-2xl font-semibold text-white">
              Uploading image...
            </h3>
            <p className="text-muted-gray">
              Please wait while we process your image
            </p>
            <div className="w-full bg-graphite rounded-full h-2.5 mt-4">
              <div className="bg-electric-blue h-2.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl">📸</div>
            <h3 className="text-2xl font-semibold text-white">
              Upload an image
            </h3>
            <p className="text-muted-gray">
              Drag and drop or click to select (Max 50MB)
            </p>
            <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white mt-4" disabled={isUploading}>
              Select Image
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
