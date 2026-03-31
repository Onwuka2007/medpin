import { useState } from 'react'
import AssistantLauncher from '../components/assistant/AssistantLauncher.jsx'
import AssistantSheet from '../components/assistant/AssistantSheet.jsx'
import SiteFooter from '../components/layout/SiteFooter.jsx'
import ClosingCtaSection from '../components/sections/ClosingCtaSection.jsx'
import HeroSection from '../components/sections/HeroSection.jsx'
import PopularNeedsSection from '../components/sections/PopularNeedsSection.jsx'
import HeroVideoExtension from '../components/sections/HeroVideoExtension.jsx'

function HomePage() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantInitialAction, setAssistantInitialAction] = useState(null)

  function openAssistant(actionId = null) {
    setAssistantInitialAction(actionId)
    setAssistantOpen(true)
  }

  function closeAssistant() {
    setAssistantOpen(false)
    setAssistantInitialAction(null)
  }

  return (
    <>
      <main className="min-h-screen bg-[#f8fbf8] text-slate-900">
        <HeroSection onOpenAssistant={openAssistant} />
        <HeroVideoExtension />
        <PopularNeedsSection />
        <ClosingCtaSection />
      </main>
      <SiteFooter />
      <AssistantLauncher onOpen={() => openAssistant()} />
      <AssistantSheet
        open={assistantOpen}
        onClose={closeAssistant}
        initialActionId={assistantInitialAction}
      />
    </>
  )
}

export default HomePage
