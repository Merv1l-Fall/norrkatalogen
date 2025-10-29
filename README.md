# Norrkatalogen

Norrkatalogen is an internal admin tool for managing a directory of companies, built with React and Firebase.  
It allows authenticated users to add, edit, filter, and export company data, making it easy to keep track of business contacts and their details.

## Features

- **Company Directory:**  
  Browse, search, and filter a list of companies with detailed information.

- **Add & Edit Companies:**  
  Add new companies or update existing ones, including contact info, address, vehicles, and notes.

- **Filtering & Search:**  
  Powerful filtering by vehicle types, notes, and company name.

- **Export to Excel:**  
  Export the filtered company list to an Excel file for reporting or offline use.

- **Authentication:**  
  Secure login for admin users (Firebase Auth).

- **Responsive UI:**  
  Fast, modern interface with virtualized lists for large datasets.

## Tech Stack

- **Frontend:** React, React Router, Zustand (state management), react-window (virtualized lists)
- **Backend:** Firebase Firestore (NoSQL database), Firebase Auth
- **Validation:** Joi
- **Export:** SheetJS (xlsx)
- **Styling:** CSS Modules

## Project Structure

```
src/
  components/      # Reusable UI components (CompanyCard, Filter, etc)
  css/             # CSS files for styling
  data/            # Firestore CRUD logic and Firebase config
  pages/           # Page components (Admin, Login, NewCompany)
  stores/          # Zustand stores for state management
  utils/           # Utility functions (export, debounce)
  validation/      # Joi schemas for form validation
```

**Made for internal use by Norrkatalogen admins.**