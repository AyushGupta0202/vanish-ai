import VanishLogo from './VanishLogo'
import { aurora } from '@/styles/aurora'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-base/40 backdrop-blur-xl py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <VanishLogo variant="light" size="sm" />
            <p className="text-white/56 text-sm mt-4">
              AI-powered object removal with zero residue.
            </p>
          </div>
          <div>
            <h4 className="text-white/92 font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-white/56 text-sm">
              <li><a href="#" className={aurora.link}>Features</a></li>
              <li><a href="#" className={aurora.link}>Pricing</a></li>
              <li><a href="#" className={aurora.link}>API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/92 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white/56 text-sm">
              <li><a href="#" className={aurora.link}>About</a></li>
              <li><a href="#" className={aurora.link}>Blog</a></li>
              <li><a href="#" className={aurora.link}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/92 font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-white/56 text-sm">
              <li><a href="#" className={aurora.link}>Privacy</a></li>
              <li><a href="#" className={aurora.link}>Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/52 text-sm">
          © {new Date().getFullYear()} Vanish AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

