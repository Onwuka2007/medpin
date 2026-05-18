import { Link } from "react-router-dom";
import { Clock3, ArrowRight } from "lucide-react";

export default function PharmacyPendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f9f6] px-6 py-12">
      <div className="w-full max-w-lg rounded-[28px] border border-emerald-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(31,86,73,0.08)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Clock3 size={28} className="text-amber-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Your application is pending
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          Your pharmacy registration has been received and is currently under review.
          You will be able to sign in after MedPin approves your application.
        </p>

        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Verification usually takes 1 to 2 business days.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/pharmacy/login"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to login
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Return home <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
