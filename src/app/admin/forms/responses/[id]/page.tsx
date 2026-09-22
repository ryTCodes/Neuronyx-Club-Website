"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ChevronLeft,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import FirebasePermissionError from "@/components/forms/FirebasePermissionError";
import {
  deleteFormResponse,
  getFormById,
  getFormResponses,
  toggleFormStatus,
} from "@/lib/formService";
import type { FormField, FormResponse, FormStructure } from "@/types/form";

export default function FormResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<FormStructure | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [responseToDelete, setResponseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const handleToggleStatus = async () => {
    if (!form) return;
    const newStatus = form.isOpen === false;
    try {
      setTogglingStatus(true);
      await toggleFormStatus(form.id, newStatus);
      setForm((prev) => (prev ? { ...prev, isOpen: newStatus } : null));
    } catch (err: unknown) {
      console.error("Error toggling status:", err);
      alert("Failed to toggle form status. Please try again.");
    } finally {
      setTogglingStatus(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [formData, responsesData] = await Promise.all([
        getFormById(formId),
        getFormResponses(formId),
      ]);
      setForm(formData);
      setResponses(responsesData);
    } catch (err: unknown) {
      console.error("Error loading responses:", err);
      setError((err as Error).message || "Failed to load responses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!formId) return;
    let ignore = false;

    async function init() {
      try {
        const [formData, responsesData] = await Promise.all([
          getFormById(formId),
          getFormResponses(formId),
        ]);
        if (!ignore) {
          setForm(formData);
          setResponses(responsesData);
        }
      } catch (err: unknown) {
        console.error("Error loading responses:", err);
        if (!ignore) {
          setError((err as Error).message || "Failed to load responses");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      ignore = true;
    };
  }, [formId]);

  const confirmDeleteResponse = async () => {
    if (!responseToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFormResponse(responseToDelete);
      setResponses((prev) => prev.filter((r) => r.id !== responseToDelete));
      setResponseToDelete(null);
    } catch (err: unknown) {
      console.error("Error deleting response:", err);
      alert(`Failed to delete response: ${(err as Error).message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const downloadCSV = () => {
    if (!form || responses.length === 0) return;

    const exportFields = form.fields.filter(
      (f) => f.type !== "section" && f.type !== "image"
    );
    const headers = ["Submission Date", ...exportFields.map((f) => f.label)];

    const rows = responses.map((r) => [
      new Date(r.submittedAt).toLocaleString(),
      ...exportFields.map((f) => {
        const val = r.data[f.id];
        if (typeof val === "object" && val !== null && "name" in val) {
          const fileObj = val as { name?: string; url?: string };
          return fileObj.url
            ? `${fileObj.name || "File"} (${fileObj.url.startsWith("data:") ? "Attached Data" : fileObj.url})`
            : fileObj.name || "File";
        }
        return Array.isArray(val) ? val.join("; ") : String(val ?? "");
      }),
    ]);

    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.title || "form"}_responses.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFieldValue = (field: FormField, val: unknown) => {
    if (!val) return <span className="text-[#64748B] font-mono">-</span>;

    const isFileObj =
      typeof val === "object" && val !== null && "url" in val;

    if (field.type === "file" || isFileObj) {
      let fileObj: { name?: string; url?: string; type?: string } | null =
        isFileObj
          ? (val as { name?: string; url?: string; type?: string })
          : null;

      if (typeof val === "string") {
        if (val.startsWith("data:") || val.startsWith("http")) {
          fileObj = { name: "View File", url: val };
        } else {
          return <span className="text-[#F8FAFC]">{val}</span>;
        }
      }

      if (fileObj && fileObj.url) {
        const isImage =
          fileObj.type?.startsWith("image/") ||
          fileObj.url.startsWith("data:image/");

        return (
          <div className="flex items-center gap-2">
            {isImage && (
              <img
                src={fileObj.url}
                alt={fileObj.name || "Attachment"}
                className="h-8 w-8 rounded-lg border border-[#1E293B] object-cover"
              />
            )}
            <a
              href={fileObj.url}
              target="_blank"
              rel="noopener noreferrer"
              download={fileObj.name || "attachment"}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] hover:underline"
            >
              <span>{fileObj.name || "Attachment"}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        );
      }
    }

    if (Array.isArray(val)) {
      return (
        <div className="flex flex-wrap gap-1">
          {val.map((item, idx) => (
            <span
              key={idx}
              className="rounded-md border border-[#1E293B] bg-[#0A1020] px-2 py-0.5 text-xs text-[#38BDF8] font-mono"
            >
              {String(item)}
            </span>
          ))}
        </div>
      );
    }

    return <span className="text-[#F8FAFC] text-xs">{String(val)}</span>;
  };

  const filteredResponses = responses.filter((r) =>
    Object.values(r.data).some((val) =>
      String(typeof val === "object" ? JSON.stringify(val) : val)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const displayFields = (form?.fields || []).filter(
    (f) => f.type !== "section" && f.type !== "image"
  );

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 text-[#F8FAFC]">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[#1E293B] pb-6 sm:pb-8">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => router.push("/admin/forms")}
                className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#38BDF8] transition hover:text-[#22D3EE]"
              >
                <ChevronLeft size={16} />
                Back to Forms
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
                {form?.title || "Form Responses"}
              </h1>
              <p className="text-sm text-[#94A3B8]">
                Real-time submissions registry and responses analytics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <button
                type="button"
                onClick={downloadCSV}
                disabled={responses.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#168BFF] via-[#38BDF8] to-[#22D3EE] px-5 py-2.5 text-sm font-bold text-[#05070D] shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] disabled:opacity-50"
              >
                <Download size={16} />
                <span>Export CSV ({responses.length})</span>
              </button>
            </div>
          </div>

          {error && (
            <FirebasePermissionError error={error} onRetry={loadData} />
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0D1526]/85 p-6 shadow-xl backdrop-blur-xl transition hover:border-[#38BDF8]/40">
              <span className="nx-corner tl" />
              <span className="nx-corner tr" />
              <span className="nx-corner bl" />
              <span className="nx-corner br" />
              <div className="flex items-center justify-between text-[#38BDF8]">
                <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#94A3B8]">
                  Total Submissions
                </span>
                <Users size={20} className="text-[#38BDF8]" />
              </div>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
                {responses.length}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0D1526]/85 p-6 shadow-xl backdrop-blur-xl transition hover:border-[#38BDF8]/40">
              <span className="nx-corner tl" />
              <span className="nx-corner tr" />
              <span className="nx-corner bl" />
              <span className="nx-corner br" />
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#94A3B8]">
                  Form Status
                </span>
                <span className="nx-dot" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">
                    {form?.isOpen !== false ? (
                      <span className="text-emerald-400">Accepting Responses</span>
                    ) : (
                      <span className="text-red-400">Closed</span>
                    )}
                  </p>
                  <p className="font-mono text-[11px] text-[#94A3B8] mt-0.5">
                    {form?.isOpen !== false ? "Open for new entries" : "Entries paused"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  disabled={togglingStatus}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    form?.isOpen !== false ? "bg-emerald-500" : "bg-[#1E293B]"
                  }`}
                  title={
                    form?.isOpen !== false
                      ? "Click to close submissions"
                      : "Click to accept responses"
                  }
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      form?.isOpen !== false ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0D1526]/85 p-6 shadow-xl backdrop-blur-xl transition hover:border-[#38BDF8]/40">
              <span className="nx-corner tl" />
              <span className="nx-corner tr" />
              <span className="nx-corner bl" />
              <span className="nx-corner br" />
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#94A3B8]">
                Latest Submission
              </span>
              <p className="mt-3 font-mono text-sm text-[#F8FAFC]">
                {responses[0]?.submittedAt
                  ? new Date(responses[0].submittedAt).toLocaleString()
                  : "No submissions yet"}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search responses by name, email, keyword, or answer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#0D1526]/80 py-3.5 pl-12 pr-4 text-sm text-[#F8FAFC] placeholder-[#64748B] transition focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]/40"
            />
          </div>

          {/* Responses Table */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#38BDF8]" size={36} />
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#1E293B] bg-[#0D1526]/40 p-16 text-center">
              <p className="font-semibold text-[#94A3B8]">
                {searchTerm
                  ? "No matching responses found"
                  : "No submissions recorded yet"}
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                {searchTerm
                  ? "Try searching for a different keyword."
                  : "Responses submitted through the public portal will appear here."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0D1526]/90 shadow-2xl backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#1E293B] bg-[#0A1020] text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8]">
                    <tr>
                      <th className="py-4 px-4">#</th>
                      <th className="py-4 px-4 whitespace-nowrap">Submitted At</th>
                      {displayFields.map((field) => (
                        <th
                          key={field.id}
                          className="py-4 px-4 whitespace-nowrap max-w-xs truncate"
                          title={field.label}
                        >
                          {field.label}
                        </th>
                      ))}
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/60">
                    {filteredResponses.map((response, index) => (
                      <tr
                        key={response.id}
                        className="hover:bg-[#1E293B]/20 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono text-xs text-[#64748B]">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#94A3B8] font-mono">
                          {new Date(response.submittedAt).toLocaleString()}
                        </td>
                        {displayFields.map((field) => (
                          <td
                            key={field.id}
                            className="py-3.5 px-4 max-w-xs truncate"
                          >
                            {renderFieldValue(
                              field,
                              response.data[field.id]
                            )}
                          </td>
                        ))}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setResponseToDelete(response.id)}
                            className="rounded-lg p-2 text-[#64748B] hover:bg-red-500/10 hover:text-red-400 transition"
                            title="Delete Response"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Delete Response Modal */}
          {responseToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="relative w-full max-w-sm rounded-2xl border border-[#1E293B] bg-[#0D1526] p-6 shadow-2xl space-y-4 text-center">
                <span className="nx-corner tl" />
                <span className="nx-corner tr" />
                <span className="nx-corner bl" />
                <span className="nx-corner br" />

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#F8FAFC]">Delete Response?</h3>
                <p className="text-xs leading-relaxed text-[#94A3B8]">
                  This submission will be permanently erased from the registry.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setResponseToDelete(null)}
                    disabled={isDeleting}
                    className="flex-1 rounded-xl border border-[#1E293B] bg-[#0A1020] py-2.5 text-xs font-bold text-[#F8FAFC] hover:border-[#38BDF8]/40 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteResponse}
                    disabled={isDeleting}
                    className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
