"use client";

import React, { useState } from "react";

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
  date?: Date;
  duedate?: Date;
}

type CompanyKey = "DWPL" | "RKE";

interface CompanyProfile {
  name: string;
  address: string[];
  contact: string;
  email: string;
  website?: string;
  gstin: string;
  pan: string;
  cin?: string;
  hsn?: string;
  bank: {
    name: string;
    accountName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
  };
  signatoryLabel: string;
  prefix: string;
}

const COMPANIES: Record<CompanyKey, CompanyProfile> = {
  DWPL: {
    name: "M/S Dimension Websoft Pvt. Ltd.",
    address: ["218, Patliputra Colony", "Patna, Bihar 800013 IN"],
    contact: "9708037522 | 7654193389",
    email: "info@dimensionwebsoft.com",
    website: "www.dwplgroup.com",
    gstin: "GSTIN: 10AACCD5730B1ZJ",
    pan: "PAN No. AACCD5730B",
    cin: "CIN: U72200BR2006PTC012625",
    bank: {
      name: "AXIS BANK",
      accountName: "DIMENSION WEBSOFT PVT. LTD.",
      accountNumber: "918020084626257",
      ifsc: "UTIB0003494",
      branch: "Gandhi Maidan, Patna",
    },
    signatoryLabel: "For DIMENSION WEBSOFT PVT LTD.",
    prefix: "DWPL",
  },
  RKE: {
    name: "R K Enterprise",
    address: [
      "Ratanpur house",
      "Jagat Narayan Road, Kadam Kuan",
      " Patna Bihar 800003 IN",
    ],
    contact: "Mob: +91 7654193389",
    email: "rkjhapatna@gmail.com",
    gstin: "GSTIN: 10AOUPJ7217A1ZB",
    pan: "PAN: AOUPJ7217A",
    hsn: "HSN/SAC Code: 998313",
    bank: {
      name: "AXIS BANK",
      accountName: "R K Enterprise",
      accountNumber: "918020084626257",
      ifsc: "UTIB0003494",
      branch: "Gandhi Maidan, Patna",
    },
    signatoryLabel: "For R K Enterprise",
    prefix: "RKE",
  },
};

const DECLARATIONS_RKE = [
  "We hereby declare that the price quoted above is not more than the price we had given to any other Govt./private Institution.",
  "We also hereby declare that our firm is not black listed by any government/private institutions.",
];

const formatDate = (date?: Date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");
};

const formatInvoiceNumber = (invoiceNumber: string, prefix: string) => {
  const parts = invoiceNumber.split("/");
  return parts.length >= 3
    ? `${prefix}/${parts[1]}/${parts[2]}`
    : invoiceNumber;
};

const InvoicePrintPage = ({
  invoice,
  onClose,
}: {
  invoice: Invoice;
  onClose: () => void;
}) => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyKey>("DWPL");
  const company = COMPANIES[selectedCompany];

  return (
    <div className="p-24 print:p-8 bg-white text-black">
      {/* Toggle Button */}
      <div className="print:hidden mb-4 flex items-center gap-3">
        <span className="font-semibold">Invoice For:</span>
        <button
          onClick={() => setSelectedCompany("DWPL")}
          className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
            selectedCompany === "DWPL"
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-blue-500 text-blue-500 hover:bg-blue-50"
          }`}
        >
          Dimension Websoft
        </button>
        <button
          onClick={() => setSelectedCompany("RKE")}
          className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
            selectedCompany === "RKE"
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-blue-500 text-blue-500 hover:bg-blue-50"
          }`}
        >
          R K Enterprise
        </button>
      </div>

      {/* Document Type */}
      <p className="print:text-[0.85rem] font-bold text-right">
        ORIGINAL FOR RECIPIENT
      </p>

      {/* Company Header */}
      <div className="pb-2">
        <h1 className="text-2xl print:text-[0.85rem] font-bold">
          {company.name}
        </h1>
        {company.address.map((line, i) => (
          <p key={i} className="print:text-[0.85rem]">
            {line}
          </p>
        ))}
        <p className="print:text-[0.85rem]">{company.contact}</p>
        <p className="print:text-[0.85rem]">{company.email}</p>
        {company.website && (
          <p className="print:text-[0.85rem]">{company.website}</p>
        )}
        <p className="print:text-[0.85rem]">{company.gstin}</p>
        <p className="print:text-[0.85rem]">{company.pan}</p>
        {company.cin && <p className="print:text-[0.85rem]">{company.cin}</p>}
        {company.hsn && <p className="print:text-[0.85rem]">{company.hsn}</p>}
      </div>

      {/* Invoice Title */}
      <h2 className="text-3xl print:text-sm font-bold text-center underline underline-offset-5">
        TAX INVOICE
      </h2>

      {/* Invoice Meta */}
      <div className="border border-black">
        <div className="flex">
          {/* Bill To */}
          <div className="pt-3 pl-2 w-[60%] border-r-[0.1rem]">
            <div>
              <p className="print:text-[0.85rem] font-bold">BILL TO:</p>
              <p className="print:text-[0.85rem] whitespace-pre-wrap">
                {invoice.address}
              </p>
            </div>
            {/* <div className="print:text-[0.85rem] font-bold mt-3 mb-1">
              <p>PLACE OF SUPPLY &ndash; Bihar</p>
            </div> */}
          </div>

          {/* Invoice Details */}
          <div className="pt-3 pl-2 w-[40%] print:text-[0.85rem]">
            <p>
              TAX INVOICE NO:{" "}
              {formatInvoiceNumber(invoice.invoiceNumber, company.prefix)}
            </p>
            <p>Date: {formatDate(invoice.date)}</p>
            <p>DUE DATE: {formatDate(invoice.duedate)}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-[0.1rem] border-black border-l-0 border-r-0">
          <thead>
            <tr>
              <th className="print:text-[0.85rem] text-left border-[0.1rem] border-black p-2 print:py-0 border-l-0">
                S.N.
              </th>
              <th className="print:text-[0.85rem] text-left border-[0.1rem] border-black p-2 print:py-0">
                Description of service
              </th>
              <th className="print:text-[0.85rem] text-left border-[0.1rem] border-black p-2 print:py-0">
                QTY
              </th>
              <th className="print:text-[0.85rem] text-left border-[0.1rem] border-black p-2 print:py-0">
                RATE
              </th>
              <th className="print:text-[0.85rem] text-left p-2 print:py-0">
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1 border-l-0">
                  {item.serialNumber}
                </td>
                <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1">
                  {item.description}
                </td>
                <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1">
                  {item.quantity}
                </td>
                <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1">
                  {item.rate.toFixed(2)}
                </td>
                <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0">
                  {item.amount.toFixed(2)}
                </td>
              </tr>
            ))}

            {/* Sub Total */}
            <tr>
              <td
                colSpan={3}
                className="border-l-0 border-r-0 border-b-[0.1rem]"
              />
              <td className="print:text-[0.85rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right">
                SUB TOTAL
              </td>
              <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left">
                {invoice.subTotal.toFixed(2)}
              </td>
            </tr>

            {/* CGST */}
            <tr>
              <td
                colSpan={3}
                className="border-l-0 border-r-0 border-b-[0.1rem] border-t-0"
              />
              <td className="print:text-[0.85rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right">
                ADD &ndash; CGST@9%
              </td>
              <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left">
                {invoice.cgst !== 0 ? invoice.cgst.toFixed(2) : "N/A"}
              </td>
            </tr>

            {/* SGST */}
            <tr>
              <td
                colSpan={3}
                className="border-l-0 border-r-0 border-b-[0.1rem] border-t-0"
              />
              <td className="print:text-[0.85rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right">
                ADD &ndash; SGST@9%
              </td>
              <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left">
                {invoice.sgst !== 0 ? invoice.sgst.toFixed(2) : "N/A"}
              </td>
            </tr>

            {/* IGST */}
            <tr>
              <td
                colSpan={3}
                className="border-l-0 border-r-0 border-b-[0.1rem] border-t-0"
              />
              <td className="print:text-[0.85rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right">
                ADD &ndash; IGST@18%
              </td>
              <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left">
                {invoice.igst !== 0 ? invoice.igst.toFixed(2) : "N/A"}
              </td>
            </tr>

            {/* Total */}
            <tr>
              <td colSpan={3} className="border-l-0 border-r-0 border-t-0" />
              <td className="print:text-[0.85rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right text-lg">
                TOTAL AMOUNT
              </td>
              <td className="print:text-[0.85rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left text-xl font-bold">
                {invoice.grossAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer: Tech Support + Bank + Signatory */}
        <div className="flex print:text-[0.85rem]">
          <div className="p-2 w-[60%] border-r-[0.1rem]  print:pb-5">
            <div className="print:text-[0.75rem]">
              <p className="font-bold">Technical Support:</p>
              <ol className=" list-item space-y-1">
                <li className="pl-0.5"> 
                  <span className="font-semibold">Telephonic:</span> 10 AM to 6
                  PM through E-Mail to rkjhapatna@gmail.com
                </li>
                <li className="pl-0.5"> 
                  <span className="font-semibold">Jurisdiction:</span> All
                  disputes are subject to Patna jurisdiction only
                </li>
                <li className="pl-0.5"> 
                  <span className="font-semibold">Cheque Payments:</span>{" "}
                  Subject to realisation – R.K. Enterprise
                </li>
                <li className="pl-0.5"> 
                  <span className="font-semibold">Payment Mode:</span> Cheque /
                  DD / NEFT / RTGS can be deposited directly
                </li>
              </ol>
            </div>
            <p>
              <b>Bank:</b> {company.bank.name}
            </p>
            <p>
              <b>Account Name:</b> {company.bank.accountName}
            </p>
            <p>
              <b>Account Number:</b> {company.bank.accountNumber}
            </p>
            <p>
              <b>IFSC code:</b> {company.bank.ifsc}
            </p>
            <p>
              <b>Branch:</b> {company.bank.branch}
            </p>
          </div>

          <div className="text-left w-[40%] flex flex-col justify-between p-2 font-bold  print:pb-5">
            <p>{company.signatoryLabel}</p>
            <p className="mt-8 text-center">Authorized Signatory</p>
          </div>
        </div>
      </div>

      {/* Declaration — only for RKE */}
      {selectedCompany === "RKE" && (
        <div className=" border border-black border-t-0 p-3">
          <h3 className="font-bold mb-2 print:text-[0.85rem]">Declaration:</h3>
          <ol className="list-decimal list-inside space-y-1 print:text-[0.85rem]">
            {DECLARATIONS_RKE.map((text, i) => (
              <li className="pl-4" key={i}>{text}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Action Buttons */}
      <div className="print:hidden flex justify-between w-full mt-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Print Invoice
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InvoicePrintPage;
