'use client'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { HeroSection } from './HeroSection'
import { HowItWorksSection } from './HowItWorksSection'
import { FeaturesSection } from './FeaturesSection'

export function Homepage() {
  return (
    <div className="home">
      <SiteHeader />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SiteFooter />
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 40 }}>
        <ThemeToggle />
      </div>
    </div>
  )
}
