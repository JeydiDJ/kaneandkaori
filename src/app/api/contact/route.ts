import { NextResponse } from "next/server";

import { sendContactFormNotification } from "@/lib/email";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const payload = {
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim(),
      subject: String(body.subject ?? "").trim(),
      message: String(body.message ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      return NextResponse.json(
        { error: "Please complete all contact form fields." },
        { status: 400 },
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await sendContactFormNotification(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to submit contact form", error);

    const message = error instanceof Error ? error.message : "";

    if (message.includes("Missing RESEND_API_KEY")) {
      return NextResponse.json(
        { error: "Email sending is not configured yet. Add a Resend API key first." },
        { status: 500 },
      );
    }

    if (
      message.includes("You can only send testing emails to your own email address") ||
      message.includes("resend.dev")
    ) {
      return NextResponse.json(
        {
          error:
            "Resend is still using the testing sender. Verify your domain in Resend and set ORDER_FROM_EMAIL to that domain before using the contact form.",
        },
        { status: 400 },
      );
    }

    if (message.includes("domain is not verified")) {
      return NextResponse.json(
        {
          error:
            "Your sending domain is not verified in Resend yet. Verify the domain, then update ORDER_FROM_EMAIL to use it.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "We could not send your message right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
