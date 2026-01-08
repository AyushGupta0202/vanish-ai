import VanishLogo from './VanishLogo'
import { Button } from '@/components/ui/button'
import { aurora } from '@/styles/aurora'

interface HeaderProps {
  showEditorActions?: boolean
  onExport?: () => void
}

export default function Header({ showEditorActions = false, onExport }: HeaderProps) {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('live-demo')
    demoSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-base/60 backdrop-blur-xl">
      <div className="w-full max-w-7xl mx-auto px-4 py-3 md:px-6 flex items-center justify-between">
        <VanishLogo variant="light" size="md" />
        <nav className="flex items-center gap-4">
          {showEditorActions ? (
            <>
              <Button 
                variant="outline" 
                className={aurora.buttonSecondary}
                onClick={onExport}
              >
                Export
              </Button>
              <Button variant="ghost" className="rounded-full px-5 py-2.5 text-sm font-medium">
                Account
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="hidden md:inline-flex rounded-full px-5 py-2.5 text-sm font-medium">
                Features
              </Button>
              <Button variant="ghost" className="hidden md:inline-flex rounded-full px-5 py-2.5 text-sm font-medium">
                Pricing
              </Button>
              <Button variant="outline" className={aurora.buttonSecondary}>
                Login
              </Button>
              <Button 
                onClick={scrollToDemo}
                className={aurora.buttonPrimary}
              >
                Try Vanish AI
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

