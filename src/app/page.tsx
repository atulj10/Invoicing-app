"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Invoice, Item } from "@/types/types";
import Link from "next/link";

export default function Home() {
  const [formData, setFormData] = useState<Invoice>({
    invoiceNumber: "",
    address: "",
    items: [
      {
        serialNumber: "1", // Initialize with serial number 1
        description: "",
        quantity: 0,
        rate: 0,
        amount: 0,
        // itemName: "",
      },
    ],
    subTotal: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    grossAmount: 0,
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const fetchInvoiceCount = async () => {
    try {
      const response = await axios.get("/api/invoice-count");
      const year = new Date().getFullYear();
      const paddedCount = String(response.data + 1).padStart(4, "0");
      const invoiceNumber = `DWPL/${year}/${paddedCount}`;

      setFormData((prev) => ({
        ...prev,
        invoiceNumber,
      }));
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceCount();
  }, []);

  // Calculate item amounts whenever quantity or rate changes
  useEffect(() => {
    const updatedItems = formData.items.map((item) => ({
      ...item,
      amount: item.quantity * item.rate,
    }));

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  }, [formData.items.map((item) => item.quantity + "-" + item.rate).join(",")]);

  // Update serial numbers whenever items change
  useEffect(() => {
    const updatedItems = formData.items.map((item, index) => ({
      ...item,
      serialNumber: String(index + 1), // Auto-upgrade serial numbers
    }));

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  }, [formData.items.length]);

  // Unified handler for all item fields
  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: unknown
  ) => {
    const newItems = [...formData.items];

    // Convert to number for numeric fields
    if (field === "quantity" || field === "rate") {
      newItems[index][field] = Number(value);
    } else {
      newItems[index][field] = value as never;
    }

    setFormData({
      ...formData,
      items: newItems,
    });
  };

  // Handler for top-level form fields
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          serialNumber: String(formData.items.length + 1), // Auto-generate serial number
          description: "",
          quantity: 0,
          rate: 0,
          amount: 0,
          // itemName: "",
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData({
        ...formData,
        items: newItems,
      });
    }
  };

  const calculateAmounts = () => {
    setIsCalculating(true);

    // Calculate subtotal from items
    const subTotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    // Modified tax calculations: CGST + SGST for Bihar, IGST for others
    const isBiharAddress = formData.address.toLowerCase().includes("bihar");

    // Apply CGST and SGST for Bihar addresses, zero for others
    const cgst = isBiharAddress ? subTotal * 0.09 : 0;
    const sgst = isBiharAddress ? subTotal * 0.09 : 0;

    // Apply IGST for non-Bihar addresses, zero for Bihar
    const igst = isBiharAddress ? 0 : subTotal * 0.18;

    const grossAmount = subTotal + cgst + sgst + igst;

    // Update state with calculations
    setTimeout(() => {
      setFormData({
        ...formData,
        subTotal,
        cgst,
        sgst,
        igst,
        grossAmount,
      });
      setIsCalculating(false);
    }, 300); // Small delay for visual feedback
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    calculateAmounts();

    try {
      const response = await axios.post("/api/create-invoice", formData);
      alert("Invoice saved successfully!");
      console.log(response.data);
      setFormData({
        invoiceNumber: "",
        address: "",
        items: [
          {
            serialNumber: "1",
            description: "",
            quantity: 0,
            rate: 0,
            amount: 0,
            // itemName: "",
          },
        ],
        subTotal: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        grossAmount: 0,
      });
      fetchInvoiceCount();
    } catch (error) {
      console.error(error);
      alert("Failed to save invoice.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <Link
          href={"/invoice-listing"}
          className="text-indigo-600 absolute right-0 top-0 text-lg font-semibold hover:text-indigo-700 transition-colors flex items-center gap-2"
        >
          <span>Listing 📃</span>
        </Link>
      </div>
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Invoice Generator
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Invoice Details Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleFormChange}
                required
                readOnly
                placeholder="INV-2025-001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-700 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                required
                rows={4}
                placeholder="Full address (include state)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-700"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
              <h3 className="text-xl font-semibold text-white">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-white text-indigo-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white transition-all flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Item
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-700">
                      Item #{item.serialNumber}
                    </h4>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        value={item.serialNumber}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) =>
                          handleItemChange(index, "itemName", e.target.value)
                        }
                        required
                        placeholder="Product name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-700"
                      />
                    </div> */}
                    <div className="">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        required
                        placeholder="Brief description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        required
                        min="0"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate
                      </label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", e.target.value)
                        }
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={item.amount.toFixed(2)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={calculateAmounts}
              disabled={isCalculating}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-8 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md"
            >
              {isCalculating ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Calculating...
                </span>
              ) : (
                "Calculate Totals"
              )}
            </button>
          </div>

          {/* Totals Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Invoice Summary
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Total
                </label>
                <input
                  type="text"
                  value={formData.subTotal.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CGST (9%)
                </label>
                <input
                  type="text"
                  value={formData.cgst.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SGST (9%)
                </label>
                <input
                  type="text"
                  value={formData.sgst.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  IGST (18%)
                  <span className="text-xs text-gray-500 italic">
                    {formData.address.toLowerCase().includes("bihar")
                      ? "(N/A for Bihar)"
                      : "(Applied for non-Bihar)"}
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.igst.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
              </div>
            </div>

            {/* Gross Amount */}
            <div className="mt-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Total Amount
              </label>
              <input
                type="text"
                value={formData.grossAmount.toFixed(2)}
                readOnly
                className="w-full px-4 py-3 border border-indigo-300 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-lg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all text-lg font-semibold shadow-lg"
          >
            Submit Invoice
          </button>
        </form>
      </div>
    </div>
  );
}
