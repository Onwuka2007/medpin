import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, ShieldCheck, Upload } from "lucide-react"
import { Input } from "@/components/ui/input.jsx"

/* ────────────────────────────────────────────────────────────
   PharmacyRegisterPage  -  partner pharmacy sign-up.
   Multi-step form. UI shell only - no real submission.

   Steps:
   1. Account setup       (email, password)
   2. Pharmacy details    (name, phone, address, state)
   3. Verification        (PCN, CAC, superintendent, NAFDAC)
   4. Review & submit
──────────────────────────────────────────────────────────── */

const STEPS = [
  { id: 1, label: "Account"      },
  { id: 2, label: "Details"      },
  { id: 3, label: "Verification" },
  { id: 4, label: "Review"       },
]

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
]

export default function PharmacyRegisterPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [showPass, setShowPass] = useState(false)

  /* Form state */
  const [form, setForm] = useState({
    /* Step 1 */
    email:           "",
    password:        "",
    confirmPassword: "",
    /* Step 2 */
    pharmacyName:    "",
    phone:           "",
    address:         "",
    city:            "",
    state:           "",
    /* Step 3 */
    pcnLicenseNo:       "",   // Pharmacists Council of Nigeria registration
    cacRegNo:           "",   // Corporate Affairs Commission
    superintendentName: "",   // Superintendent pharmacist full name
    superintendentPcn:  "",   // Superintendent pharmacist PCN license
    nafdacNo:           "",   // Optional
    agreedToTerms:      false,
  })

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const next = () => setStep((s) => Math.min(s + 1, 4))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = () => {
    /* Shell only - just show success state */
    setSubmitted(true)
  }

  if (submitted) return <SuccessScreen pharmacyName={form.pharmacyName} />

  return (
    <div className="flex min-h-screen">

      {/* ── Left: brand panel ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[38%] flex-col justify-between bg-[#1f5649] p-12 text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400">
            <span className="text-sm font-black text-white">M</span>
          </div>
          <span className="text-lg font-bold tracking-tight">MedPin</span>
        </Link>

        <div>
          <p className="text-4xl font-bold leading-snug tracking-tight">
            Join Nigeria's growing<br />pharmacy network.
          </p>
          <p className="mt-4 text-sm leading-7 text-emerald-200">
            Registration takes under 5 minutes. Once verified, your pharmacy
            goes live on MedPin and becomes discoverable to patients searching
            for drugs in your area.
          </p>

          {/* Step indicators mirrored on the left panel */}
          <div className="mt-10 space-y-4">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step > s.id
                    ? "bg-emerald-400 text-white"
                    : step === s.id
                      ? "bg-white text-[#1f5649]"
                      : "bg-white/10 text-white/40"
                }`}>
                  {step > s.id ? <Check size={13} /> : s.id}
                </div>
                <span className={`text-sm ${step >= s.id ? "text-white" : "text-white/40"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-emerald-400">
          © {new Date().getFullYear()} MedPin. All rights reserved.
        </p>
      </div>

      {/* ── Right: form panel ────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f4f9f6] px-6 py-12">

        {/* Mobile logo */}
        <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500">
            <span className="text-xs font-black text-white">M</span>
          </div>
          <span className="font-bold text-slate-800">MedPin</span>
        </Link>

        {/* Mobile step dots */}
        <div className="mb-6 flex items-center gap-2 lg:hidden">
          {STEPS.map((s) => (
            <div key={s.id} className={`h-2 rounded-full transition-all ${
              step === s.id ? "w-6 bg-emerald-500" : step > s.id ? "w-2 bg-emerald-300" : "w-2 bg-slate-200"
            }`} />
          ))}
        </div>

        <div className="w-full max-w-md">

          {/* ── Step 1: Account ───────────────────────────── */}
          {step === 1 && (
            <StepShell
              title="Create your account"
              description="You'll use this email to sign in to your dashboard."
              onNext={next}
              nextDisabled={!form.email || !form.password || form.password !== form.confirmPassword}
            >
              <Field label="Email address">
                <Input type="email" placeholder="pharmacy@example.com"
                  value={form.email} onChange={(e) => update("email", e.target.value)} required />
              </Field>

              <Field label="Password">
                <div className="relative">
                  <Input type={showPass ? "text" : "password"} placeholder="Min. 8 characters"
                    value={form.password} onChange={(e) => update("password", e.target.value)}
                    className="pr-10" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>

              <Field label="Confirm password">
                <Input type="password" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-500">Passwords do not match.</p>
                )}
              </Field>
            </StepShell>
          )}

          {/* ── Step 2: Pharmacy details ──────────────────── */}
          {step === 2 && (
            <StepShell
              title="Pharmacy details"
              description="Tell us about your pharmacy so patients can find you."
              onNext={next}
              onBack={back}
              nextDisabled={!form.pharmacyName || !form.phone || !form.address || !form.state}
            >
              <Field label="Pharmacy name">
                <Input placeholder="e.g. Alpha Pharmacy"
                  value={form.pharmacyName} onChange={(e) => update("pharmacyName", e.target.value)} required />
              </Field>

              <Field label="Phone number">
                <Input type="tel" placeholder="+234 801 000 0000"
                  value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
              </Field>

              <Field label="Street address">
                <Input placeholder="14 Apapa Road"
                  value={form.address} onChange={(e) => update("address", e.target.value)} required />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="City / Area">
                  <Input placeholder="e.g. Mainland"
                    value={form.city} onChange={(e) => update("city", e.target.value)} />
                </Field>
                <Field label="State">
                  <select
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-400"
                    required
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            </StepShell>
          )}

          {/* ── Step 3: Verification ──────────────────────── */}
          {step === 3 && (
            <StepShell
              title="Verification documents"
              description="Required by MedPin to confirm your pharmacy is licensed and legitimate."
              onNext={next}
              onBack={back}
              nextDisabled={!form.pcnLicenseNo || !form.cacRegNo || !form.superintendentName || !form.superintendentPcn}
            >
              {/* Info callout */}
              <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                <p className="text-xs leading-5 text-emerald-800">
                  All credentials are verified against PCN and CAC records before your listing goes live. This protects patients and your business.
                </p>
              </div>

              <Field label="PCN Pharmacy License Number" hint="Pharmacists Council of Nigeria - e.g. PCN/LAG/2021/00412">
                <Input placeholder="PCN/LAG/YYYY/XXXXX"
                  value={form.pcnLicenseNo} onChange={(e) => update("pcnLicenseNo", e.target.value)} required />
              </Field>

              <Field label="CAC Registration Number" hint="Corporate Affairs Commission business registration">
                <Input placeholder="RC-XXXXXXX"
                  value={form.cacRegNo} onChange={(e) => update("cacRegNo", e.target.value)} required />
              </Field>

              <Field label="Superintendent Pharmacist - Full name" hint="The licensed pharmacist responsible for this premises">
                <Input placeholder="e.g. Dr. Amara Okafor"
                  value={form.superintendentName} onChange={(e) => update("superintendentName", e.target.value)} required />
              </Field>

              <Field label="Superintendent PCN License Number" hint="Individual PCN license of the superintendent pharmacist">
                <Input placeholder="PCN/PHARM/XXXXX"
                  value={form.superintendentPcn} onChange={(e) => update("superintendentPcn", e.target.value)} required />
              </Field>

              <Field label={<>NAFDAC Registration <span className="text-slate-400 font-normal">(optional)</span></>}
                hint="Required only if dispensing NAFDAC-regulated products">
                <Input placeholder="NAFDAC Reg. No."
                  value={form.nafdacNo} onChange={(e) => update("nafdacNo", e.target.value)} />
              </Field>

              {/* Document upload placeholder */}
              <Field label="Upload PCN certificate" hint="PDF or image - max 5 MB">
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40">
                  <Upload size={18} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Click to upload or drag and drop</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" />
                </label>
              </Field>
            </StepShell>
          )}

          {/* ── Step 4: Review & submit ───────────────────── */}
          {step === 4 && (
            <StepShell
              title="Review & submit"
              description="Check your details before submitting for verification."
              onBack={back}
              nextLabel="Submit application"
              onNext={handleSubmit}
              nextDisabled={!form.agreedToTerms}
            >
              {/* Summary rows */}
              <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 text-sm overflow-hidden">
                <ReviewRow label="Email"            value={form.email} />
                <ReviewRow label="Pharmacy"         value={form.pharmacyName} />
                <ReviewRow label="Phone"            value={form.phone} />
                <ReviewRow label="Address"          value={`${form.address}${form.city ? ", " + form.city : ""}, ${form.state}`} />
                <ReviewRow label="PCN License"      value={form.pcnLicenseNo} />
                <ReviewRow label="CAC No."          value={form.cacRegNo} />
                <ReviewRow label="Superintendent"   value={`${form.superintendentName} (${form.superintendentPcn})`} />
                {form.nafdacNo && <ReviewRow label="NAFDAC" value={form.nafdacNo} />}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreedToTerms}
                  onChange={(e) => update("agreedToTerms", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-500"
                />
                <span className="text-xs leading-5 text-slate-600">
                  I confirm that all information provided is accurate and that this pharmacy holds valid licences. I agree to MedPin's{" "}
                  <span className="font-semibold text-emerald-600">Partner Terms</span> and{" "}
                  <span className="font-semibold text-emerald-600">Privacy Policy</span>.
                </span>
              </label>
            </StepShell>
          )}

          <p className="mt-6 text-center text-xs text-slate-500">
            Already a partner?{" "}
            <Link to="/pharmacy/login" className="font-semibold text-emerald-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function StepShell({ title, description, children, onNext, onBack, nextLabel = "Continue", nextDisabled }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="space-y-4">{children}</div>

      <div className="flex items-center gap-3 pt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft size={15} /> Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {nextLabel} <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="shrink-0 text-xs font-medium text-slate-400 w-28">{label}</span>
      <span className="text-xs text-slate-700 text-right">{value}</span>
    </div>
  )
}

function SuccessScreen({ pharmacyName }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f9f6] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <Check size={28} className="text-emerald-600" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-800">Application submitted!</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        <strong>{pharmacyName || "Your pharmacy"}</strong> is under review. We'll verify your PCN and CAC credentials and notify you within <strong>1–2 business days</strong>.
      </p>
      <Link
        to="/"
        className="mt-8 flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
      >
        <span className="text-white">Back to home</span> <ArrowRight size={15} className="text-white"/>
      </Link>
    </div>
  )
}
