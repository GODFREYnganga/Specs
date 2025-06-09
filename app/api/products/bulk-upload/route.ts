import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import csvParse from "csv-parse/lib/sync";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  // Parse multipart form (CSV + zip)
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public", "tmp");
  form.keepExtensions = true;
  await fs.promises.mkdir(form.uploadDir, { recursive: true });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) return resolve(NextResponse.json({ error: "Form parse error" }, { status: 400 }));
      try {
        const csvFile = files.csvFile;
        const imagesZip = files.imagesZip;
        if (!csvFile || !imagesZip) {
          return resolve(NextResponse.json({ error: "CSV and images zip required" }, { status: 400 }));
        }
        // Unzip images
        const imagesDir = path.join(process.cwd(), "public", "images", "bulk-upload");
        await fs.promises.mkdir(imagesDir, { recursive: true });
        await fs.createReadStream(imagesZip.filepath).pipe(unzipper.Extract({ path: imagesDir })).promise();
        // Parse CSV
        const csvContent = fs.readFileSync(csvFile.filepath, "utf8");
        const records = csvParse(csvContent, { columns: true, skip_empty_lines: true });
        // Insert products
        await connectToDB();
        let created = 0;
        for (const row of records) {
          // Main image
          const mainImage = row.image ? `/images/bulk-upload/${row.image}` : "";
          // Additional images (semicolon or comma separated)
          let images = [];
          if (row.images) {
            images = row.images.split(/[;,]/).map(f => f.trim()).filter(Boolean).map(f => `/images/bulk-upload/${f}`);
          }
          // Features (comma separated)
          let features = [];
          if (row.features) {
            features = row.features.split(",").map(f => f.trim()).filter(Boolean);
          }
          // Numeric fields
          const price = parseFloat(row.price);
          const inStock = parseInt(row.inStock);
          // Create product
          await Product.create({
            name: row.name,
            price,
            category: row.category,
            image: mainImage,
            description: row.description,
            inStock,
            frameShape: row.frameShape,
            frameType: row.frameType,
            gender: row.gender,
            material: row.material,
            weight: row.weight,
            prescriptionType: row.prescriptionType,
            frameWidth: row.frameWidth,
            productType: row.productType,
            color: row.color,
            brand: row.brand,
            size: row.size,
            features,
            images,
          });
          created++;
        }
        resolve(NextResponse.json({ success: true, created }));
      } catch (e) {
        resolve(NextResponse.json({ error: e.message }, { status: 500 }));
      }
    });
  });
}
