import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Event } from "@/types/event";

const eventsCollection = collection(db, "events");

export async function getEvents(): Promise<Event[]> {
  const snapshot = await getDocs(eventsCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Event[];
}

export async function createEvent(
  event: Omit<Event, "id" | "createdAt" | "updatedAt">
) {
  await addDoc(eventsCollection, {
    ...event,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEvent(
  id: string,
  event: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>
) {
  await updateDoc(doc(db, "events", id), {
    ...event,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEvent(id: string) {
  await deleteDoc(doc(db, "events", id));
}