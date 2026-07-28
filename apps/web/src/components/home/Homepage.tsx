'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmberBackground } from '@/components/ui/EmberBackground'
import { StructuredData } from '@/components/seo/StructuredData'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { HeroSection } from './HeroSection'
import { HowItWorksSection } from './HowItWorksSection'
import { FeaturesSection } from './FeaturesSection'
import { BuilderEntryModal } from '@/features/builder/workbench/BuilderEntryModal'

export function Homepage() {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)
  const router = useRouter()

  const openEntryModal = () => setIsEntryModalOpen(true)
  const closeEntryModal = () => setIsEntryModalOpen(false)

  const handleComplete = () => {
    setIsEntryModalOpen(false)
    router.push('/builder')
  }

  return (
    <div className="home">
      <StructuredData />
      <EmberBackground />
      <SiteHeader onBuilderClick={openEntryModal} />
      <main>
        <HeroSection onCreateClick={openEntryModal} />
        <HowItWorksSection />
        <FeaturesSection />
      </main>
      <SiteFooter />

      <BuilderEntryModal
        isOpen={isEntryModalOpen}
        onClose={closeEntryModal}
        onComplete={handleComplete}
      />
    </div>
  )
}
