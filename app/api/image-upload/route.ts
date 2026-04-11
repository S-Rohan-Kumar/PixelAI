import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadStream } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET,
});

interface CoudinaryUploadResult {
  public_id: string;
  bytes: Number;
  duration?: Number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unothorized" }, { status: 401 });
  }

  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_KEY ||
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Clouodinary configging missing" },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CoudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "saas-pixelAI" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as CoudinaryUploadResult);
          },
        );
        uploadStream.end(buffer);
      },
    );

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
