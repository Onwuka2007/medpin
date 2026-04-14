import React, { useState } from "react"
import { Building2, Clock, Phone, Mail, MapPin, Bell, Shield, Save } from "lucide-react"
import PageHeader from "../PageHeader.jsx"
import { Input } from "@/components/ui/input.jsx"
import { mockPharmacyProfile } from "../../../data/mock/dashboard.js"

/* ────────────────────────────────────────────────────────────
   SettingsTab  -  pharmacy profile + preferences (shell only).
   All edits are local state; no backend yet.
──────────────────────────────────────────────────────────── */

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const DEFAULT_HOURS = {
  Monday:    { open: "08:00", close: "20:00", closed: false },
  Tuesday:   { open: "08:00", close: "20:00", closed: false },
  Wednesday: { open: "08:00", close: "20:00", closed: false },
  Thursday:  { open: "08:00", close: "20:00", closed: false },
  Friday:    { open: "08:00", close: "20:00", closed: false },
  Saturday:  { open: "09:00", close: "17:00", closed: false },
  Sunday:    { open: "10:00", close: "15:00", closed: true  },
}

export default function SettingsTab() {
  /* Pharmacy profile fields */
  const [profile, setProfile] = useState({
    name:    "Alpha Pharmacy",
    email:   "alpha@medpin.ng",
    phone:   "+234 801 234 5678",
    address: "14 Apapa Road, Mainland, Lagos",
    license: "PCN/LAG/2021/00412",
  })

  /* Opening hours */
  const [hours, setHours] = useState(DEFAULT_HOURS)

  /* Notification toggles */
  const [notifications, setNotifications] = useState({
    lowStock:       true,
    newSearches:    true,
    weeklyReport:   false,
    systemUpdates:  true,
  })

  const updateProfile = (field, value) =>
    setProfile((p) => ({ ...p, [field]: value }))

  const updateHours = (day, field, value) =>
    setHours((h) => ({ ...h, [day]: { ...h[day], [field]: value } }))

  const toggleNotification = (key) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }))

  const handleSave = () => {
    /* No-op for now - backend will handle persistence */
    alert("Settings saved (local state only - backend integration pending).")
  }

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Settings" description="Manage your pharmacy profile and preferences." />

      {/* Two-column layout: forms left, profile card right */}
      <div className="grid gap-6 xl:grid-cols-[1fr_280px] xl:items-start">

      {/* ── Left column: all form sections ──────────────── */}
      <div className="space-y-6">

      {/* Pharmacy profile */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <Building2 size={16} className="text-emerald-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Pharmacy Profile</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Pharmacy name</label>
            <Input value={profile.name} onChange={(e) => updateProfile("name", e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">License number</label>
            <Input value={profile.license} onChange={(e) => updateProfile("license", e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              <Mail size={12} className="inline mr-1" />Email
            </label>
            <Input type="email" value={profile.email} onChange={(e) => updateProfile("email", e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              <Phone size={12} className="inline mr-1" />Phone
            </label>
            <Input type="tel" value={profile.phone} onChange={(e) => updateProfile("phone", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              <MapPin size={12} className="inline mr-1" />Address
            </label>
            <Input value={profile.address} onChange={(e) => updateProfile("address", e.target.value)} />
          </div>
        </div>
      </section>

      {/* ── Opening hours ────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <Clock size={16} className="text-emerald-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Opening Hours</h3>
        </div>

        <div className="space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {/* Day label + toggle always on the same line */}
              <div className="flex items-center gap-3">
                <span className="w-24 text-xs font-medium text-slate-600 shrink-0">{day}</span>

                {/* Closed toggle */}
                <button
                  type="button"
                  onClick={() => updateHours(day, "closed", !hours[day].closed)}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                    hours[day].closed ? "bg-slate-200" : "bg-emerald-500"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      hours[day].closed ? "left-0.5" : "left-[18px]"
                    }`}
                  />
                </button>
              </div>

              {/* Time inputs - wraps below on small screens */}
              {hours[day].closed ? (
                <span className="text-xs text-slate-400">Closed</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={hours[day].open}
                    onChange={(e) => updateHours(day, "open", e.target.value)}
                    className="w-28 text-xs"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <Input
                    type="time"
                    value={hours[day].close}
                    onChange={(e) => updateHours(day, "close", e.target.value)}
                    className="w-28 text-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Notifications ────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <Bell size={16} className="text-emerald-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: "lowStock",      label: "Low stock alerts",         desc: "Notify when a drug falls below restock threshold" },
            { key: "newSearches",   label: "New search activity",      desc: "Daily summary of searches for your listed drugs" },
            { key: "weeklyReport",  label: "Weekly performance report", desc: "Every Monday - searches, views, and stock health" },
            { key: "systemUpdates", label: "System updates",           desc: "Platform announcements and new features" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleNotification(key)}
                className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${
                  notifications[key] ? "bg-emerald-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    notifications[key] ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Danger zone ──────────────────────────────────── */}
      <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
            <Shield size={16} className="text-rose-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Account</h3>
        </div>
        <p className="mb-4 text-xs text-slate-500">
          Deactivating your pharmacy removes it from MedPin search results. Your data is retained for 30 days.
        </p>
        <button
          type="button"
          className="rounded-lg border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          Deactivate pharmacy listing
        </button>
      </section>

      {/* Save */}
      <div className="flex justify-end pb-4">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          <Save size={15} />
          Save changes
        </button>
      </div>

      </div>{/* end left column */}

      {/* ── Right column: profile card ───────────────────── */}
      <div className="sticky top-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 ring-4 ring-emerald-50">
              {mockPharmacyProfile.initials}
            </div>
            <h3 className="mt-3 text-base font-semibold text-slate-800">{profile.name}</h3>
            <p className="text-xs text-slate-400">{profile.address}</p>

            {/* Status badge */}
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active listing
            </span>
          </div>

          <hr className="my-5 border-slate-100" />

          {/* Details */}
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2 text-slate-600">
              <Mail size={13} className="mt-0.5 shrink-0 text-slate-400" />
              {profile.email}
            </li>
            <li className="flex items-start gap-2 text-slate-600">
              <Phone size={13} className="mt-0.5 shrink-0 text-slate-400" />
              {profile.phone}
            </li>
            <li className="flex items-start gap-2 text-slate-600">
              <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />
              {profile.address}
            </li>
            <li className="flex items-start gap-2 text-slate-600">
              <Shield size={13} className="mt-0.5 shrink-0 text-slate-400" />
              {profile.license}
            </li>
          </ul>

          <hr className="my-5 border-slate-100" />

          {/* Today's hours */}
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Today's hours</p>
          {(() => {
            const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
            const h = hours[today]
            return (
              <p className="text-xs text-slate-600">
                {h.closed ? "Closed today" : `${h.open} – ${h.close}`}
              </p>
            )
          })()}
        </div>
      </div>

      </div>{/* end grid */}
    </div>
  )
}
