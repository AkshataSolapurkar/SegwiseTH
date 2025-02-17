"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { AdData } from "@/types/types";
import { SearchBar } from "./searchbar";
import { Preview } from "./preview";
import { TableHeader } from "./tableheader";
import { FilterDropdown } from "./filterbox"

const columnHelper = createColumnHelper<AdData>();

const columns = [
  columnHelper.accessor("creative_id", {
    header: "Creative ID",
    cell: (info) => `..${info.getValue().slice(-4)}`,
  }),
  columnHelper.accessor("creative_name", {
    header: "Creative Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("tags", {
    header: "Tags",
    cell: (info) => {
      const tags = (info.getValue() as string)?.split(";") || [];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap"
            >
              {tag.split(":")[0]}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
              +{tags.length - 2}
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor("country", {
    header: "Country",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("ad_network", {
    header: "Ad Network",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("os", {
    header: "OS",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("campaign", {
    header: "Campaign",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("ipm", {
    header: "IPM",
    cell: (info) => info.getValue().toFixed(2),
  }),
  columnHelper.accessor("ctr", {
    header: "CTR",
    cell: (info) => `${(info.getValue() * 100).toFixed(2)}%`,
  }),
  columnHelper.accessor("spend", {
    header: "Spend",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("impressions", {
    header: "Impressions",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("clicks", {
    header: "Clicks",
    cell: (info) => info.getValue().toLocaleString(),
  }),
];

interface DataTableProps {
  data: AdData[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [previewData, setPreviewData] = useState<AdData | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      tagFilter: (row, columnId, filterValue: string[]) => {
        if (!filterValue.length) return true
        const tags = (row.getValue(columnId) as string) || ""
        return filterValue.some(filter => tags.includes(filter))
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      // Handle tag filtering separately
      if (columnId === "tags" && activeFilters.length > 0) {
        return (row.getValue(columnId) as string)
          ?.split(";")
          .some(tag => activeFilters.includes(tag))
      }
      // Normal text search for other columns
      const value = row.getValue(columnId)
      return value != null
        ? String(value).toLowerCase().includes(String(filterValue).toLowerCase())
        : true
    },
  })

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters)
    // Apply the filters to the table
    table.getColumn("tags")?.setFilterValue(filters)
  }

  return (
    <div className="w-full z-10">
      <div className="flex gap-4 mb-4">
        <FilterDropdown onFilterChange={handleFilterChange} />
        <div className="w-full">
          <SearchBar value={globalFilter} onChange={setGlobalFilter} />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200">
        {/* This container allows horizontal scrolling of the table */}
        <div className="overflow-x-auto">
          {/* The inner container allows vertical scrolling */}
          <div
            className="overflow-y-auto h-[70vh]"
        
          >
            {/* The table has a minimum width so that on small screens it overflows horizontally */}
            <table className="min-w-[800px] w-full">
              <thead className="bg-gray-50 sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b whitespace-nowrap"
                      >
                        <TableHeader header={header} />
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 border-b">
                    {row.getVisibleCells().map((cell, index) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm"
                        onClick={() => {
                          if (index === 0) {
                            setPreviewData(row.original);
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {previewData && (
        <Preview data={previewData} onClose={() => setPreviewData(null)} />
      )}
    </div>
  )
}
