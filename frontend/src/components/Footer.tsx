import VanishLogo from './VanishLogo'

export default function Footer() {
  return (
    <footer className="border-t border-graphite bg-void-black py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <VanishLogo variant="light" size="sm" />
            <p className="text-muted-gray text-sm mt-4">
              AI-powered object removal with zero residue.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-muted-gray text-sm">
              <li><a href="#" className="hover:text-electric-blue">Features</a></li>
              <li><a href="#" className="hover:text-electric-blue">Pricing</a></li>
              <li><a href="#" className="hover:text-electric-blue">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-gray text-sm">
              <li><a href="#" className="hover:text-electric-blue">About</a></li>
              <li><a href="#" className="hover:text-electric-blue">Blog</a></li>
              <li><a href="#" className="hover:text-electric-blue">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-gray text-sm">
              <li><a href="#" className="hover:text-electric-blue">Privacy</a></li>
              <li><a href="#" className="hover:text-electric-blue">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-graphite mt-8 pt-8 text-center text-muted-gray text-sm">
          © {new Date().getFullYear()} Vanish AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

