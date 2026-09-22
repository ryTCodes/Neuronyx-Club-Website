"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  Camera,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  CircleDot,
  Copy,
  Image as ImageIcon,
  LayoutTemplate,
  List,
  Loader2,
  Mail,
  Palette,
  Phone,
  Plus,
  Save,
  Settings2,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { createForm, getFormById, updateForm } from "@/lib/formService";
import { compressImage } from "@/lib/fileUpload";
import type { FieldType, FormField, FormStructure } from "@/types/form";
import FirebasePermissionError from "./FirebasePermissionError";
import RichTextEditor from "./RichTextEditor";

const FIELD_ICONS: Record<FieldType, React.ReactNode> = {
  text: <Type size={18} />,
  email: <Mail size={18} />,
  phone: <Phone size={18} />,
  dropdown: <ChevronDown size={18} />,
  "single-choice": <CircleDot size={18} />,
  "multiple-choice": <List size={18} />,
  checkbox: <CheckSquare size={18} />,
  paragraph: <AlignLeft size={18} />,
  file: <Upload size={18} />,
  image: <ImageIcon size={18} />,
  section: <LayoutTemplate size={18} />,
};

interface FormBuilderProps {
  formId?: string;
}

export default function FormBuilder({ formId }: FormBuilderProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [headerImage, setHeaderImage] = useState("");
  const [existingSlug, setExistingSlug] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [ctaLinkUrl, setCtaLinkUrl] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [limitOneResponse, setLimitOneResponse] = useState(false);
  const [restrictToDomain, setRestrictToDomain] = useState(false);
  const [loading, setLoading] = useState(!!formId);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [theme, setTheme] = useState({
    fontFamily: "font-sans",
    accentColor: "#38BDF8",
    backgroundColor: "#05070D",
  });

  const handleHeaderImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      try {
        const compressed = await compressImage(file, 1600, 0.85);
        setHeaderImage(compressed);
      } catch (err) {
        console.error(err);
        alert("Error processing header image.");
      }
    }
  };

  const handleFieldImageUpload = async (
    fieldId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      try {
        const compressed = await compressImage(file, 1200, 0.82);
        updateField(fieldId, { imageUrl: compressed });
      } catch (err) {
        console.error(err);
        alert("Error processing field image.");
      }
    }
  };

  useEffect(() => {
    if (formId) {
      const fetchForm = async () => {
        try {
          setLoading(true);
          const data = await getFormById(formId);
          if (data) {
            setTitle(data.title || "");
            setDescription(data.description || "");
            setFields(data.fields || []);
            setHeaderImage(data.headerImage || "");
            setExistingSlug(data.slug || "");
            setSuccessMessage(data.successMessage || "");
            setCtaLinkUrl(data.ctaLinkUrl || "");
            setCtaButtonText(data.ctaButtonText || "");
            setCtaDescription(data.ctaDescription || "");
            setIsOpen(data.isOpen !== undefined ? data.isOpen : true);
            setLimitOneResponse(data.limitOneResponse || false);
            setRestrictToDomain(data.restrictToDomain || false);
            if (data.theme) {
              setTheme(data.theme);
            }
          }
        } catch (err) {
          console.error("Error fetching form:", err);
          alert("Failed to load form details.");
        } finally {
          setLoading(false);
        }
      };
      fetchForm();
    }
  }, [formId]);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      placeholder: "",
      options: [
        "dropdown",
        "single-choice",
        "multiple-choice",
        "checkbox",
      ].includes(type)
        ? ["Option 1"]
        : undefined,
    };
    setFields((prev) => [...prev, newField]);

    setTimeout(() => {
      const element = document.getElementById(`field-${newField.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const removeField = (fieldId: string) => {
    setFields((prev) => prev.filter((f) => f.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, ...updates } : f))
    );
  };

  const duplicateField = (field: FormField) => {
    const duplicated: FormField = {
      ...field,
      id: uuidv4(),
      label: `${field.label} (Copy)`,
    };
    setFields((prev) => [...prev, duplicated]);
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    setFields((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(newIndex, 0, moved);
      return updated;
    });
  };

  const addOption = (fieldId: string) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === fieldId && f.options) {
          return {
            ...f,
            options: [...f.options, `Option ${f.options.length + 1}`],
          };
        }
        return f;
      })
    );
  };

  const updateOption = (fieldId: string, index: number, value: string) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === fieldId && f.options) {
          const newOptions = [...f.options];
          newOptions[index] = value;
          return { ...f, options: newOptions };
        }
        return f;
      })
    );
  };

  const removeOption = (fieldId: string, index: number) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === fieldId && f.options) {
          return { ...f, options: f.options.filter((_, i) => i !== index) };
        }
        return f;
      })
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a form title");
      return;
    }
    if (fields.length === 0) {
      alert("Please add at least one field to your form");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const slug =
        existingSlug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        uuidv4().slice(0, 8);

      const cleanedFields = fields.map((f) =>
        ["image", "section", "paragraph"].includes(f.type)
          ? { ...f, required: false }
          : f
      );

      const formData: Partial<FormStructure> = {
        title,
        description,
        fields: cleanedFields,
        headerImage,
        successMessage,
        ctaLinkUrl,
        ctaButtonText,
        ctaDescription,
        isOpen,
        limitOneResponse,
        restrictToDomain,
        theme,
        slug,
      };

      if (formId) {
        await updateForm(formId, formData);
      } else {
        await createForm(
          formData as Omit<FormStructure, "id">,
          auth.currentUser?.uid
        );
      }

      router.push("/admin/forms");
    } catch (err: unknown) {
      console.error(err);
      setSaveError((err as Error).message || "Error saving form");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Top bar */}
        <div className="flex flex-col gap-4 border-b border-[#1E293B] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => router.push("/admin/forms")}
              className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#38BDF8] transition hover:text-[#22D3EE]"
            >
              <ChevronLeft size={16} />
              Back to Forms
            </button>
            <h1 className="text-3xl font-bold text-[#F8FAFC]">
              {formId ? "Edit Form" : "Create New Form"}
            </h1>
            <p className="text-sm text-[#94A3B8]">
              Build and customize your data collection pipeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Direct Status Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                isOpen
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  : "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              }`}
              title="Click to toggle whether this form accepts responses"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isOpen ? "bg-emerald-400 shadow-[0_0_8px_#10B981]" : "bg-red-400"
                }`}
              />
              <span>{isOpen ? "Accepting Responses" : "Form Closed"}</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeOpen(!themeOpen)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                themeOpen
                  ? "border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8]"
                  : "border-[#1E293B] bg-[#0D1526] text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white"
              }`}
            >
              <Palette size={16} />
              Theme
            </button>

            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                settingsOpen
                  ? "border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8]"
                  : "border-[#1E293B] bg-[#0D1526] text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white"
              }`}
            >
              <Settings2 size={16} />
              Settings
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#168BFF] via-[#38BDF8] to-[#22D3EE] px-6 py-2.5 text-sm font-bold text-[#05070D] shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Form
                </>
              )}
            </button>
          </div>
        </div>

        {saveError && (
          <FirebasePermissionError
            error={saveError}
            onRetry={handleSave}
          />
        )}

        {/* Theme Settings Drawer */}
        {themeOpen && (
          <div className="rounded-2xl border border-[#1E293B] bg-[#0D1526]/95 p-6 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#F8FAFC] flex items-center gap-2">
                <Palette size={18} className="text-[#38BDF8]" />
                Form Appearance & Palette
              </h3>
              <button
                type="button"
                onClick={() => setThemeOpen(false)}
                className="text-[#64748B] hover:text-[#F8FAFC]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) =>
                      setTheme({ ...theme, accentColor: e.target.value })
                    }
                    className="h-10 w-16 cursor-pointer rounded-lg border border-[#1E293B] bg-[#0A1020] p-1"
                  />
                  <span className="font-mono text-xs text-[#38BDF8]">
                    {theme.accentColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) =>
                      setTheme({ ...theme, backgroundColor: e.target.value })
                    }
                    className="h-10 w-16 cursor-pointer rounded-lg border border-[#1E293B] bg-[#0A1020] p-1"
                  />
                  <span className="font-mono text-xs text-[#94A3B8]">
                    {theme.backgroundColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Font Family
                </label>
                <select
                  value={theme.fontFamily}
                  onChange={(e) =>
                    setTheme({ ...theme, fontFamily: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#1E293B] bg-[#0A1020] p-2.5 text-sm text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-none"
                >
                  <option value="font-sans">Sora / Modern Sans</option>
                  <option value="font-display">Outfit / Display</option>
                  <option value="font-mono">JetBrains Mono / Tech</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Form Settings Drawer */}
        {settingsOpen && (
          <div className="rounded-2xl border border-[#1E293B] bg-[#0D1526]/95 p-6 space-y-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#F8FAFC] flex items-center gap-2">
                <Settings2 size={18} className="text-[#38BDF8]" />
                Access & Submission Rules
              </h3>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="text-[#64748B] hover:text-[#F8FAFC]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <label className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0A1020]/90 p-4 cursor-pointer hover:border-[#38BDF8]/40 transition">
                <div>
                  <p className="font-semibold text-sm text-[#F8FAFC]">Accepting Responses</p>
                  <p className="text-xs text-[#94A3B8]">Open or close form</p>
                </div>
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={(e) => setIsOpen(e.target.checked)}
                  className="h-5 w-5 rounded border-[#1E293B] text-[#38BDF8] focus:ring-[#38BDF8]"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0A1020]/90 p-4 cursor-pointer hover:border-[#38BDF8]/40 transition">
                <div>
                  <p className="font-semibold text-sm text-[#F8FAFC]">Limit 1 Response</p>
                  <p className="text-xs text-[#94A3B8]">Per device / email</p>
                </div>
                <input
                  type="checkbox"
                  checked={limitOneResponse}
                  onChange={(e) => setLimitOneResponse(e.target.checked)}
                  className="h-5 w-5 rounded border-[#1E293B] text-[#38BDF8] focus:ring-[#38BDF8]"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0A1020]/90 p-4 cursor-pointer hover:border-[#38BDF8]/40 transition">
                <div>
                  <p className="font-semibold text-sm text-[#F8FAFC]">College Domain Only</p>
                  <p className="text-xs text-[#94A3B8]">Restrict to @aiktc.ac.in</p>
                </div>
                <input
                  type="checkbox"
                  checked={restrictToDomain}
                  onChange={(e) => setRestrictToDomain(e.target.checked)}
                  className="h-5 w-5 rounded border-[#1E293B] text-[#38BDF8] focus:ring-[#38BDF8]"
                />
              </label>
            </div>

            {/* Post-submission CTA configuration */}
            <div className="border-t border-[#1E293B] pt-5 space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                Post-Submission Action (e.g. WhatsApp Group Invite)
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">
                    Custom Success Message
                  </label>
                  <input
                    type="text"
                    value={successMessage}
                    onChange={(e) => setSuccessMessage(e.target.value)}
                    placeholder="Your response has been registered successfully!"
                    className="w-full rounded-xl border border-[#1E293B] bg-[#0A1020] p-3 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">
                    Action Link URL (e.g. WhatsApp Group Link)
                  </label>
                  <input
                    type="url"
                    value={ctaLinkUrl}
                    onChange={(e) => setCtaLinkUrl(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full rounded-xl border border-[#1E293B] bg-[#0A1020] p-3 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaButtonText}
                    onChange={(e) => setCtaButtonText(e.target.value)}
                    placeholder="Join WhatsApp Group"
                    className="w-full rounded-xl border border-[#1E293B] bg-[#0A1020] p-3 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">
                    CTA Card Description
                  </label>
                  <input
                    type="text"
                    value={ctaDescription}
                    onChange={(e) => setCtaDescription(e.target.value)}
                    placeholder="Join our official group for real-time updates and questions."
                    className="w-full rounded-xl border border-[#1E293B] bg-[#0A1020] p-3 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0D1526]/90 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <span className="nx-corner tl" />
          <span className="nx-corner tr" />
          <span className="nx-corner bl" />
          <span className="nx-corner br" />

          {/* Header Banner Upload */}
          <div className="relative overflow-hidden rounded-xl border border-dashed border-[#1E293B] hover:border-[#38BDF8]/40 bg-[#0A1020]/60 text-center transition">
            {headerImage ? (
              <div className="relative aspect-[3/1] max-h-60 w-full overflow-hidden">
                <img
                  src={headerImage}
                  alt="Form Header"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setHeaderImage("")}
                  className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white/80 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center p-8 hover:bg-[#1E293B]/20 transition">
                <Camera size={28} className="text-[#38BDF8] mb-2" />
                <span className="text-sm font-semibold text-[#F8FAFC]">
                  Upload Header Banner Image
                </span>
                <span className="text-xs text-[#64748B] mt-1 font-mono">
                  Recommended ratio 3:1 (Max 1MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Form Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#38BDF8] mb-1.5">
                Form Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Hackathon 2026 Registration"
                className="w-full rounded-xl border border-[#1E293B] bg-[#0A1020] p-4 text-xl sm:text-2xl font-bold text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]/40 transition"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Form Description / Instructions
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Provide instructions, rules, event dates, contact info..."
              />
            </div>
          </div>
        </div>

        {/* Fields List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
              Form Fields ({fields.length})
            </h2>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              id={`field-${field.id}`}
              className="group relative rounded-2xl border border-[#1E293B] bg-[#0D1526]/85 p-5 sm:p-6 transition hover:border-[#38BDF8]/40 shadow-lg space-y-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Field Icon + Label Input */}
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A1020] text-[#38BDF8]">
                    {FIELD_ICONS[field.type]}
                  </div>

                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      updateField(field.id, { label: e.target.value })
                    }
                    placeholder="Field label / question"
                    className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 font-semibold text-[#F8FAFC] hover:border-[#1E293B] focus:border-[#38BDF8] focus:bg-[#0A1020] focus:outline-none"
                  />
                </div>

                {/* Field Actions */}
                <div className="flex items-center gap-2">
                  {!["image", "section", "paragraph"].includes(field.type) && (
                    <>
                      <label className="flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            updateField(field.id, { required: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-[#1E293B] text-[#38BDF8] focus:ring-[#38BDF8]"
                        />
                        Required
                      </label>

                      <div className="mx-1 h-4 w-px bg-[#1E293B]" />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => moveField(index, "up")}
                    disabled={index === 0}
                    title="Move Up"
                    className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] disabled:opacity-30 transition"
                  >
                    <ArrowUp size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveField(index, "down")}
                    disabled={index === fields.length - 1}
                    title="Move Down"
                    className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] disabled:opacity-30 transition"
                  >
                    <ArrowDown size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => duplicateField(field)}
                    title="Duplicate"
                    className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] transition"
                  >
                    <Copy size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    title="Delete Field"
                    className="rounded-lg p-2 text-[#64748B] hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Placeholder configuration (for text inputs) */}
              {["text", "email", "phone", "paragraph"].includes(field.type) && (
                <input
                  type="text"
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    updateField(field.id, { placeholder: e.target.value })
                  }
                  placeholder="Placeholder preview text (optional)"
                  className="w-full rounded-xl border border-[#1E293B] bg-[#0A1020] p-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none"
                />
              )}

              {/* Option Configuration (for select/radio/checkbox) */}
              {["dropdown", "single-choice", "multiple-choice", "checkbox"].includes(
                field.type
              ) && (
                <div className="space-y-2 rounded-xl border border-[#1E293B] bg-[#0A1020] p-4">
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                    Options
                  </p>
                  <div className="space-y-2">
                    {field.options?.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#64748B] w-4">
                          {optIdx + 1}.
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(field.id, optIdx, e.target.value)
                          }
                          className="flex-1 rounded-lg border border-[#1E293B] bg-[#0D1526] px-3 py-1.5 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(field.id, optIdx)}
                          className="text-[#64748B] hover:text-red-400 p-1 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addOption(field.id)}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#38BDF8] hover:text-[#22D3EE] pt-1 transition"
                  >
                    <Plus size={14} /> Add Option
                  </button>
                </div>
              )}

              {/* Image upload (for image display field) */}
              {field.type === "image" && (
                <div className="space-y-3 rounded-xl border border-[#1E293B] bg-[#0A1020] p-4">
                  {field.imageUrl ? (
                    <div className="relative aspect-video max-h-48 w-full max-w-sm overflow-hidden rounded-lg border border-[#1E293B]">
                      <img
                        src={field.imageUrl}
                        alt={field.label}
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => updateField(field.id, { imageUrl: "" })}
                        className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#1E293B] hover:border-[#38BDF8]/40 p-6 hover:bg-[#1E293B]/20 transition">
                      <Upload size={20} className="text-[#38BDF8] mb-1" />
                      <span className="text-xs font-semibold text-[#F8FAFC]">
                        Upload Display Image / QR Code (Max 1MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFieldImageUpload(field.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Section notice */}
              {field.type === "section" && (
                <p className="font-mono text-xs italic text-[#38BDF8]/90">
                  This field creates a page/step transition in the public form.
                </p>
              )}
            </div>
          ))}

          {fields.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#1E293B] bg-[#0D1526]/40 p-12 text-center">
              <p className="text-[#94A3B8] font-semibold">No fields added yet</p>
              <p className="text-xs text-[#64748B] mt-1">
                Choose a field type below to start building your form.
              </p>
            </div>
          )}
        </div>

        {/* Add Field Palette */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0D1526]/90 p-6 space-y-4 shadow-xl backdrop-blur-xl">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
            Add Field Component
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {(
              [
                { type: "text", label: "Short Text" },
                { type: "paragraph", label: "Paragraph" },
                { type: "email", label: "Email" },
                { type: "phone", label: "Phone" },
                { type: "dropdown", label: "Dropdown" },
                { type: "single-choice", label: "Single Choice" },
                { type: "multiple-choice", label: "Multi Choice" },
                { type: "checkbox", label: "Checkbox" },
                { type: "file", label: "File Upload" },
                { type: "image", label: "Image / QR" },
                { type: "section", label: "Section Break" },
              ] as { type: FieldType; label: string }[]
            ).map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => addField(item.type)}
                className="flex flex-col items-center gap-2 rounded-xl border border-[#1E293B] bg-[#0A1020] p-3 text-center transition duration-200 hover:border-[#38BDF8]/50 hover:bg-[#1E293B]/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] group"
              >
                <div className="text-[#38BDF8] transition-transform group-hover:scale-110">{FIELD_ICONS[item.type]}</div>
                <span className="text-xs font-medium text-[#F8FAFC]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/forms")}
            className="rounded-xl border border-[#1E293B] bg-[#0D1526] px-6 py-3 text-sm font-semibold text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-[#F8FAFC] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#168BFF] via-[#38BDF8] to-[#22D3EE] px-8 py-3 text-sm font-bold text-[#05070D] shadow-[0_0_25px_rgba(56,189,248,0.35)] transition hover:shadow-[0_0_35px_rgba(56,189,248,0.55)] disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Form
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
