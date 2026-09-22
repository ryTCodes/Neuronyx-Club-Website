"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Info,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react";

import { getFormBySlug, submitFormResponse } from "@/lib/formService";
import { uploadFile } from "@/lib/fileUpload";
import type { FormField, FormStructure } from "@/types/form";

function FormPageBackdrop() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 nx-grid-faint opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 10%, rgba(22,139,255,0.12), transparent 70%)",
        }}
      />
    </>
  );
}

export default function PublicFormViewPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [form, setForm] = useState<FormStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadForm() {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getFormBySlug(slug);

        if (!data) {
          setLoadError("Form not found. The link may be incorrect or expired.");
          return;
        }

        setForm(data);

        if (data.limitOneResponse) {
          const hasSubmitted = localStorage.getItem(`submitted_${data.id}`);
          if (hasSubmitted) {
            setAlreadySubmitted(true);
          }
        }
      } catch (err: unknown) {
        console.error("Error loading form:", err);
        setLoadError((err as Error).message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadForm();
    }
  }, [slug]);

  // Split fields into pages based on 'section' breaks
  const pages: FormField[][] = [];
  if (form) {
    let currentFields: FormField[] = [];
    form.fields.forEach((field) => {
      if (field.type === "section") {
        if (currentFields.length > 0) {
          pages.push(currentFields);
        }
        currentFields = [field];
      } else {
        currentFields.push(field);
      }
    });
    if (currentFields.length > 0 || pages.length === 0) {
      pages.push(currentFields);
    }
  }

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pages.length - 1;

  const handleInputChange = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (error) setError("");
  };

  const handleCheckboxChange = (fieldId: string, option: string) => {
    const currentValues: string[] = (formData[fieldId] as string[]) || [];
    const exists = currentValues.includes(option);
    const updated = exists
      ? currentValues.filter((v) => v !== option)
      : [...currentValues, option];
    handleInputChange(fieldId, updated);
  };

  const validatePage = (pageIndex: number): boolean => {
    const fieldsOnPage = pages[pageIndex] || [];

    for (const field of fieldsOnPage) {
      if (
        field.type === "section" ||
        field.type === "image" ||
        field.type === "paragraph"
      ) {
        continue;
      }

      const val = formData[field.id];

      if (field.required) {
        const isEmptyString = typeof val === "string" && val.trim() === "";
        const isEmptyArray = Array.isArray(val) && val.length === 0;
        const isEmptyFile =
          field.type === "file" &&
          (!val ||
            (typeof val === "object" &&
              !("url" in (val as Record<string, unknown>))));

        if (
          val === undefined ||
          val === null ||
          val === "" ||
          isEmptyString ||
          isEmptyArray ||
          isEmptyFile
        ) {
          setError(`"${field.label}" is required.`);
          const element = document.getElementById(field.id);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
          return false;
        }
      }

      // Email format and institutional domain validation
      if (
        field.type === "email" &&
        val &&
        typeof val === "string" &&
        val.trim() !== ""
      ) {
        const emailTrimmed = val.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
          setError(`Please enter a valid email address for "${field.label}".`);
          const element = document.getElementById(field.id);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
          return false;
        }

        if (form?.restrictToDomain) {
          if (!emailTrimmed.toLowerCase().endsWith("@aiktc.ac.in")) {
            setError(
              "Only @aiktc.ac.in institutional email addresses are permitted."
            );
            const element = document.getElementById(field.id);
            element?.scrollIntoView({ behavior: "smooth", block: "center" });
            return false;
          }
        }
      }

      // Phone number format validation (7 to 15 digits)
      if (
        field.type === "phone" &&
        val &&
        typeof val === "string" &&
        val.trim() !== ""
      ) {
        const cleanedPhone = val.replace(/[\s\-\(\)\+]/g, "");
        if (!/^\d{7,15}$/.test(cleanedPhone)) {
          setError(
            `Please enter a valid phone number (7 to 15 digits) for "${field.label}".`
          );
          const element = document.getElementById(field.id);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validatePage(currentPage)) {
      setError("");
      setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setError("");
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartUpload = (fieldId: string) => {
    // Open the native file chooser directly without any auth or popups
    const inputEl = document.getElementById(
      `file-input-${fieldId}`
    ) as HTMLInputElement;
    inputEl?.click();
  };

  const handleFileUpload = async (fieldId: string, file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setError("File exceeds maximum allowed size of 20MB.");
      return;
    }

    try {
      setUploadingFields((prev) => ({ ...prev, [fieldId]: true }));
      setError("");

      const uploaded = await uploadFile(
        file,
        `forms/${form?.slug || "submissions"}`
      );

      handleInputChange(fieldId, {
        name: uploaded.name,
        url: uploaded.url,
        size: uploaded.size,
        type: uploaded.type,
      });
    } catch (err: unknown) {
      console.error("File upload error:", err);
      setError(
        (err as Error).message || "Failed to upload file. Please try again."
      );
    } finally {
      setUploadingFields((prev) => ({ ...prev, [fieldId]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    if (!validatePage(currentPage)) return;

    // Check if any files are currently uploading
    const stillUploading = Object.values(uploadingFields).some(Boolean);
    if (stillUploading) {
      setError("Please wait until all files finish uploading.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const emailField = form.fields.find((f) => f.type === "email");
      const userEmail = emailField
        ? (formData[emailField.id] as string)?.trim()
        : undefined;

      await submitFormResponse(form.id, formData, userEmail);

      if (form.limitOneResponse) {
        localStorage.setItem(`submitted_${form.id}`, "true");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setError(
        (err as Error).message || "Failed to submit form. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070D] text-[#F8FAFC]">
        <FormPageBackdrop />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#38BDF8]" size={40} />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#94A3B8]">
            Loading Form Data...
          </p>
        </div>
      </div>
    );
  }

  // Load Error
  if (loadError || !form) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070D] p-6 text-center text-[#F8FAFC]">
        <FormPageBackdrop />
        <div className="relative z-10 max-w-md rounded-2xl border border-[#1E293B] bg-[#0D1526]/90 p-8 shadow-2xl backdrop-blur-xl space-y-4">
          <span className="nx-corner tl" />
          <span className="nx-corner tr" />
          <span className="nx-corner bl" />
          <span className="nx-corner br" />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Unavailable</h2>
          <p className="text-sm leading-relaxed text-[#94A3B8]">
            {loadError || "Form not found or has expired."}
          </p>
        </div>
      </div>
    );
  }

  // Form Closed
  if (form.isOpen === false) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070D] p-6 text-center text-[#F8FAFC]">
        <FormPageBackdrop />
        <div className="relative z-10 max-w-md rounded-2xl border border-[#1E293B] bg-[#0D1526]/90 p-8 shadow-2xl backdrop-blur-xl space-y-4">
          <span className="nx-corner tl" />
          <span className="nx-corner tr" />
          <span className="nx-corner bl" />
          <span className="nx-corner br" />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Form Closed</h2>
          <p className="text-sm leading-relaxed text-[#94A3B8]">
            This form is no longer accepting submissions. Thank you for your interest!
          </p>
        </div>
      </div>
    );
  }

  // Already Submitted (if limitOneResponse active)
  if (alreadySubmitted && !submitted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070D] p-6 text-center text-[#F8FAFC]">
        <FormPageBackdrop />
        <div className="relative z-10 max-w-md rounded-2xl border border-[#1E293B] bg-[#0D1526]/90 p-8 shadow-2xl backdrop-blur-xl space-y-4">
          <span className="nx-corner tl" />
          <span className="nx-corner tr" />
          <span className="nx-corner bl" />
          <span className="nx-corner br" />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Response Recorded</h2>
          <p className="text-sm leading-relaxed text-[#94A3B8]">
            You have already submitted a response for this form. Multiple submissions are disabled.
          </p>
        </div>
      </div>
    );
  }

  // Submitted Success Screen
  if (submitted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070D] p-6 text-center text-[#F8FAFC]">
        <FormPageBackdrop />

        <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#1E293B] bg-[#0D1526]/90 p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(5,7,13,0.9)] backdrop-blur-2xl space-y-6">
          <span className="nx-corner tl" />
          <span className="nx-corner tr" />
          <span className="nx-corner bl" />
          <span className="nx-corner br" />

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Submission Received
            </h2>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              {form.successMessage ||
                "Thank you! Your response has been officially recorded in our registry."}
            </p>
          </div>

          {/* Optional CTA Card (e.g. WhatsApp Group) */}
          {form.ctaLinkUrl && (
            <div className="rounded-xl border border-[#1E293B] bg-[#0A1020]/80 p-5 text-left space-y-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#38BDF8]">
                  Official Channel
                </p>
                <p className="text-sm font-semibold text-[#F8FAFC] mt-1">
                  {form.ctaDescription || "Join our community group for real-time updates and announcements."}
                </p>
              </div>

              <a
                href={form.ctaLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#168BFF] via-[#38BDF8] to-[#22D3EE] py-3 px-4 text-sm font-bold text-[#05070D] transition hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
              >
                <span>{form.ctaButtonText || "Join WhatsApp Group"}</span>
                <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentFields = pages[currentPage] || [];

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden text-[#F8FAFC] selection:bg-[#38BDF8]/30 ${form.theme?.fontFamily || ""}`}
      style={{
        backgroundColor: form.theme?.backgroundColor || "#05070D",
      }}
    >
      <FormPageBackdrop />

      {/* Main Interactive Form Area */}
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
        {/* Form Title & Description Card */}
        <div className="relative rounded-2xl border border-[#1E293B] bg-[#0D1526]/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
          <span className="nx-corner tl" />
          <span className="nx-corner tr" />
          <span className="nx-corner bl" />
          <span className="nx-corner br" />

          {/* Header Image (if attached) */}
          {form.headerImage && (
            <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 aspect-[3/1] max-h-64 w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] overflow-hidden rounded-t-2xl border-b border-[#1E293B]">
              <img
                src={form.headerImage}
                alt={form.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-3 py-1 font-mono text-[10px] font-semibold text-[#38BDF8]">
              <span className="nx-dot" />
              ACTIVE FORM
            </span>
            {form.restrictToDomain && (
              <span className="rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-3 py-1 font-mono text-[10px] font-semibold text-[#22D3EE]">
                @AIKTC.AC.IN ONLY
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
            {form.title}
          </h1>

          {form.description ? (
            <div
              className="text-sm sm:text-base leading-relaxed text-[#94A3B8] [&_a]:text-[#38BDF8] [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: form.description }}
            />
          ) : (
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              Please fill out all required fields accurately.
            </p>
          )}
        </div>

          {/* Multi-step progress bar */}
          {pages.length > 1 && (
            <div className="rounded-2xl border border-[#1E293B] bg-[#0D1526]/90 p-5 backdrop-blur-xl shadow-xl space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8]">
                <span>Stage {currentPage + 1} of {pages.length}</span>
                <span className="text-[#38BDF8]">{Math.round(((currentPage + 1) / pages.length) * 100)}% Completed</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0A1020]">
                <div
                  className="h-full bg-gradient-to-r from-[#168BFF] via-[#38BDF8] to-[#22D3EE] transition-all duration-300"
                  style={{
                    width: `${((currentPage + 1) / pages.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Form Error Banner */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 backdrop-blur-md">
              <AlertCircle size={18} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

        {/* Fields Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {currentFields.map((field) => {
            // Section Break
            if (field.type === "section") {
              return (
                <div
                  key={field.id}
                  className="relative overflow-hidden rounded-2xl border border-[#38BDF8]/30 bg-gradient-to-r from-[#168BFF]/10 via-[#38BDF8]/10 to-transparent p-6 space-y-1 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#38BDF8]">
                    <span className="nx-dot" />
                    <span>SECTION STAGE</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#F8FAFC]">
                    {field.label}
                  </h2>
                  {field.placeholder && (
                    <p className="text-xs text-[#94A3B8]">
                      {field.placeholder}
                    </p>
                  )}
                </div>
              );
            }

            // Image Display (e.g. QR code)
            if (field.type === "image") {
              return (
                <div
                  key={field.id}
                  className="rounded-2xl border border-[#1E293B] bg-[#0D1526]/70 p-6 text-center space-y-3 backdrop-blur-xl"
                >
                  {field.label && (
                    <p className="text-sm font-semibold text-[#F8FAFC]">
                      {field.label}
                    </p>
                  )}
                  {field.imageUrl && (
                    <img
                      src={field.imageUrl}
                      alt={field.label || "Display attachment"}
                      className="mx-auto max-h-64 rounded-xl object-contain border border-[#1E293B]"
                    />
                  )}
                </div>
              );
            }

            // Standard Question Field Card
            return (
              <div
                key={field.id}
                id={field.id}
                className="group relative rounded-2xl border border-[#1E293B] bg-[#0D1526]/80 p-6 sm:p-7 space-y-3.5 backdrop-blur-xl transition duration-300 hover:border-[#38BDF8]/40 shadow-lg"
              >
                <span className="nx-corner tl" />
                <span className="nx-corner tr" />
                <span className="nx-corner bl" />
                <span className="nx-corner br" />

                <div>
                  <label className="block text-sm font-semibold text-[#F8FAFC] leading-relaxed">
                    {field.label}
                    {field.required &&
                      !["image", "section", "paragraph"].includes(
                        field.type
                      ) && (
                        <span className="ml-1.5 text-[#38BDF8] font-mono">*</span>
                      )}
                  </label>
                  {field.placeholder &&
                    !["text", "email", "phone", "paragraph"].includes(
                      field.type
                    ) && (
                      <p className="mt-1 text-xs text-[#94A3B8]">
                        {field.placeholder}
                      </p>
                    )}
                </div>

                {/* Short text, Email, Phone */}
                {["text", "email", "phone"].includes(field.type) && (
                  <input
                    type={
                      field.type === "email"
                        ? "email"
                        : field.type === "phone"
                        ? "tel"
                        : "text"
                    }
                    value={(formData[field.id] as string) || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    placeholder={field.placeholder || "Enter response..."}
                    className="w-full rounded-xl border border-[#1E293B] bg-[#0A1020]/90 px-4 py-3.5 text-sm text-[#F8FAFC] placeholder-[#64748B] transition duration-200 hover:border-[#38BDF8]/30 focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]/40"
                  />
                )}

                {/* Paragraph */}
                {field.type === "paragraph" && (
                  <textarea
                    rows={4}
                    value={(formData[field.id] as string) || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    placeholder={field.placeholder || "Enter detailed response..."}
                    className="w-full rounded-xl border border-[#1E293B] bg-[#0A1020]/90 px-4 py-3.5 text-sm text-[#F8FAFC] placeholder-[#64748B] transition duration-200 hover:border-[#38BDF8]/30 focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]/40"
                  />
                )}

                {/* Dropdown */}
                {field.type === "dropdown" && (
                  <div className="relative">
                    <select
                      value={(formData[field.id] as string) || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-[#1E293B] bg-[#0A1020]/90 px-4 py-3.5 text-sm text-[#F8FAFC] transition duration-200 hover:border-[#38BDF8]/30 focus:border-[#38BDF8] focus:outline-none"
                    >
                      <option value="" className="bg-[#0A1020] text-[#64748B]">Select an option...</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt} className="bg-[#0A1020] text-[#F8FAFC]">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                      size={18}
                    />
                  </div>
                )}

                {/* Single Choice (Radio) */}
                {field.type === "single-choice" && (
                  <div className="space-y-2" role="radiogroup" aria-label={field.label}>
                    {field.options?.map((opt, i) => {
                      const isSelected = formData[field.id] === opt;
                      return (
                        <label
                          key={i}
                          className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition duration-200 ${
                            isSelected
                              ? "border-[#38BDF8] bg-[#38BDF8]/10 text-[#F8FAFC] shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                              : "border-[#1E293B] bg-[#0A1020]/70 text-[#94A3B8] hover:border-[#38BDF8]/30 hover:text-[#F8FAFC]"
                          }`}
                        >
                          <input
                            type="radio"
                            name={field.id}
                            value={opt}
                            checked={isSelected}
                            onChange={() => handleInputChange(field.id, opt)}
                            className="sr-only"
                          />
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                              isSelected
                                ? "border-[#38BDF8] bg-[#38BDF8]/20"
                                : "border-[#475569]"
                            }`}
                          >
                            {isSelected && (
                              <div className="h-2.5 w-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Multiple Choice (Multi-select) */}
                {field.type === "multiple-choice" && (
                  <div className="space-y-2" role="group" aria-label={field.label}>
                    {field.options?.map((opt, i) => {
                      const isChecked =
                        Array.isArray(formData[field.id]) &&
                        (formData[field.id] as string[]).includes(opt);
                      return (
                        <label
                          key={i}
                          className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition duration-200 ${
                            isChecked
                              ? "border-[#38BDF8] bg-[#38BDF8]/10 text-[#F8FAFC] shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                              : "border-[#1E293B] bg-[#0A1020]/70 text-[#94A3B8] hover:border-[#38BDF8]/30 hover:text-[#F8FAFC]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            name={field.id}
                            value={opt}
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(field.id, opt)}
                            className="sr-only"
                          />
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-colors ${
                              isChecked
                                ? "border-[#38BDF8] bg-[#38BDF8] text-[#05070D]"
                                : "border-[#475569]"
                            }`}
                          >
                            {isChecked && <CheckCircle2 size={14} className="stroke-[3]" />}
                          </div>
                          <span className="text-sm font-medium">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Checkbox (Multi-select) */}
                {field.type === "checkbox" && (
                  <div className="space-y-2" role="group" aria-label={field.label}>
                    {field.options?.map((opt, i) => {
                      const isChecked =
                        Array.isArray(formData[field.id]) &&
                        (formData[field.id] as string[]).includes(opt);
                      return (
                        <label
                          key={i}
                          className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition duration-200 ${
                            isChecked
                              ? "border-[#38BDF8] bg-[#38BDF8]/10 text-[#F8FAFC] shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                              : "border-[#1E293B] bg-[#0A1020]/70 text-[#94A3B8] hover:border-[#38BDF8]/30 hover:text-[#F8FAFC]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            name={field.id}
                            value={opt}
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(field.id, opt)}
                            className="sr-only"
                          />
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-colors ${
                              isChecked
                                ? "border-[#38BDF8] bg-[#38BDF8] text-[#05070D]"
                                : "border-[#475569]"
                            }`}
                          >
                            {isChecked && <CheckCircle2 size={14} className="stroke-[3]" />}
                          </div>
                          <span className="text-sm font-medium">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}


                {/* File Upload */}
                {field.type === "file" && (
                  <div>
                    {formData[field.id] ? (
                      <div className="flex items-center justify-between rounded-xl border border-[#38BDF8]/30 bg-[#0A1020] p-4">
                        <div className="flex items-center gap-3 truncate">
                          <FileText size={18} className="text-[#38BDF8] shrink-0" />
                          <span className="text-sm text-[#F8FAFC] truncate font-mono">
                            {(formData[field.id] as { name?: string })?.name ||
                              "File attached"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleInputChange(field.id, null)}
                          className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => handleStartUpload(field.id)}
                          disabled={uploadingFields[field.id]}
                          className="w-full flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#1E293B] hover:border-[#38BDF8]/50 bg-[#0A1020]/60 p-8 hover:bg-[#0D1526]/80 transition duration-300 text-center"
                        >
                          {uploadingFields[field.id] ? (
                            <>
                              <Loader2
                                className="animate-spin text-[#38BDF8] mb-2"
                                size={24}
                              />
                              <span className="text-xs text-[#94A3B8] font-medium font-mono">
                                Uploading document...
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] mb-3">
                                <Upload size={22} />
                              </div>
                              <span className="text-sm font-semibold text-[#F8FAFC]">
                                Upload document or image
                              </span>
                              <span className="font-mono text-xs text-[#64748B] mt-1">
                                Max 20MB (Direct Secure Upload)
                              </span>
                            </>
                          )}
                        </button>
                        <input
                          id={`file-input-${field.id}`}
                          type="file"
                          disabled={uploadingFields[field.id]}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              e.target.value = "";
                              handleFileUpload(field.id, file);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Navigation / Submit Controls */}
          <div className="flex items-center justify-between pt-6">
            {!isFirstPage ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#0D1526] px-5 py-3 text-sm font-semibold text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-[#F8FAFC] transition duration-200"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            ) : (
              <div />
            )}

            {!isLastPage ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#168BFF] to-[#38BDF8] px-7 py-3 text-sm font-bold text-[#05070D] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] transition duration-200"
              >
                Next Step
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#168BFF] via-[#38BDF8] to-[#22D3EE] px-9 py-3.5 text-sm font-bold text-[#05070D] shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Registration
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
