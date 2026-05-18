import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function PharmacyRejectedPage() {
  const location = useLocation();
  const rejectionReason = location.state?.rejectionReason;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8f4] px-6 py-12">
      <div className="w-full max-w-lg rounded-[28px] border border-rose-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(122,34,34,0.08)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <AlertTriangle size={28} className="text-rose-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Your application was rejected
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          Your pharmacy application could not be approved at this time. Review the
          reason below, update your details if needed, and submit again.
        </p>

        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            Rejection reason
          </p>
          <p className="mt-2 text-sm leading-6 text-rose-900">
            {rejectionReason || "No specific rejection reason was provided."}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/pharmacy/register"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Update application
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Return home <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
