import SiteHeader from '../components/layout/SiteHeader.jsx'
import HeroSection from '../components/sections/HeroSection.jsx'

function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#f8fbff_52%,#ffffff_100%)] text-slate-900">
      <div className="absolute inset-x-0 top-0 -z-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_30%)]" />
      <SiteHeader />
      <HeroSection />
    </main>
  )
}

export default HomePage
