import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Store OTPs temporarily (in production use Redis/DB)
const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email, { otp, expires });

    // Send email via Resend
    await resend.emails.send({
      from: "Forty Shoes <onboarding@resend.dev>",
      to: email,
      subject: "Your Forty Shoes Login Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="margin:0;padding:0;background-color:#FAFAF7;font-family:'Georgia',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF7;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;border:1px solid #e7e5e4;overflow:hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:#1c1917;padding:32px;text-align:center;">
                      <p style="margin:0;font-size:24px;font-weight:900;letter-spacing:6px;color:#fff;font-family:'Georgia',serif;">FORTY</p>
                      <p style="margin:4px 0 0;font-size:9px;letter-spacing:8px;color:#a8a29e;text-transform:uppercase;">SHOES</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px 32px;">
                      <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1c1917;font-family:'Georgia',serif;">Your Login Code</p>
                      <p style="margin:0 0 32px;font-size:14px;color:#78716c;line-height:1.6;">
                        Use this code to sign in to your Forty Shoes account. This code expires in <strong>10 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="background:#f5f5f4;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                        <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#a8a29e;font-family:sans-serif;">One-Time Password</p>
                        <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:12px;color:#1c1917;font-family:'Georgia',serif;">${otp}</p>
                      </div>

                      <p style="margin:0;font-size:13px;color:#a8a29e;line-height:1.6;">
                        If you didn't request this code, you can safely ignore this email. Your account is secure.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f5f5f4;padding:20px 32px;text-align:center;border-top:1px solid #e7e5e4;">
                      <p style="margin:0;font-size:11px;color:#a8a29e;font-family:sans-serif;">
                        © 2025 Forty Shoes · Lahore, Pakistan
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

// Verify OTP endpoint
export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const stored = otpStore.get(email);

    if (!stored) {
      return NextResponse.json({ error: "OTP not found. Please request a new one." }, { status: 400 });
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(email);
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (stored.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    otpStore.delete(email);
    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}