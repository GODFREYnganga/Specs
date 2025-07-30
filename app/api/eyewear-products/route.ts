import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import fs from "fs/promises";
import path from "path";
import EyewearProduct from "@/models/EyewearProduct";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const featured = searchParams.get("featured");
    const gender = searchParams.get("gender");
    const frameType = searchParams.get("frameType");
    const brand = searchParams.get("brand");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const sort = searchParams.get("sort") || "createdAt";

    const query: any = {};
    
    // Text search
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } }
      ];
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Gender filter
    if (gender) {
      query.gender = gender;
    }
    
    // Frame type filter
    if (frameType) {
      query.frameType = frameType;
    }
    
    // Brand filter
    if (brand) {
      query.brand = brand;
    }
    
    // Price range filter
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseInt(priceMin);
      if (priceMax) query.price.$lte = parseInt(priceMax);
    }
    
    // Featured filter
    if (featured === "true") {
      query.featured = true;
    }

    let productsQuery = EyewearProduct.find(query);
    
    // Sorting
    const sortOptions: any = {
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "name": { name: 1 },
      "newest": { createdAt: -1 },
      "oldest": { createdAt: 1 },
      "rating": { rating: -1 }
    };
    
    if (sortOptions[sort]) {
      productsQuery = productsQuery.sort(sortOptions[sort]);
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }
    
    // Limit results
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    const products = await productsQuery;
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching eyewear products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log("Received POST request to add an eyewear product.");

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
      const uploadDir = path.join(process.cwd(), "public", "images", "eyewear-products");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      const relPath = `/images/eyewear-products/${filename}`;
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

    console.log("Eyewear product data prepared:", data);

    // Create product in eyewear-products collection
    const product = await EyewearProduct.create(data);
    console.log("Eyewear product added successfully:", product);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Failed to add eyewear product:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    if (!data._id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    const updated = await EyewearProduct.findByIdAndUpdate(data._id, data, { new: true, runValidators: true });
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
    const deleted = await EyewearProduct.findByIdAndDelete(_id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete product" }, { status: 500 });
  }
}
