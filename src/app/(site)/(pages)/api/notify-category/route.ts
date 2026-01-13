// app/api/notify-category/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Rate limiting cache (simple in-memory)
const rateLimitCache = new Map();

export async function POST(req: NextRequest) {
  // Rate limiting - 5 requests per email per hour
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5;

  const key = `rate-limit:${ip}`;
  const requests = rateLimitCache.get(key) || [];
  
  // Clean old requests
  const validRequests = requests.filter((timestamp: number) => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Add current request
  validRequests.push(now);
  rateLimitCache.set(key, validRequests);

  // Check API key
  if (!process.env.RESEND_API_KEY) {
    console.error("[API] RESEND_API_KEY is missing");
    return NextResponse.json(
      { error: "Server configuration error - contact support" },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await req.json();
    const { email, categoryName } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!categoryName || typeof categoryName !== 'string' || categoryName.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid category name" },
        { status: 400 }
      );
    }

    console.log(`[API] Sending notification to ${email} for category: ${categoryName}`);

    const fromEmail = process.env.NODE_ENV === 'production' 
      ? "PilotWardrobe <notifications@pilotwardrobe.com>"
      : "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `You're on the list for ${categoryName}!`,
      replyTo: "support@pilotwardrobe.com",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PilotWardrobe Notification Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                Hello,
              </p>
              
              <p style="font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 30px;">
                We've received your request to be notified about new arrivals in 
                <strong style="color: #1d4ed8;">${categoryName}</strong>.
              </p>
              
              <p style="font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 30px;">
                As soon as we add products to this category, you'll be the first to know via email.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <div style="background-color: #f0f9ff; border-left: 4px solid #1d4ed8; padding: 20px;">
                  <p style="font-size: 16px; color: #666; margin: 0;">
                    <strong>✈️ Stay tuned — exciting aviation gear is on the way!</strong>
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 14px; color: #64748b; margin: 0 0 10px 0;">
                PilotWardrobe • Your trusted source for pilot essentials
              </p>
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                © ${new Date().getFullYear()} PilotWardrobe. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Thank you! We've received your request to be notified about new arrivals in ${categoryName}. As soon as we add products to this category, you'll be the first to know via email. Stay tuned — exciting aviation gear is on the way! ✈️\n\nPilotWardrobe • Your trusted source for pilot essentials`,
    });

    if (error) {
      console.error("[Resend] Email error:", error);
      return NextResponse.json(
        { error: "Failed to send email notification" },
        { status: 500 }
      );
    }

    console.log("[Resend] Email sent successfully - ID:", data?.id);

    return NextResponse.json(
      { 
        success: true, 
        message: "You've been added to the notification list!",
        data: { email, categoryName }
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}