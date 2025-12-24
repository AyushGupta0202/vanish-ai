interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export default function CanvasEditor({ canvasRef }: CanvasEditorProps) {
  return (
    <div className="border-2 border-graphite rounded-xl overflow-auto max-w-full max-h-[80vh] relative bg-void-black flex justify-center items-center">
      <canvas ref={canvasRef} className="max-w-none max-h-none block" />
      <div className="bg-graphite p-3 text-sm text-muted-gray sticky bottom-0 w-full text-center">
        💡 Tip: Draw on areas you want to remove. Pinch to zoom on all devices.
      </div>
    </div>
  )
}

