import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { aurora } from '@/styles/aurora'

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
      className="rounded-2xl border border-white/12 bg-white/6 backdrop-blur-xl p-8 text-center ring-1 ring-white/8 hover:bg-white/8 transition-colors cursor-pointer"
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
            <h3 className="text-2xl font-semibold text-white/92">
              Uploading image...
            </h3>
            <p className="text-white/56">
              Please wait while we process your image
            </p>
            <div className="w-full bg-white/10 rounded-full h-2.5 mt-4 overflow-hidden">
              <div className="bg-aurora-cyan h-2.5 rounded-full animate-pulse shadow-[0_0_18px_rgba(59,214,255,0.25)]" style={{ width: '60%' }}></div>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl">📸</div>
            <h3 className="text-2xl font-semibold text-white/92">
              Upload an image
            </h3>
            <p className="text-white/56">
              Drag and drop or click to select (Max 50MB)
            </p>
            <Button className={`${aurora.buttonPrimary} mt-4`} disabled={isUploading}>
              Select Image
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
