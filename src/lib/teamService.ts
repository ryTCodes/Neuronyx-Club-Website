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
import type { TeamMember } from "@/types/team";

const teamCollection = collection(db, "team");

export async function getTeamMembers(): Promise<TeamMember[]> {
  const snapshot = await getDocs(teamCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as TeamMember[];
}

export async function createTeamMember(
  member: Omit<TeamMember, "id" | "createdAt" | "updatedAt">
) {
  await addDoc(teamCollection, {
    ...member,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTeamMember(
  id: string,
  member: Partial<
    Omit<TeamMember, "id" | "createdAt" | "updatedAt">
  >
) {
  await updateDoc(doc(db, "team", id), {
    ...member,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTeamMember(id: string) {
  await deleteDoc(doc(db, "team", id));
}