"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, RefreshCw, ShieldAlert } from "lucide-react";

interface Props {
  error?: string;
  onRetry?: () => void;
}

const DEFAULT_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /forms/{formId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    match /responses/{responseId} {
      allow create: if request.resource.data.formId is string;
      allow read, update, delete: if request.auth != null;
    }
  }
}`;

export default function FirebasePermissionError({ error, onRetry }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DEFAULT_RULES);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPermissionError =
    error?.toLowerCase().includes("permission") ||
    error?.toLowerCase().includes("insufficient") ||
    error?.toLowerCase().includes("denied");

  return (
    <div className="relative my-6 space-y-6 rounded-2xl border border-red-500/30 bg-[#0D1526]/90 p-6 text-left backdrop-blur-xl md:p-8 shadow-xl">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-red-500/10 p-3 text-red-400 border border-red-500/20">
          <ShieldAlert size={28} />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-bold text-red-400">
            {isPermissionError
              ? "Firestore Security Rules Permission Error"
              : "Database Connection Issue"}
          </h3>
          <p className="text-sm leading-relaxed text-[#94A3B8]">
            {error || "Unable to access Firebase Firestore documents."}
          </p>
        </div>
      </div>

      {isPermissionError && (
        <div className="space-y-4 border-t border-[#1E293B] pt-4">
          <p className="text-sm text-[#94A3B8]">
            This usually happens when your Firebase Firestore security rules
            are restricting reads or writes. To resolve this:
          </p>

          <ol className="list-inside list-decimal space-y-2 text-sm leading-relaxed text-[#94A3B8]">
            <li>
              Open your{" "}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#38BDF8] hover:underline"
              >
                Firebase Console <ExternalLink size={12} />
              </a>{" "}
              and select your project.
            </li>
            <li>
              Navigate to <strong>Firestore Database</strong> &rarr;{" "}
              <strong>Rules</strong> tab.
            </li>
            <li>
              Replace the existing rules with the recommended rules below and
              click <strong>Publish</strong>.
            </li>
          </ol>

          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8]">
              <span>Recommended firestore.rules</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#0A1020] px-3 py-1 text-xs text-[#F8FAFC] transition hover:border-[#38BDF8]/40 hover:text-[#38BDF8]"
              >
                {copied ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <Copy size={12} />
                )}
                <span>{copied ? "Copied Rules" : "Copy Rules"}</span>
              </button>
            </div>
            <pre className="max-h-48 overflow-x-auto rounded-xl border border-[#1E293B] bg-[#0A1020] p-4 font-mono text-[11px] leading-relaxed text-emerald-400">
              {DEFAULT_RULES}
            </pre>
          </div>
        </div>
      )}

      {onRetry && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 px-5 py-2.5 text-sm font-bold text-red-300 transition-all hover:bg-red-500/30"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
