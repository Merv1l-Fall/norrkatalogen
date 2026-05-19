import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs/promises";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addCompany(companyData) {
  const docRef = await addDoc(collection(db, "companies"), companyData);
  return docRef.id;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function validateForFirestore(obj, path = "") {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof key !== "string") {
      throw new Error(`Invalid key type at ${currentPath}`);
    }
    if (
      key.includes(".") ||
      key.includes("$") ||
      key.includes("/") ||
      key.includes("[") ||
      key.includes("]") ||
      key.includes("#")
    ) {
      throw new Error(`Invalid key character in ${currentPath}`);
    }

    if (value === undefined) {
      throw new Error(`Undefined value at ${currentPath}`);
    }
    if (typeof value === "function") {
      throw new Error(`Function value at ${currentPath}`);
    }
    if (Number.isNaN(value)) {
      throw new Error(`NaN value at ${currentPath}`);
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      validateForFirestore(value, currentPath);
    }
  }
}

async function uploadCompanies() {
  const file = await fs.readFile('./scripts/testCompanies.json', 'utf-8');
  const companies = JSON.parse(file);

  for (const company of companies) {
    try {
      console.log(`Uploading company: ${company.companyName}`);
	  try{
		  validateForFirestore(company);

	  } catch (error) {
		  console.error(`Validation error for company ${company.companyName}:`, error.message);}
      const docId = await addCompany(company);
      console.log(`Company ${company.companyName} uploaded with ID: ${docId}`);
      await sleep(50); // Avoid hitting Firestore limits
    } catch (error) {
      console.error(`Error uploading company: ${company.companyName}`, error);
    }
  }
  console.log("All companies uploaded successfully.");
}



uploadCompanies()