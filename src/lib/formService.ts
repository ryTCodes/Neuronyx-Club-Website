import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  writeBatch,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { FormResponse, FormStructure } from "@/types/form";

/**
 * Sanitizes object by stripping out undefined values and non-serializable properties recursively.
 */
export function sanitizeForFirestore(obj: unknown): unknown {
  if (obj === undefined || obj === null) return null;
  if (typeof obj === "function") return null;
  if (Array.isArray(obj)) {
    return obj
      .map(sanitizeForFirestore)
      .filter((v) => v !== undefined && v !== null);
  } else if (typeof obj === "object") {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (v !== undefined && typeof v !== "function") {
        const sanitizedVal = sanitizeForFirestore(v);
        if (sanitizedVal !== undefined && sanitizedVal !== null) {
          clean[k] = sanitizedVal;
        }
      }
    }
    return clean;
  }
  return obj;
}

const formsCollection = collection(db, "forms");
const responsesCollection = collection(db, "responses");

export async function getForms(): Promise<FormStructure[]> {
  const snapshot = await getDocs(formsCollection);
  const forms = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as FormStructure[];

  return forms.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function getFormById(id: string): Promise<FormStructure | null> {
  const docRef = doc(db, "forms", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as FormStructure;
}

export async function getFormBySlug(slug: string): Promise<FormStructure | null> {
  const q = query(formsCollection, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const document = snapshot.docs[0];
  return {
    id: document.id,
    ...document.data(),
  } as FormStructure;
}

export async function createForm(
  formData: Omit<FormStructure, "id">,
  userUid?: string
): Promise<string> {
  const cleanData = sanitizeForFirestore({
    ...formData,
    createdBy: userUid || "admin",
    createdAt: formData.createdAt || Date.now(),
    updatedAt: Date.now(),
  }) as Record<string, unknown>;

  const docRef = await addDoc(formsCollection, cleanData);
  return docRef.id;
}

export async function updateForm(
  id: string,
  formData: Partial<FormStructure>
): Promise<void> {
  const cleanData = sanitizeForFirestore({
    ...formData,
    updatedAt: Date.now(),
  }) as Record<string, unknown>;

  await updateDoc(doc(db, "forms", id), cleanData);
}

export async function toggleFormStatus(id: string, isOpen: boolean): Promise<void> {
  await updateDoc(doc(db, "forms", id), {
    isOpen,
    updatedAt: Date.now(),
  });
}

export async function deleteForm(id: string): Promise<void> {
  // 1. Delete all responses linked to this form in chunks of 500
  const responsesQuery = query(responsesCollection, where("formId", "==", id));
  const responsesSnapshot = await getDocs(responsesQuery);

  const batchSize = 500;
  for (let i = 0; i < responsesSnapshot.docs.length; i += batchSize) {
    const chunk = responsesSnapshot.docs.slice(i, i + batchSize);
    const batch = writeBatch(db);
    chunk.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }

  // 2. Delete the form document itself
  await deleteDoc(doc(db, "forms", id));
}

export async function getFormResponses(formId: string): Promise<FormResponse[]> {
  const q = query(responsesCollection, where("formId", "==", formId));
  const snapshot = await getDocs(q);

  const responses = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as FormResponse[];

  return responses.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
}

export async function deleteFormResponse(responseId: string): Promise<void> {
  await deleteDoc(doc(db, "responses", responseId));
}

export async function submitFormResponse(
  formId: string,
  data: Record<string, unknown>,
  userEmail?: string
): Promise<string> {
  const cleanData = sanitizeForFirestore({
    formId,
    data,
    userEmail: userEmail || null,
    submittedAt: Date.now(),
  }) as Record<string, unknown>;

  const docRef = await addDoc(responsesCollection, cleanData);
  return docRef.id;
}

