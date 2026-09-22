"use client";

import { useParams } from "next/navigation";

import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import FormBuilder from "@/components/forms/FormBuilder";

export default function EditFormPage() {
  const params = useParams();
  const formId = params.id as string;

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <FormBuilder formId={formId} />
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
