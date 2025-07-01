import fs from 'fs/promises';

try {
  const file = await fs.readFile('./scripts/normalized_companies.json', 'utf-8');
  const companies = JSON.parse(file);

  let errors = 0;
  companies.forEach((company, index) => {
    const requiredFields = [
      'name', 'address', 'zip', 'city', 'contact', 'phone',
      'ringt', 'notes', 'fleet'
    ];

    const missingFields = requiredFields.filter((field) =>
      company[field] === undefined || company[field] === null
    );

    if (missingFields.length > 0) {
      errors++;
      console.warn(`⚠️  Entry ${index + 1} is missing fields:`, missingFields);
    }

    // Check vehicle fleet booleans
    const fleetKeys = [
      'Grusbil', 'Godsbil', 'Timmerbil', 'Bulkbil', 'Väghyvel', 'Hjullastare',
      'Baklastare', 'Kranbil', 'Flisbil', 'Dumper', 'Skogsmaskin', 'Grävare'
    ];

    fleetKeys.forEach(key => {
      if (typeof company.fleet[key] !== 'boolean') {
        console.warn(`⚠️  Entry ${index + 1} has invalid fleet value for '${key}'`);
      }
    });
  });

  console.log(`\n✅ Checked ${companies.length} companies with ${errors} invalid entries.`);
} catch (err) {
  console.error('❌ Failed to read or parse normalized_companies.json:', err);
}
