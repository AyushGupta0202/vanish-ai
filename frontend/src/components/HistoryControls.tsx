import { useHistoryStore } from '@/store/historyStore'
import { Button } from '@/components/ui/button'

export default function HistoryControls() {
  const { undo, redo, canUndo, canRedo } = useHistoryStore()

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={undo}
        disabled={!canUndo()}
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        title="Undo (Ctrl+Z)"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Undo
      </Button>
      <Button
        onClick={redo}
        disabled={!canRedo()}
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        title="Redo (Ctrl+Shift+Z)"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
        </svg>
        Redo
      </Button>
    </div>
  )
}

