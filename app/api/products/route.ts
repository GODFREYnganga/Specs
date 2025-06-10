import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
const Product = require("../../../models/Product");
console.log("Product model loaded:", Product);
import fs from "fs/promises";
import path from "path";

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
    console.log("Received POST request to add a product.");

    // Log all request headers
    console.log("Request Headers on Server:", Object.fromEntries(request.headers.entries()));

    await connectToDatabase();
    const formData = await request.formData();

    // Handle image upload
    let file = formData.get("image");
    let filename = "";
    if (file && typeof file !== "string") {
      // If file is a File object
      const buffer = Buffer.from(await file.arrayBuffer());
      filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public", "images", "products");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      console.log(`Image uploaded successfully: ${filePath}`);
      // Store the relative path in the database
      filename = `/images/products/${filename}`;
    } else if (typeof file === "string" && file.length > 0) {
      // If image is a string (URL or path)
      filename = file;
    }
    // If no image provided, but additionalImages[] exists, use the first additional image
    if (!filename && formData.has("additionalImages[]")) {
      const additionalImage = formData.getAll("additionalImages[]")[0];
      if (additionalImage && typeof additionalImage !== "string") {
        const buffer = Buffer.from(await additionalImage.arrayBuffer());
        const addFilename = `${Date.now()}-${additionalImage.name.replace(/[^a-zA-Z0-9.]/g, "-")}`;
        const uploadDir = path.join(process.cwd(), "public", "images", "products");
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, addFilename);
        await fs.writeFile(filePath, buffer);
        filename = `/images/products/${addFilename}`;
      } else if (typeof additionalImage === "string" && additionalImage.length > 0) {
        filename = additionalImage;
      }
    }
    // If still no image, return error
    if (!filename) {
      return NextResponse.json({ error: "Please provide product image" }, { status: 400 });
    }

    // Prepare product data
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key === "features" || key === "colors") {
        data[key] = (value as string).split(",").map((item) => item.trim());
      } else if (key === "price") {
        data[key] = Number(value);
      } else if (key === "weight") {
        // Only allow valid enum values for weight
        const allowedWeights = ["light", "medium", "heavy", ""];
        data[key] = allowedWeights.includes(value as string) ? value : "";
      } else {
        data[key] = value;
      }
    });
    data.image = filename; // Store relative path or string

    console.log("Product data prepared:", data); // Log prepared data

    // Create product
    const product = await Product.create(data);
    console.log("Product added successfully:", product); // Log success
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Failed to add product:", err); // Log error
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    if (!data._id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    const updated = await Product.findByIdAndUpdate(data._id, data, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { _id } = await request.json();
    if (!_id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    const deleted = await Product.findByIdAndDelete(_id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete product" }, { status: 500 });
  }
}
