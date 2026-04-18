import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input.jsx"


export default function PharmacyLoginPage() {
  const [email,       setEmail]       = useState("")
  const [password,    setPassword]    = useState("")
  const [showPass,    setShowPass]    = useState(false)
  const [loading,     setLoading]     = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    /* Simulate network delay then redirect to dashboard */
    setTimeout(() => window.location.href = "/pharmacy/dashboard", 1200)
  }

  return (
    <div className="flex min-h-screen">

      {}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between bg-[#1f5649] p-12 text-white">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400">
            <span className="text-sm font-black text-white">M</span>
          </div>
          <span className="text-lg font-bold tracking-tight">MedPin</span>
        </Link>

        {/* Body copy */}
        <div>
          <p className="text-4xl font-bold leading-snug tracking-tight">
            Your pharmacy,<br />visible to thousands<br />of patients daily.
          </p>
          <p className="mt-4 text-sm leading-7 text-emerald-200">
            Manage your stock, get real-time demand insights, and stay ahead
            of what your community needs - all from one dashboard.
          </p>

          {/* Trust markers */}
          <div className="mt-8 flex flex-col gap-3">
            {[
              "PCN-verified pharmacy listing",
              "Real-time drug search visibility",
              "Inventory & demand analytics",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-emerald-100">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-emerald-400">
          © {new Date().getFullYear()} MedPin. All rights reserved.
        </p>
      </div>

      {}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f4f9f6] px-6 py-12">

        {/* Mobile logo */}
        <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500">
            <span className="text-xs font-black text-white">M</span>
          </div>
          <span className="font-bold text-slate-800">MedPin</span>
        </Link>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to your pharmacy dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Email address
              </label>
              <Input
                type="email"
                placeholder="pharmacy@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">Password</label>
                <button type="button" className="text-xs text-emerald-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Not a partner yet?{" "}
            <Link to="/pharmacy/register" className="font-semibold text-emerald-600 hover:underline">
              Register your pharmacy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
