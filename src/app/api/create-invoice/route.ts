import { NextResponse } from "next/server";
import Invoice from "@/models/Invoice";
import { connectDB } from "@/lib/db";
import { Item } from "@/types/types";

// Inside src/app/api/create-invoice/route.ts
export async function POST(request: Request) {
  try {
    await connectDB();
    console.log("DB connected successfully");

    // Parse the request body
    const data = await request.json();
    console.log("Request data:", data);
    const date = new Date();
    const duedate = new Date();
    console.log("date:", date, duedate);

    // Create a new invoice document
    const invoice = new Invoice({
      invoiceNumber: data.invoiceNumber,
      address: data.address,
      items: data.items.map((item: Item) => ({
        serialNumber: item.serialNumber,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        // itemName: item.itemName,
      })),
      subTotal: data.subTotal,
      cgst: data.cgst,
      sgst: data.sgst,
      igst: data.igst,
      grossAmount: data.grossAmount,
      date: date,
      duedate: new Date(duedate).setDate(new Date(duedate).getDate() + 15),
    });

    // Save the invoice to the database
    const savedInvoice = await invoice.save();

    // Return a success response with the full document including timestamps
    return NextResponse.json(
      {
        success: true,
        data: {
          ...savedInvoice.toObject(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error details:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "An unknown error occurred",
      },
      { status: 400 }
    );
  }
}
