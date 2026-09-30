// app/api/contact/route.ts
// Server-side handler for the contact form. Sends submissions to KCATCH's
// inbox via SMTP (Nodemailer) — keeps credentials off the client.

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { NEED_OPTIONS } from "@/content/contact";

const RECIPIENT_EMAIL = "sampark.kcatch@gmail.com";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  needs?: string[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validate(data: ContactPayload) {
  const errors: Record<string, string> = {};
  if (!data.name?.trim()) errors.name = "Name is required";
  if (!data.email?.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email";
  if (!data.message?.trim()) errors.message = "Tell us about your project";
  return errors;
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", fieldErrors: errors }, { status: 400 });
  }

  const { name, email, company, message, needs = [] } = body;
  const needLabels = needs
    .map((id) => NEED_OPTIONS.find((n) => n.id === id)?.label ?? id)
    .join(", ") || "Not specified";

  if (!process.env.CONTACT_EMAIL_USER || !process.env.CONTACT_EMAIL_PASS) {
    console.error("Contact form: missing CONTACT_EMAIL_USER/CONTACT_EMAIL_PASS env vars");
    return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
  });

  const textBody = [
    `New KCATCH contact form submission`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company?.trim() || "Not specified"}`,
    `What are we KCATCHing?: ${message}`,
    `What do you need?: ${needLabels}`,
  ].join("\n");

  const htmlBody = `
    <h2>New KCATCH contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name!)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email!)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company?.trim() || "Not specified")}</p>
    <p><strong>What are we KCATCHing?:</strong> ${escapeHtml(message!)}</p>
    <p><strong>What do you need?:</strong> ${escapeHtml(needLabels)}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"KCATCH Website" <${process.env.CONTACT_EMAIL_USER}>`,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}${company ? ` (${company})` : ""}`,
      text: textBody,
      html: htmlBody,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form: failed to send email", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 502 });
  }
}
