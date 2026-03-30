import { useState } from 'react'
import AssistantLauncher from '../components/assistant/AssistantLauncher.jsx'
import AssistantSheet from '../components/assistant/AssistantSheet.jsx'
import HeroSection from '../components/sections/HeroSection.jsx'

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
      </main>
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
