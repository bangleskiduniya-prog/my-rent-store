import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface Settings {
  storeName: string;
  whatsappNumber: string;
}

const SETTINGS_COLLECTION = "settings";
const SETTINGS_DOC_ID = "general";

export async function getSettings() {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as Settings;
  }
  // Default settings
  return {
    storeName: "My Rent Store",
    whatsappNumber: "03035958676",
  };
}

export async function updateSettings(settings: Settings) {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  return await setDoc(docRef, settings, { merge: true });
}
