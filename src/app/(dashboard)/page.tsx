"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/dataTable";
import Papa from "papaparse";

export default function App() {
  const [csvData, setCsvData] = useState([]);

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Ad Performance Dashboard
        </h1>
        <DataTable data={csvData} />
      </div>
    </div>
  );
}
