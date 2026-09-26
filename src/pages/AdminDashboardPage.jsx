import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import PageHeader from "../components/pharmacy-dashboard/PageHeader.jsx";
import AdminLayout from "../components/admin-dashboard/AdminLayout.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog.jsx";
import { apiRequest } from "../lib/api.js";

const FILTERS = [
  { key: "all", label: "All Pharmacies", tone: "slate", icon: ShieldAlert },
  { key: "pending", label: "Pending", tone: "amber", icon: Clock3 },
  { key: "approved", label: "Approved", tone: "emerald", icon: ShieldCheck },
  { key: "rejected", label: "Rejected", tone: "rose", icon: ShieldX },
];

export default function AdminDashboardPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeId, setActiveId] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [rejectingPharmacy, setRejectingPharmacy] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadPharmacies();
  }, []);

  const counts = useMemo(() => {
    const summary = { all: pharmacies.length, pending: 0, approved: 0, rejected: 0 };

    pharmacies.forEach((pharmacy) => {
      const status = pharmacy.verificationStatus || (pharmacy.isVerified ? "approved" : "pending");
      summary[status] += 1;
    });

    return summary;
  }, [pharmacies]);

  const visiblePharmacies = useMemo(() => {
    if (activeFilter === "all") {
      return pharmacies;
    }

    return pharmacies.filter((pharmacy) => {
      const status = pharmacy.verificationStatus || (pharmacy.isVerified ? "approved" : "pending");
      return status === activeFilter;
    });
  }, [activeFilter, pharmacies]);

  async function loadPharmacies() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/pharmacy/all");
      setPharmacies(data.pharmacies ?? []);
    } catch (err) {
      setError(err?.message || "Could not load pharmacies.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(pharmacyId) {
    setActiveId(pharmacyId);
    setActionMessage("");
    setError("");

    try {
      const data = await apiRequest(`/pharmacy/${pharmacyId}/verify`, {
        method: "PATCH",
      });

      setPharmacies((current) =>
        current.map((item) => (item._id === pharmacyId ? data.pharmacy : item))
      );
      setActionMessage("Pharmacy approved successfully.");
    } catch (err) {
      setError(err?.message || "Could not approve this pharmacy.");
    } finally {
      setActiveId("");
    }
  }

  function openRejectModal(pharmacy) {
    setRejectingPharmacy(pharmacy);
    setRejectionReason(pharmacy.rejectionReason || "");
    setError("");
    setActionMessage("");
  }

  async function openDetails(pharmacyId) {
    setDetailsLoading(true);
    setError("");

    try {
      const data = await apiRequest(`/pharmacy/${pharmacyId}`);
      setSelectedPharmacy(data.pharmacy ?? null);
    } catch (err) {
      setError(err?.message || "Could not load pharmacy details.");
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleRejectSubmit() {
    if (!rejectingPharmacy) return;

    setActiveId(rejectingPharmacy._id);
    setError("");

    try {
      const data = await apiRequest(`/pharmacy/${rejectingPharmacy._id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ rejectionReason }),
      });

      setPharmacies((current) =>
        current.map((item) => (item._id === rejectingPharmacy._id ? data.pharmacy : item))
      );
      setActionMessage("Pharmacy rejected successfully.");
      setRejectingPharmacy(null);
      setRejectionReason("");
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
    <AdminLayout>
      <section className="px-4 py-6 lg:px-6">
        <PageHeader
          title="Admin Dashboard"
          description="Monitor every pharmacy application, review verification outcomes, and act on pending approvals from one control surface."
        />

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {FILTERS.map(({ key, label, tone }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`rounded-[20px] border p-5 text-left transition ${getCardClasses(tone, activeFilter === key)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <Icon size={18} className={getIconClasses(tone)} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {label}
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {counts[key]}
              </p>
            </button>
          ))}
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
            Loading pharmacies...
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Pharmacy Directory</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Showing {visiblePharmacies.length} {activeFilter === "all" ? "total" : activeFilter} pharmacies.
                </p>
              </div>
            </div>

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
                  {visiblePharmacies.map((pharmacy) => {
                    const isBusy = activeId === pharmacy._id;
                    const status = pharmacy.verificationStatus || (pharmacy.isVerified ? "approved" : "pending");

                    return (
                      <tr key={pharmacy._id} className="border-t border-slate-100 align-top">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">{pharmacy.pharmacyName}</p>
                          <p className="mt-1 text-sm text-slate-500">{pharmacy.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{pharmacy.phone}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <p>{pharmacy.state}</p>
                          <p className="mt-1 text-slate-400">{pharmacy.city || "No city supplied"}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{pharmacy.pcnLicenseNo}</td>
                        <td className="px-5 py-4">
                          <StatusPill status={status} />
                          {status === "rejected" && pharmacy.rejectionReason && (
                            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                              {pharmacy.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => openDetails(pharmacy._id)}
                              disabled={isBusy}
                              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              View details
                            </button>
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
                              onClick={() => openRejectModal(pharmacy)}
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

        <Dialog open={Boolean(rejectingPharmacy)} onOpenChange={(open) => !open && setRejectingPharmacy(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject pharmacy application</DialogTitle>
              <DialogDescription>
                Provide a clear reason for rejecting {rejectingPharmacy?.pharmacyName}. This reason will be shown to the pharmacy during login.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label htmlFor="rejection-reason" className="text-sm font-medium text-slate-700">
                Rejection reason
              </label>
              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                placeholder="Explain why this pharmacy application cannot be approved."
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setRejectingPharmacy(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim() || activeId === rejectingPharmacy?._id}
                className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeId === rejectingPharmacy?._id ? "Rejecting..." : "Reject application"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(selectedPharmacy)} onOpenChange={(open) => !open && setSelectedPharmacy(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pharmacy application details</DialogTitle>
              <DialogDescription>
                Review the submitted pharmacy information before approving or rejecting the application.
              </DialogDescription>
            </DialogHeader>

            {detailsLoading ? (
              <p className="text-sm text-slate-500">Loading pharmacy details...</p>
            ) : selectedPharmacy ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem label="Pharmacy name" value={selectedPharmacy.pharmacyName} />
                <DetailItem label="Email" value={selectedPharmacy.email} />
                <DetailItem label="Phone" value={selectedPharmacy.phone} />
                <DetailItem label="State" value={selectedPharmacy.state} />
                <DetailItem label="City" value={selectedPharmacy.city || "No city supplied"} />
                <DetailItem label="Address" value={selectedPharmacy.address} />
                <DetailItem label="PCN license" value={selectedPharmacy.pcnLicenseNo} />
                <DetailItem label="CAC registration" value={selectedPharmacy.cacRegNo} />
                <DetailItem label="Superintendent" value={selectedPharmacy.superintendentName} />
                <DetailItem label="Superintendent PCN" value={selectedPharmacy.superintendentPcn} />
                <DetailItem label="NAFDAC No." value={selectedPharmacy.nafdacNo || "Not supplied"} />
                <DetailItem
                  label="Verification status"
                  value={selectedPharmacy.verificationStatus || (selectedPharmacy.isVerified ? "approved" : "pending")}
                />
                {selectedPharmacy.rejectionReason && (
                  <div className="sm:col-span-2">
                    <DetailItem label="Rejection reason" value={selectedPharmacy.rejectionReason} />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No pharmacy details available.</p>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </AdminLayout>
  );
}

function StatusPill({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

function getCardClasses(tone, isActive) {
  const palette = {
    slate: "border-slate-200 bg-white hover:border-slate-300",
    amber: "border-amber-100 bg-amber-50 hover:border-amber-200",
    emerald: "border-emerald-100 bg-emerald-50 hover:border-emerald-200",
    rose: "border-rose-100 bg-rose-50 hover:border-rose-200",
  };

  return `${palette[tone]} ${isActive ? "ring-2 ring-slate-900/10" : ""}`;
}

function getIconClasses(tone) {
  const colors = {
    slate: "text-slate-700",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
  };

  return colors[tone] || "text-slate-700";
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-800">{value}</p>
    </div>
  );
}
