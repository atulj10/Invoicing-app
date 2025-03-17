"use client"; // Mark this as a Client Component

import { useEffect, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import axios from "axios";
import InvoicePrintPage from "../components/InvoicePrintPage";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";

interface Item {
  serialNumber: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  address: string;
  items: Item[];
  subTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grossAmount: number;
}

const columnHelper = createColumnHelper<Invoice>();

const columns = [
  columnHelper.accessor("invoiceNumber", {
    header: "Invoice Number",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("subTotal", {
    header: "Sub Total",
    cell: (info) => `${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("cgst", {
    header: "CGST",
    cell: (info) => `${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("sgst", {
    header: "SGST",
    cell: (info) => `${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("igst", {
    header: "IGST",
    cell: (info) => `${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("grossAmount", {
    header: "Gross Amount",
    cell: (info) => `${info.getValue().toFixed(2)}`,
  }),
];

// Modal Component
function InvoiceModal({
  invoice,
  onClose,
}: {
  invoice: Invoice | null;
  onClose: () => void;
}) {
  if (!invoice) return null;

  return (
    <div className="not-print:fixed not-print:inset-0  not-print:bg-black/30 not-print:bg-opacity-50  not-print:flex not-print:items-center not-print:justify-center  not-print:p-4  ">
      <div className=" not-print:bg-white  not-print:rounded-lg not-print:shadow-lg not-print:w-full not-print:max-w-5xl not-print:p-6   not-print:h-full not-print:overflow-y-scroll ">
        <InvoicePrintPage invoice={invoice} onClose={onClose} />
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [globalFilter, setGlobalFilter] = useState(""); // State for global search
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null); // State for selected invoice

  // Fetch data from the API route
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("/api/invoices");
        setInvoices(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  const table = useReactTable({
    data: invoices,
    columns,
    state: {
      globalFilter, // Pass the global filter state to the table
    },
    onGlobalFilterChange: setGlobalFilter, // Update the global filter state
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering
  });

  // Clear search input
  const clearSearch = () => {
    setGlobalFilter("");
  };

  // Calculate summary metrics
  const totalInvoices = invoices.length;
  const totalGrossAmount = invoices
    .reduce((sum, invoice) => sum + invoice.grossAmount, 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 not-print:p-4 ">
      {/* <div className="max-w-7xl mx-auto"> */}
      <div className=" print:hidden">
        <div className="flex gap-2  mb-8 items-center">
          <Link href={"/"}>
            <MdArrowBackIos size={30} color="black" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900  self-center "> Invoices</h1>
        </div>

        {/* Showcase Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Invoices
            </h2>
            <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Gross Amount
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {totalGrossAmount}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Filtered Invoices
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {table.getFilteredRowModel().rows.length}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search invoices..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="text-black w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {/* Clear Search Button */}
            {globalFilter && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedInvoice(row.original)} // Open modal on row click
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
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

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
      {/* {selectedInvoice && <InvoicePrintPage invoice={selectedInvoice} />} */}
    </div>
    // </div>
  );
}
