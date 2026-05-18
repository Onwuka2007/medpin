import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, ShieldX } from "lucide-react";
import PageHeader from "../components/pharmacy-dashboard/PageHeader.jsx";
import { apiRequest } from "../lib/api.js";

export default function AdminPendingPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    loadPendingPharmacies();
  }, []);

  async function loadPendingPharmacies() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/pharmacy/all?status=pending");
      setPharmacies(data.pharmacies ?? []);
    } catch (err) {
      setError(err?.message || "Could not load pending pharmacies.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(pharmacyId) {
    setActiveId(pharmacyId);
    setActionMessage("");

    try {
      await apiRequest(`/pharmacy/${pharmacyId}/verify`, {
        method: "PATCH",
      });
      setPharmacies((current) => current.filter((item) => item._id !== pharmacyId));
      setActionMessage("Pharmacy approved successfully.");
    } catch (err) {
      setError(err?.message || "Could not approve this pharmacy.");
    } finally {
      setActiveId("");
    }
  }

  async function handleReject(pharmacyId) {
    const rejectionReason = window.prompt("Enter a rejection reason for this pharmacy.");

    if (!rejectionReason) {
      return;
    }

    setActiveId(pharmacyId);
    setActionMessage("");

    try {
      await apiRequest(`/pharmacy/${pharmacyId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ rejectionReason }),
      });
      setPharmacies((current) => current.filter((item) => item._id !== pharmacyId));
      setActionMessage("Pharmacy rejected successfully.");
    } catch (err) {
      const message = Array.isArray(err?.errors)
        ? err.errors.join(" ")
        : err?.message || "Could not reject this pharmacy.";
      setError(message);
    } finally {
      setActiveId("");
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f9f6] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <PageHeader
            title="Pending Pharmacies"
            description="Review newly registered pharmacy applications and decide whether to approve or reject them."
          />
          <Link
            to="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back home
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <SummaryCard
            icon={<Clock3 size={18} className="text-amber-600" />}
            label="Pending now"
            value={String(pharmacies.length)}
            accent="bg-amber-50 border-amber-100"
          />
          <SummaryCard
            icon={<CheckCircle2 size={18} className="text-emerald-600" />}
            label="Action flow"
            value="Approve"
            accent="bg-emerald-50 border-emerald-100"
          />
          <SummaryCard
            icon={<ShieldX size={18} className="text-rose-600" />}
            label="Action flow"
            value="Reject with reason"
            accent="bg-rose-50 border-rose-100"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {actionMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Loading pending pharmacies...
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-slate-800">No pending pharmacies</p>
            <p className="mt-2 text-sm text-slate-500">
              Every pharmacy application has already been reviewed.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                    <th className="px-5 py-4">Pharmacy</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">PCN</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmacies.map((pharmacy) => {
                    const isBusy = activeId === pharmacy._id;

                    return (
                      <tr key={pharmacy._id} className="border-t border-slate-100 align-top">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">{pharmacy.pharmacyName}</p>
                          <p className="mt-1 text-sm text-slate-500">{pharmacy.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {pharmacy.phone}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <p>{pharmacy.state}</p>
                          <p className="mt-1 text-slate-400">{pharmacy.city || "No city supplied"}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {pharmacy.pcnLicenseNo}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            {pharmacy.verificationStatus || "pending"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => handleApprove(pharmacy._id)}
                              disabled={isBusy}
                              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isBusy ? "Working..." : "Approve"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(pharmacy._id)}
                              disabled={isBusy}
                              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, accent }) {
  return (
    <div className={`rounded-[24px] border p-5 ${accent}`}>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
          {icon}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
