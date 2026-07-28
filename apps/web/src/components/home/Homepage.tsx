'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmberBackground } from '@/components/ui/EmberBackground'
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
      <EmberBackground />
      <SiteHeader onBuilderClick={openEntryModal} />
      <HeroSection onCreateClick={openEntryModal} />
      <HowItWorksSection />
      <FeaturesSection />
      <SiteFooter />

      <BuilderEntryModal
        isOpen={isEntryModalOpen}
        onClose={closeEntryModal}
        onComplete={handleComplete}
      />
    </div>
  )
}
