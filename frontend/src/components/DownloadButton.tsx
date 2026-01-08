import { Button } from '@/components/ui/button'

interface DownloadButtonProps {
  onClick: () => void
}

export default function DownloadButton({ onClick }: DownloadButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="border-white/16 bg-white/7 text-white/90 hover:bg-white/10"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download Result
    </Button>
  )
}
