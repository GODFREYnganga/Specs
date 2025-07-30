import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb";
const Product = require("@/models/EyewearProduct");

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
