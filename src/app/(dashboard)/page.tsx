"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/dataTable";
import Papa from "papaparse";
import { FilterDropdown } from "@/components/dashboard/filterbox";

export default function App() {
  const [csvData, setCsvData] = useState([] as any[]);

  useEffect(() => {
    const fetchCsv = async () => {
      const response = await fetch("/Segwise Report.csv"); // Load CSV file from public folder
      const text = await response.text();

      Papa.parse(text, {
        header: true, // Convert rows into objects
        skipEmptyLines: true,
        dynamicTyping: true, // Convert numbers automatically
        complete: (result) => {
          setCsvData(result.data);
        },
      });
    };

    fetchCsv();
  }, []);

  return (

    <div className="">
      <div className="lg:max-w-7xl mx-auto">
        <div className="overflow-x-auto mt-4">
          <DataTable data={csvData} />
        </div>
      </div>
    </div>
  );
}
