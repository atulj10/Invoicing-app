import { NextResponse } from "next/server";
import Invoice from "@/models/Invoice";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    // Connect to MongoDB
    connectDB();

    // // Fetch invoices from the database
    const invoices = await Invoice.find({}).exec();

    // // Return the invoices as a JSON response
    return NextResponse.json({ data: invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices", errorMessage: error },
      { status: 500 }
    );
  }
}
