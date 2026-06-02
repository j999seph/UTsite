import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json(
      { ok: false, message: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Inquiry received. This endpoint is ready to swap to Formspree, Resend, or a custom API later.",
    payload,
  });
}
