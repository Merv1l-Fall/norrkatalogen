import { collection, doc, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";

const COMPANIES_COLLECTION = "companies";


async function addCompany(companyData) {
  try {
	const docRef = await addDoc(collection(db, COMPANIES_COLLECTION), companyData);
	return docRef.id;
  } catch (error) {
	console.error("Error adding company: ", error);
	throw error;
  }
}

export { addCompany };