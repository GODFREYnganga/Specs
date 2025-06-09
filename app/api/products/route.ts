import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Product = require("../../../models/Product")
import { promises as fs } from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category");

  const query: any = {};
  if (searchQuery) {
    query.name = { $regex: searchQuery, $options: "i" };
  }
  if (category) {
    query.category = category;
  }

  const products = await Product.find(query);
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const product = await Product.create(data)
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add product" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    if (!data._id) return NextResponse.json({ error: "Missing product id" }, { status: 400 })
    const updated = await Product.findByIdAndUpdate(data._id, data, { new: true, runValidators: true })
    if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase()
    const { _id } = await request.json()
    if (!_id) return NextResponse.json({ error: "Missing product id" }, { status: 400 })
    const deleted = await Product.findByIdAndDelete(_id)
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete product" }, { status: 500 })
  }
}
