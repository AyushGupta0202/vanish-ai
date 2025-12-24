import { cn } from '@/lib/utils'

interface VanishLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'
}

export default function VanishLogo({ className, size = 'md', variant = 'dark' }: VanishLogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  const textColor = variant === 'dark' ? 'text-void-black' : 'text-white'

  return (
    <div className={cn('font-bold tracking-tight flex items-center', sizes[size], textColor, className)}>
      <span className="font-semibold">VANI</span>
      <span className="relative inline-block mx-0.5 h-full">
        {/* The "I" with disappearing effect */}
        <span className="relative z-10 block">I</span>
        {/* Fade effect overlay - bottom half fades */}
        <span 
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-60"
          style={{ 
            background: variant === 'dark' 
              ? 'linear-gradient(to top, rgba(11, 11, 13, 0.9), transparent)' 
              : 'linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent)'
          }}
        />
      </span>
      <span className="font-semibold">SH</span>
      <span className="ml-2 text-electric-blue font-semibold">AI</span>
    </div>
  )
}

// Logo with disappearing "I" effect
export function VanishLogoWithEffect({ className, size = 'md', variant = 'dark' }: VanishLogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  const textColor = variant === 'dark' ? 'text-void-black' : 'text-white'

  return (
    <div className={cn('font-bold tracking-tight flex items-center', sizes[size], textColor, className)}>
      <span className="font-semibold">VANI</span>
      <span className="relative inline-block mx-0.5 h-full">
        {/* The "I" with disappearing effect */}
        <span className="relative z-10 block">
          <span className="block">I</span>
        </span>
        {/* Fade effect overlay */}
        <span 
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-current to-transparent opacity-60"
          style={{ 
            background: variant === 'dark' 
              ? 'linear-gradient(to top, rgba(11, 11, 13, 0.8), transparent)' 
              : 'linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent)'
          }}
        />
      </span>
      <span className="font-semibold">SH</span>
      <span className="ml-2 text-electric-blue font-semibold">AI</span>
    </div>
  )
}

