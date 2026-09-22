"use client";

import React, { useEffect, useRef } from "react";
import { Bold, Italic, Link2, List, ListOrdered, RemoveFormatting } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write a description...",
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync external value changes without disrupting active typing
  useEffect(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      const incomingHtml = value || "";
      if (
        document.activeElement !== editorRef.current &&
        currentHtml !== incomingHtml &&
        (currentHtml !== "<p><br></p>" || incomingHtml !== "")
      ) {
        editorRef.current.innerHTML = incomingHtml;
      }
    }
  }, [value]);

  function executeCommand(command: string, arg?: string) {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
  }

  function handleInput() {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html === "<p><br></p>" || html === "<br>" || html === "" ? "" : html);
    }
  }

  function handleAddLink() {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      executeCommand("createLink", url);
    }
  }

  return (
    <div
      className={`rounded-2xl border border-[#1E293B] bg-[#0A1020]/90 transition-colors focus-within:border-[#38BDF8]/60 ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#1E293B] p-2 bg-[#0D1526] rounded-t-2xl">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("bold");
          }}
          title="Bold"
          className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#38BDF8]/10 hover:text-[#38BDF8]"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("italic");
          }}
          title="Italic"
          className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#38BDF8]/10 hover:text-[#38BDF8]"
        >
          <Italic size={16} />
        </button>
        <div className="mx-1 h-4 w-px bg-[#1E293B]" />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("insertUnorderedList");
          }}
          title="Bullet List"
          className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#38BDF8]/10 hover:text-[#38BDF8]"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("insertOrderedList");
          }}
          title="Numbered List"
          className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#38BDF8]/10 hover:text-[#38BDF8]"
        >
          <ListOrdered size={16} />
        </button>
        <div className="mx-1 h-4 w-px bg-[#1E293B]" />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleAddLink();
          }}
          title="Insert Link"
          className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#38BDF8]/10 hover:text-[#38BDF8]"
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("removeFormat");
          }}
          title="Clear Formatting"
          className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#38BDF8]/10 hover:text-[#38BDF8]"
        >
          <RemoveFormatting size={16} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[120px] p-4 text-sm leading-relaxed text-[#F8FAFC] outline-none empty:before:text-[#64748B] empty:before:content-[attr(data-placeholder)] [&_a]:text-[#38BDF8] [&_a]:underline [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
      />
    </div>
  );
}
