"use client";

import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import FormBuilder from "@/components/forms/FormBuilder";

export default function CreateFormPage() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <FormBuilder />
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
