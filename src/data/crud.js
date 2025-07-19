import {
	collection,
	doc,
	getDocs,
	addDoc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import { db } from "./firebase.js";

const COMPANIES_COLLECTION = "companies";

async function getCompanies() {
	try {
		const companiesCollerction = collection(db, COMPANIES_COLLECTION);
		const snapshot = await getDocs(companiesCollerction);
		const companies = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return companies;
	} catch (error) {
		console.error("Error fetching companies: ", error);
		throw error;
	}
}

async function addCompany(companyData) {
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

async function updateCompany(id, companyData) {
	try {
		const companyDoc = doc(db, COMPANIES_COLLECTION, id);
		await updateDoc(companyDoc, companyData);
	} catch (error) {
		console.error("Error updating company: ", error);
		throw error;
	}
}

export { addCompany, getCompanies, updateCompany };
