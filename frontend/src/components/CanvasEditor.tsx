interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export default function CanvasEditor({ canvasRef }: CanvasEditorProps) {
  return (
    <div className="space-y-2 w-full">
      <div className="rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl ring-1 ring-white/8 overflow-auto max-w-full max-h-[80vh] relative flex justify-center items-center w-full min-w-0">
        <canvas ref={canvasRef} className="max-w-full max-h-full block" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur-xl p-4 text-sm text-white/72 text-center w-full">
        💡 Tip: Draw on areas you want to remove. Pinch to zoom on all devices.
      </div>
    </div>
  )
}

