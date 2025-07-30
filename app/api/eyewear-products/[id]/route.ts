import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb";
import EyewearProduct from "@/models/EyewearProduct";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const product = await EyewearProduct.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error("Error fetching eyewear product:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const updated = await EyewearProduct.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating eyewear product:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deleted = await EyewearProduct.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting eyewear product:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
