import { NextResponse } from "next/server";
import Invoice from "@/models/Invoice";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // // Fetch invoices from the database
    const count = await Invoice.countDocuments();

    // // Return the invoices as a JSON response
    return NextResponse.json(count);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices", errorMessage: error },
      { status: 500 }
    );
  }
}
