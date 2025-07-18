import fs from 'fs/promises';

function validateFirestoreData(obj, path = '') {
  if (typeof obj !== 'object' || obj === null) return;

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    // Check for forbidden characters in keys
    if (key.includes('.') || key.includes('$') || key.includes('/')) {
      throw new Error(`Invalid character in key: ${currentPath}`);
    }

    // Check for invalid values
    if (value === undefined) {
      throw new Error(`Undefined value at: ${currentPath}`);
    }
    if (typeof value === 'function') {
      throw new Error(`Function found at: ${currentPath}`);
    }
    if (typeof value === 'number' && Number.isNaN(value)) {
      throw new Error(`NaN found at: ${currentPath}`);
    }

    // Recursive check for nested objects (excluding arrays)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      validateFirestoreData(value, currentPath);
    }
  }
}

try {
  const file = await fs.readFile('./scripts/companies.json', 'utf-8');
  const companies = JSON.parse(file);

  let errors = 0;

  companies.forEach((company, index) => {
    const requiredFields = [
      'companyName', 'address', 'postalCode', 'city', 'contactPerson', 'contactPhone',
      'called', 'notes', 'vehicles'
    ];

    const missingFields = requiredFields.filter((field) =>
      company[field] === undefined || company[field] === null
    );

    if (missingFields.length > 0) {
      errors++;
      console.warn(`⚠️ Entry ${index + 1} is missing fields:`, missingFields);
    }

    // Check vehicle fleet booleans
    const fleetKeys = [
      "grusbil", 'godsbil', 'timmerbil', 'bulkbil', 'väghyvel', 'hjullastare',
      'baklastare', 'kranbil', 'flisbil', 'dumper', 'skogsmaskin', 'grävare'
    ];

    fleetKeys.forEach(key => {
      if (typeof company.vehicles[key] !== 'boolean') {
        console.warn(`⚠️ Entry ${index + 1} has invalid fleet value for '${key}'`);
      }
    });

    // Run the recursive Firestore validation
    try {
      validateFirestoreData(company);
    } catch (err) {
      errors++;
      console.error(`❌ Validation error in entry ${index + 1} (${company.companyName}): ${err.message}`);
    }
  });

  console.log(`\n✅ Checked ${companies.length} companies with ${errors} invalid entries.`);

} catch (err) {
  console.error('❌ Failed to read or parse companies.json:', err);
}
