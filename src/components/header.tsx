import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="font-bold text-xl">
              Weblog
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">
                Contact
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 