"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart2,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import FirebasePermissionError from "@/components/forms/FirebasePermissionError";
import Logo from "@/components/forms/Logo";
import { deleteForm, getForms, toggleFormStatus } from "@/lib/formService";
import type { FormStructure } from "@/types/form";

export default function AdminFormsPage() {
  const [forms, setForms] = useState<FormStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (formId: string, currentStatus: boolean | undefined) => {
    const newStatus = currentStatus === false;
    try {
      setTogglingId(formId);
      await toggleFormStatus(formId, newStatus);
      setForms((prev) =>
        prev.map((f) => (f.id === formId ? { ...f, isOpen: newStatus } : f))
      );
    } catch (err: unknown) {
      console.error("Error toggling status:", err);
      alert("Failed to update form status. Please try again.");
    } finally {
      setTogglingId(null);
    }
  };

  const loadForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getForms();
      setForms(data);
    } catch (err: unknown) {
      console.error("Error loading forms:", err);
      setError((err as Error).message || "Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        const data = await getForms();
        if (!ignore) {
          setForms(data);
        }
      } catch (err: unknown) {
        console.error(err);
        if (!ignore) {
          setError((err as Error).message || "Failed to load forms.");
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
  }, []);

  const copyToClipboard = (slug: string, id: string) => {
    const url = `${window.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = async () => {
    if (!formToDelete) return;
    setIsDeleting(true);
    try {
      await deleteForm(formToDelete);
      setFormToDelete(null);
      await loadForms();
    } catch (err: unknown) {
      console.error("Error deleting form:", err);
      alert(`Failed to delete form: ${(err as Error).message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredForms = forms.filter(
    (form) =>
      form.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 text-[#F8FAFC]">
          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[#1E293B] pb-6 sm:pb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#38BDF8] font-bold">
                Forms Engine
              </p>
              <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
                Forms & Registrations
              </h1>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Manage your data collection pipelines, event registrations, and form submissions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <Link
                href="/admin/forms/create"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#168BFF] via-[#38BDF8] to-[#22D3EE] px-5 py-2.5 text-sm font-bold text-[#05070D] shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
              >
                <Plus size={18} />
                <span>Create New Form</span>
              </Link>
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
              placeholder="Search forms by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#0D1526]/80 py-3.5 pl-12 pr-4 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]/40 transition"
            />
          </div>

          {error && (
            <FirebasePermissionError error={error} onRetry={loadForms} />
          )}

          {/* Forms List */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#38BDF8]" size={32} />
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#1E293B] bg-[#0D1526]/40 p-16 text-center">
              <h3 className="text-lg font-bold text-[#94A3B8]">No forms found</h3>
              <p className="mt-1 text-sm text-[#64748B]">
                {searchTerm
                  ? "Try a different search query."
                  : "Create your first form to start collecting responses."}
              </p>
              {!searchTerm && (
                <Link
                  href="/admin/forms/create"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#168BFF] to-[#38BDF8] px-5 py-2.5 text-sm font-bold text-[#05070D] transition hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                >
                  <Plus size={18} />
                  Create Form
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#1E293B] bg-[#0D1526]/80 p-6 transition duration-300 hover:border-[#38BDF8]/40 hover:bg-[#0D1526]"
                >
                  <span className="nx-corner tl" />
                  <span className="nx-corner tr" />
                  <span className="nx-corner bl" />
                  <span className="nx-corner br" />

                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A1020]">
                          <Logo className="h-6 w-6" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(form.id, form.isOpen)}
                          disabled={togglingId === form.id}
                          className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                            form.isOpen !== false
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          }`}
                          title={
                            form.isOpen !== false
                              ? "Click to stop accepting responses"
                              : "Click to start accepting responses"
                          }
                        >
                          <span
                            className={`h-2 w-2 rounded-full transition-all ${
                              form.isOpen !== false
                                ? "bg-emerald-400 shadow-[0_0_8px_#10B981]"
                                : "bg-red-400"
                            } ${togglingId === form.id ? "animate-ping" : ""}`}
                          />
                          <span>
                            {togglingId === form.id
                              ? "Updating..."
                              : form.isOpen !== false
                              ? "Accepting"
                              : "Closed"}
                          </span>
                        </button>
                        {form.restrictToDomain && (
                          <span className="rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#38BDF8]">
                            @aiktc.ac.in
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(form.slug, form.id)}
                          className="rounded-lg p-2 text-[#94A3B8] hover:bg-white/10 hover:text-[#38BDF8] transition"
                          title="Copy shareable link"
                        >
                          {copiedId === form.id ? (
                            <Check size={18} className="text-emerald-400" />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                        <Link
                          href={`/forms/${form.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-[#94A3B8] hover:bg-white/10 hover:text-[#38BDF8] transition"
                          title="View public form"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="line-clamp-1 text-xl font-bold text-[#F8FAFC]">
                        {form.title}
                      </h3>
                      <div
                        className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#94A3B8]"
                        dangerouslySetInnerHTML={{
                          __html: form.description || "No description provided.",
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-6 space-y-4 border-t border-[#1E293B] pt-4">
                    <div className="flex items-center justify-between font-mono text-xs text-[#64748B]">
                      <span>{form.fields?.length || 0} fields</span>
                      <span>
                        {form.createdAt
                          ? new Date(form.createdAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={`/admin/forms/responses/${form.id}`}
                        className="flex flex-col items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A1020] py-2.5 text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white transition duration-200"
                      >
                        <BarChart2 size={16} className="mb-1 text-[#38BDF8]" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                          Responses
                        </span>
                      </Link>

                      <Link
                        href={`/admin/forms/edit/${form.id}`}
                        className="flex flex-col items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A1020] py-2.5 text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white transition duration-200"
                      >
                        <Edit3 size={16} className="mb-1 text-[#38BDF8]" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                          Edit
                        </span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setFormToDelete(form.id)}
                        className="flex flex-col items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A1020] py-2.5 text-red-400/80 hover:border-red-900/40 hover:bg-red-950/20 hover:text-red-400 transition duration-200"
                      >
                        <Trash2 size={16} className="mb-1" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                          Delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {formToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <div className="relative w-full max-w-md rounded-2xl border border-[#1E293B] bg-[#0D1526] p-8 shadow-2xl space-y-6 text-center">
                <span className="nx-corner tl" />
                <span className="nx-corner tr" />
                <span className="nx-corner bl" />
                <span className="nx-corner br" />

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
                  <Trash2 size={28} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#F8FAFC]">Delete Form?</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    This will permanently delete the form and{" "}
                    <strong className="text-red-400">all collected responses</strong>.
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormToDelete(null)}
                    disabled={isDeleting}
                    className="flex-1 rounded-xl border border-[#1E293B] bg-[#0A1020] py-3 text-sm font-bold text-[#F8FAFC] hover:bg-[#1E293B]/40 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500 transition disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Form"
                    )}
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
