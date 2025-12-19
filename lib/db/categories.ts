import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query,
  orderBy,
  where,
  limit
} from "firebase/firestore";

export interface Category {
  id?: string;
  name: string;
}

const CATEGORIES_COLLECTION = "categories";

export async function getCategories() {
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
}

export async function getCategoryByName(name: string) {
  const q = query(collection(db, CATEGORIES_COLLECTION), where("name", "==", name), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Category;
}

export async function createCategory(name: string) {
  return await addDoc(collection(db, CATEGORIES_COLLECTION), { name });
}

export async function deleteCategory(id: string) {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  return await deleteDoc(docRef);
}
