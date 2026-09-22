import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

export async function loginAdmin(
  email: string,
  password: string
): Promise<User> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = credential.user;

  const adminDoc = await getDoc(doc(db, "admins", user.uid));

  if (!adminDoc.exists()) {
    await signOut(auth);
    throw new Error("You are not authorized to access the admin panel.");
  }

  return user;
}

export async function logoutAdmin() {
  await signOut(auth);
}

export function subscribeToAuth(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}