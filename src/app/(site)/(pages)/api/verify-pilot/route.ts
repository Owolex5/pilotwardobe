// app/api/verify-pilot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with SERVICE ROLE KEY (server-side only!)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← must be set in Netlify env vars
);

export async function POST(req: NextRequest) {
  try {
    // 1. Parse multipart form data
    const formData = await req.formData();

    const licenseFile = formData.get("licenseFile") as File | null;
    const idFile = formData.get("idFile") as File | null;
    const facialPhotoBase64 = formData.get("facialPhoto") as string | null;
    const userId = formData.get("userId") as string | null;
    const userInfoRaw = formData.get("formData") as string | null;

    // Basic validation
    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    if (!licenseFile || !idFile || !facialPhotoBase64) {
      return NextResponse.json(
        { error: "Missing required files: license, ID, or facial photo" },
        { status: 400 }
      );
    }

    // 2. Optional: Add your custom auth check here
    // Example: verify JWT from cookie/header
    // const token = req.cookies.get("auth_token")?.value;
    // if (!token || !verifyToken(token, userId)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Parse form data (optional fields)
    let licenseInfo = {};
    if (userInfoRaw) {
      try {
        licenseInfo = JSON.parse(userInfoRaw);
      } catch (e) {
        console.warn("Failed to parse formData JSON:", e);
      }
    }

    // 3. Validate file types & sizes
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedDocTypes = [...allowedImageTypes, "application/pdf"];

    if (!allowedDocTypes.includes(licenseFile.type)) {
      return NextResponse.json({ error: "License must be JPG, PNG, or PDF" }, { status: 400 });
    }
    if (!allowedDocTypes.includes(idFile.type)) {
      return NextResponse.json({ error: "ID must be JPG, PNG, or PDF" }, { status: 400 });
    }

    if (licenseFile.size > 10 * 1024 * 1024 || idFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Files must be under 10MB" }, { status: 400 });
    }

    // 4. Upload files to Supabase Storage
    const timestamp = Date.now();

    // License
    const licenseBuffer = Buffer.from(await licenseFile.arrayBuffer());
    const licensePath = `verifications/${userId}/license_${timestamp}.${licenseFile.name.split(".").pop()}`;
    const { error: licenseError } = await supabase.storage
      .from("pilot-verifications")
      .upload(licensePath, licenseBuffer, {
        contentType: licenseFile.type,
        upsert: true,
      });

    if (licenseError) throw new Error(`License upload failed: ${licenseError.message}`);

    // ID
    const idBuffer = Buffer.from(await idFile.arrayBuffer());
    const idPath = `verifications/${userId}/id_${timestamp}.${idFile.name.split(".").pop()}`;
    const { error: idError } = await supabase.storage
      .from("pilot-verifications")
      .upload(idPath, idBuffer, {
        contentType: idFile.type,
        upsert: true,
      });

    if (idError) throw new Error(`ID upload failed: ${idError.message}`);

    // Facial photo (base64 → buffer)
    const facialBuffer = Buffer.from(facialPhotoBase64.split(",")[1], "base64");
    const facialPath = `verifications/${userId}/facial_${timestamp}.png`;
    const { error: facialError } = await supabase.storage
      .from("pilot-verifications")
      .upload(facialPath, facialBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (facialError) throw new Error(`Facial photo upload failed: ${facialError.message}`);

    // 5. Get public URLs
    const { data: licenseUrlData } = supabase.storage.from("pilot-verifications").getPublicUrl(licensePath);
    const { data: idUrlData } = supabase.storage.from("pilot-verifications").getPublicUrl(idPath);
    const { data: facialUrlData } = supabase.storage.from("pilot-verifications").getPublicUrl(facialPath);

    // 6. Save to database
    const { error: dbError } = await supabase
      .from("pilot_verifications")
      .insert({
        user_id: userId,
        license_url: licenseUrlData.publicUrl,
        id_url: idUrlData.publicUrl,
        facial_url: facialUrlData.publicUrl,
        license_info: licenseInfo,
        status: "pending",
        submitted_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("DB insert error:", dbError.message);
      throw new Error("Failed to save verification record");
    }

    return NextResponse.json({
      success: true,
      message: "Verification submitted successfully! Our team will review within 48 hours.",
      urls: {
        license: licenseUrlData.publicUrl,
        id: idUrlData.publicUrl,
        facial: facialUrlData.publicUrl,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error("[VERIFY-PILOT] Error:", error.message || error);
    return NextResponse.json({
      error: "Failed to process verification",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    }, { status: 500 });
  }
}