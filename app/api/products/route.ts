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

    // Collect all image files (main and additional)
    const imageFiles = [];
    const mainImage = formData.get("image");
    if (mainImage && typeof mainImage !== "string") {
      imageFiles.push(mainImage);
    }
    if (formData.has("additionalImages[]")) {
      const additionalImages = formData.getAll("additionalImages[]");
      for (const img of additionalImages) {
        if (img && typeof img !== "string") {
          imageFiles.push(img);
        }
      }
    }
    // Require at least one image file
    if (imageFiles.length === 0) {
      return NextResponse.json({ error: "Please upload at least one product image." }, { status: 400 });
    }
    // Save all images and collect their paths
    const imagesArray = [];
    for (const imgFile of imageFiles) {
      const buffer = Buffer.from(await imgFile.arrayBuffer());
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${imgFile.name.split('.').pop()}`;
      const uploadDir = path.join(process.cwd(), "public", "images", "products");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      const relPath = `/images/products/${filename}`;
      imagesArray.push(relPath);
    }
    // Prepare product data
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key === "features" || key === "colors") {
        data[key] = (value as string).split(",").map((item) => item.trim());
      } else if (key === "price" || key === "stock") {
        data[key] = Number(value);
      } else if (key === "weight") {
        const allowedWeights = ["light", "medium", "heavy", ""];
        data[key] = allowedWeights.includes(value as string) ? value : "";
      } else if (key === "sku") {
        data[key] = String(value);
      } else if (key !== "image" && key !== "additionalImages[]") {
        data[key] = value;
      }
    });
    data.image = imagesArray[0]; // Use the first uploaded image as the main image
    data.images = imagesArray; // Store all image paths

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
