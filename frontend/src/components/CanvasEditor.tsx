interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export default function CanvasEditor({ canvasRef }: CanvasEditorProps) {
  return (
    <div className="space-y-2 w-full">
      <div className="border-2 border-graphite rounded-xl overflow-auto max-w-full max-h-[80vh] relative bg-void-black flex justify-center items-center w-full min-w-0">
        <canvas ref={canvasRef} className="max-w-full max-h-full block" />
      </div>
      <div className="bg-graphite p-3 text-sm text-white/80 rounded-lg text-center w-full">
        💡 Tip: Draw on areas you want to remove. Pinch to zoom on all devices.
      </div>
    </div>
  )
}

