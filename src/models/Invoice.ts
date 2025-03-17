import { Item } from "@/types/types";
import mongoose, { Document, Schema } from "mongoose";

export interface InvoiceDocument extends Document {
  invoiceNumber: string;
  address: string;
  items: Item[];
  subTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grossAmount: number;
  date: Date;
  duedate: Date;
}

const itemSchema = new Schema<Item>({
  serialNumber: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  itemName: { type: String, required: true },
});

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    items: [itemSchema],
    subTotal: { type: Number, required: true },
    cgst: { type: Number, required: true },
    sgst: { type: Number, required: true },
    igst: { type: Number, required: true },
    grossAmount: { type: Number, required: true },
    date: { type: Date, required: true }, // Fixed
    duedate: { type: Date, required: true }, // Fixed
  },
  { timestamps: true }
);

export default mongoose.models.Invoice ||
  mongoose.model<InvoiceDocument>("Invoice", invoiceSchema, "invoices");
