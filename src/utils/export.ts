import * as XLSX from "xlsx";
import type { Company, ExportData } from "@/types";

/**
 * Export companies to Excel file
 * @param companies - Array of companies to export
 */
function exportToExcel(companies: Company[]): void {
  // allVehicleTypes intentionally unused; removed to satisfy strict checks

  const data: ExportData[] = companies.map((company) => {
    const vehicles = Object.entries(company.vehicles || {})
      .filter(([_, val]) => val)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(", ");

    return {
      "Företagsnamn": company.companyName,
      "Adress": company.address,
      "Postnummer": company.postalCode,
      "Stad": company.city,
      "Kontaktperson": company.contactPerson,
      "Telefon": company.contactPhone,
      "Noteringar": company.notes || "",
      "Fordon": vehicles,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Företag");
  XLSX.writeFile(workbook, "foretag.xlsx");
}

export default exportToExcel;
