"use client";

import React from "react";

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
  date?:Date;
  duedate?: Date;
  sgst: number;
  igst: number;
  grossAmount: number;
}

const InvoicePrintPage = ({
  invoice,
  onClose,
}: {
  invoice: Invoice;
  onClose: () => void;
}) => {
  //   useEffect(() => {
  //     // Automatically trigger print when the component mounts
  //     window.print();
  //   }, []);

  return (
    <div className="p-24 print:p-8 bg-white text-black">
      <p className="print:text-[0.6rem] font-bold text-right">
        ORIGINAL FOR RECIPIENT
      </p>
      <div className=" pb-2">
        <h1 className="text-2xl print:text-[0.6rem] font-bold">
          Mis Dimension Websoft Pvt. Ltd.
        </h1>
        <p className="print:text-[0.6rem]">LG-0, GV Mall, Bonny Road</p>
        <p className="print:text-[0.6rem]">Patna, Bihar 800001 IN</p>
        <p className="print:text-[0.6rem]">9708037522</p>
        <p className="print:text-[0.6rem]">info@dimensionwebsoft.com</p>
        <p className="print:text-[0.6rem]">www.dwglypoup.com</p>
        <p className="print:text-[0.6rem]">CSTIN: 10AACDGF30B1ZJ</p>
        <p className="print:text-[0.6rem]">PAN No. AACCDGF30B</p>
        <p className="print:text-[0.6rem]">CIN: U72200BR2006PTC012625</p>
      </div>

      <h2 className="text-3xl print:text-sm font-bold text-center underline underline-offset-5">
        TAX INVOICE
      </h2>
      <div className="border-1 border-black">
        <div className="flex">
          <div className="pt-3 pl-2 w-[60%] border-r-[0.1rem]">
            <div>
              <p className=" print:text-[0.5rem] font-bold">BILL TO:</p>
              <p className="print:text-[0.5rem] whitespace-pre-wrap">
                {invoice?.address}
              </p>
            </div>
            <div className="print:text-[0.5rem] font-bold mt-3 mb-1">
              <p>PLACE OF SUPPLY – Bihar</p>
            </div>
          </div>

          <div className="pt-3 pl-2 w-[40%] print:text-[0.5rem] ">
            <p>TAX INVOICE NO: {invoice.invoiceNumber}</p>
            <p>
              Date:{" "}
              {invoice?.date
                ? new Date(invoice.date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : "N/A"}
            </p>
            <p>
              DUE DATE:{" "}
              {invoice?.duedate
                ? new Date(invoice.duedate)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : "N/A"}
            </p>
          </div>
        </div>

        <table className="w-full border-[0.1rem] border-black border-l-0 border-r-0">
          <thead>
            <tr>
              <th className=" print:text-[0.5rem] text-left border-[0.1rem] border-black p-2 print:py-0 border-l-0">
                S.N.
              </th>
              <th className=" print:text-[0.5rem] text-left border-[0.1rem] border-black p-2 print:py-0">
                Description of service
              </th>
              <th className=" print:text-[0.5rem] text-left border-[0.1rem] border-black p-2 print:py-0">
                QTY
              </th>
              <th className=" print:text-[0.5rem] text-left border-[0.1rem] border-black p-2 print:py-0">
                RATE
              </th>
              <th className=" print:text-[0.5rem] text-left  p-2 print:py-0">
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {/* This should have a min height of 200px */}
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1 border-l-0">
                  {item.serialNumber}
                </td>
                <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1">
                  {item.description}
                </td>
                <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1">
                  {item.quantity}
                </td>
                <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1">
                  {item.rate.toFixed(2)}
                </td>
                <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0">
                  {item.amount.toFixed(2)}
                </td>
              </tr>
            ))}

            {/* Tax and Total rows aligned with columns */}
            <tr>
              <td
                colSpan={3}
                className="border-l-0 border-r-0 border-b-[0.1rem]"
              ></td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right">
                SUB TOTAL
              </td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left">
                {invoice.subTotal.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="border-l-0 border-r-0 border-b-[0.1rem] border-t-0"
              ></td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right">
                ADD - CGST@9 %
              </td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left">
                {invoice.cgst.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="border-l-0 border-r-0 border-b-[0.1rem] border-t-0"
              ></td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right">
                ADD - SGST@9 %
              </td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left">
                {invoice.sgst.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="border-l-0 border-r-0 border-b-[0.1rem] border-t-0"
              ></td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right">
                ADD - IGST@18 %
              </td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left">
                {invoice.igst.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="border-l-0 border-r-0 border-t-0"></td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-l-0 border-black p-2 print:py-1 font-bold text-right text-lg">
                GROSS AMOUNT
              </td>
              <td className=" print:text-[0.5rem] border-[0.1rem] border-black p-2 print:py-1 border-r-0 text-left text-xl font-bold">
                {invoice.grossAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex print:text-[0.5rem]">
          <div className=" p-2 w-[60%] border-r-[0.1rem] font-bold pb-12 print:pb-5">
            <p>Payment can be deposited by Cheque /DD/NEFT/RTGS directly</p>
            <p>Bank: AXIS BANK</p>
            <p>Account Name: DIMENSION WEBSORT PVT. LTD.</p>
            <p>Account Number: 91802008462657</p>
            <p>IFSC code -UTIB00034948nach: Gandhi Maidan , Patna</p>
          </div>

          <div className="text-left w-[40%] flex flex-col justify-between p-2 font-bold pb-12 print:pb-5">
            <p>For DIMENSION WEBSORT PVT LTD.</p>
            <p className="mt-8 ">Authorized Signatory</p>
          </div>
        </div>
      </div>

      <div className="print:hidden flex justify-between w-full">
        <button
          onClick={() => window.print()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg print:hidden"
        >
          Print Invoice
        </button>
        <button
          onClick={onClose}
          className=" mt-4 px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg print:hidden font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InvoicePrintPage;
