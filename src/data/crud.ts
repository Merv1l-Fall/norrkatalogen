import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Company, NewCompanyFormData } from "@/types";

const COMPANIES_COLLECTION = "companies";

/**
 * Fetch all companies from Firestore
 */
async function getCompanies(): Promise<Company[]> {
  try {
    const companiesCollection = collection(db, COMPANIES_COLLECTION);
    const snapshot = await getDocs(companiesCollection);
    const companies: Company[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Company));
    return companies;
  } catch (error) {
    console.error("Error fetching companies: ", error);
    throw error;
  }
}

/**
 * Add a new company to Firestore
 */
async function addCompany(companyData: NewCompanyFormData): Promise<string> {
  try {
    const docRef = await addDoc(
      collection(db, COMPANIES_COLLECTION),
      companyData
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding company: ", error);
    throw error;
  }
}

/**
 * Update an existing company in Firestore
 */
async function updateCompany(
  id: string,
  companyData: Partial<Company>
): Promise<void> {
  try {
    const companyDoc = doc(db, COMPANIES_COLLECTION, id);
    await updateDoc(companyDoc, companyData);
    console.log(
      `Company with name ${companyData.companyName} updated successfully`
    );
  } catch (error) {
    console.error("Error updating company: ", error);
    throw error;
  }
}

/**
 * Delete a company from Firestore
 */
async function deleteCompany(id: string): Promise<void> {
  try {
    const companyDoc = doc(db, COMPANIES_COLLECTION, id);
    await deleteDoc(companyDoc);
    console.log(`Company with id ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting company: ", error);
    throw error;
  }
}

export { addCompany, getCompanies, updateCompany, deleteCompany };
