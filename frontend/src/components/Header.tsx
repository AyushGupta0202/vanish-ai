import VanishLogo from './VanishLogo'
import { Button } from '@/components/ui/button'

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
    <header className="border-b border-graphite bg-void-black sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <VanishLogo variant="light" size="md" />
        <nav className="flex items-center gap-4">
          {showEditorActions ? (
            <>
              <Button 
                variant="outline" 
                className="border-graphite text-white hover:bg-graphite"
                onClick={onExport}
              >
                Export
              </Button>
              <Button variant="ghost" className="text-white hover:text-electric-blue">
                Account
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-white hover:text-electric-blue hover:bg-graphite/50 hidden md:inline-flex">
                Features
              </Button>
              <Button variant="ghost" className="text-white hover:text-electric-blue hover:bg-graphite/50 hidden md:inline-flex">
                Pricing
              </Button>
              <Button variant="outline" className="border-graphite bg-transparent text-white hover:bg-graphite hover:text-white">
                Login
              </Button>
              <Button 
                onClick={scrollToDemo}
                className="bg-electric-blue hover:bg-electric-blue/90 active:bg-electric-blue/80 text-white transition-all active:scale-95"
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

