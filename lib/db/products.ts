import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  getDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";

export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  images: string[];
  variations: {
    sizes: string[];
    colors: string[];
    fabrics: string[];
  };
  stock: number;
  createdAt: number;
}

const PRODUCTS_COLLECTION = "products";

export async function getProducts(categoryId?: string) {
  let q;
  if (categoryId) {
    q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("categoryId", "==", categoryId),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProduct(id: string) {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
}

export async function createProduct(product: Omit<Product, "id">) {
  return await addDoc(collection(db, PRODUCTS_COLLECTION), product);
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  return await updateDoc(docRef, product);
}

export async function deleteProduct(id: string) {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  return await deleteDoc(docRef);
}
