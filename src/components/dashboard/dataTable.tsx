"use client";

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Search, X } from 'lucide-react';
import { AdData } from '@/types/types';
import { cn } from '@/lib/utils';

const columnHelper = createColumnHelper<AdData>();

// Function to get main categories from tags
const getMainCategories = (tags: string) => {
  const tagArray = tags ? tags.split(';') : [];
  const categories = new Set();
  
  tagArray.forEach(tag => {
    const category = tag.split(':')[0].trim();
    categories.add(category);
  });
  
  return Array.from(categories).slice(0, 3).join(', ') + 
    (categories.size > 3 ? '...' : '');
};

// Function to format tags for preview/modal
const formatTags = (tags: string) => {
  const tagGroups: { [key: string]: string[] } = {};
  
  tags.split(';').forEach(tag => {
    const [category, value] = tag.split(':').map(s => s.trim());
    if (!tagGroups[category]) {
      tagGroups[category] = [];
    }
    tagGroups[category].push(value);
  });
  
  return tagGroups;
};

const columns = [
  columnHelper.accessor('creative_id', {
    header: 'Creative ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('creative_name', {
    header: 'Creative Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('tags', {
    header: 'Tags',
    cell: info => getMainCategories(info.getValue()),
  }),
  columnHelper.accessor('country', {
    header: 'Country',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('ad_network', {
    header: 'Ad Network',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('os', {
    header: 'OS',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('campaign', {
    header: 'Campaign',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('ipm', {
    header: 'IPM',
    cell: info => info.getValue().toFixed(2),
  }),
  columnHelper.accessor('ctr', {
    header: 'CTR',
    cell: info => `${(info.getValue() * 100).toFixed(2)}%`,
  }),
  columnHelper.accessor('spend', {
    header: 'Spend',
    cell: info => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor('impressions', {
    header: 'Impressions',
    cell: info => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor('clicks', {
    header: 'Clicks',
    cell: info => info.getValue().toLocaleString(),
  }),
];

interface DataTableProps {
  data: AdData[];
}

interface PreviewProps {
  data: AdData;
  onClose: () => void;
  onExpand: () => void;
}

interface ModalProps {
  data: AdData;
  onClose: () => void;
}

const Preview: React.FC<PreviewProps> = ({ data, onClose, onExpand }) => {
  const formattedTags = formatTags(data.tags);

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Preview</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <p className="font-medium">Creative ID:</p>
          <p className="text-gray-600">{data.creative_id}</p>
        </div>
        <div>
          <p className="font-medium">Name:</p>
          <p className="text-gray-600">{data.creative_name}</p>
        </div>
        <div>
          <p className="font-medium">Tags:</p>
          <div className="space-y-2">
            {Object.entries(formattedTags).map(([category, values]) => (
              <div key={category} className="ml-2">
                <p className="text-gray-800">{category}:</p>
                <ul className="list-disc ml-4 text-gray-600">
                  {values.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={onExpand}
        className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800"
      >
        View Full Details
      </button>
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ data, onClose }) => {
  const formattedTags = formatTags(data.tags);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ad Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]) => {
            if (key === 'tags') {
              return (
                <div key={key} className="col-span-2">
                  <p className="font-medium capitalize mb-2">Tags:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(formattedTags).map(([category, values]) => (
                      <div key={category} className="space-y-1">
                        <p className="text-gray-800 font-medium">{category}:</p>
                        <ul className="list-disc ml-4 text-gray-600">
                          {values.map((value, index) => (
                            <li key={index}>{value}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={key}>
                <p className="font-medium capitalize">{key.replace(/_/g, ' ')}:</p>
                <p className="text-gray-600">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [previewData, setPreviewData] = useState<AdData | null>(null);
  const [showModal, setShowModal] = useState(false);

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
  });

  return (
    <div className="w-full">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search all columns..."
        />
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex items-center space-x-2",
                          header.column.getCanSort() && "cursor-pointer select-none"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getCanSort() && <ArrowUpDown size={14} />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm border-b"
                    onClick={() => {
                      if (index === 0) {
                        setPreviewData(row.original);
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewData && !showModal && (
        <Preview
          data={previewData}
          onClose={() => setPreviewData(null)}
          onExpand={() => setShowModal(true)}
        />
      )}

      {showModal && previewData && (
        <Modal
          data={previewData}
          onClose={() => {
            setShowModal(false);
            setPreviewData(null);
          }}
        />
      )}
    </div>
  );
};