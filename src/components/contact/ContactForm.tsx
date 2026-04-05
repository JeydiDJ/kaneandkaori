"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (!serviceId || !templateId || !publicKey) {
      setMessage("EmailJS is not configured yet. Add the public key, service ID, and template ID.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name: payload.name,
            email: payload.email,
            subject: payload.subject,
            message: payload.message,
            time: new Date().toLocaleString(),
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "The message could not be sent.");
      }

      form.reset();
      setSuccess(true);
      setMessage("Your message has been sent. We'll get back to you soon.");
    } catch (submitError) {
      setMessage(
        submitError instanceof Error
          ? submitError.message
          : "The message could not be sent.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="grid gap-4 rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Name" name="name" autoComplete="name" required />
        <Input label="Email" name="email" type="email" autoComplete="email" required />
      </div>
      <Input label="Subject" name="subject" placeholder="How can we help?" required />
      <Textarea
        label="Message"
        name="message"
        className="min-h-48"
        placeholder="Tell us about your order question, fragrance inquiry, or partnership request."
        required
      />
      <p className="text-xs text-[var(--muted)]">
        This form sends through EmailJS. Make sure your template variables include `name`, `email`, `subject`, `message`, and `time`.
      </p>
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send message"}
      </Button>
      {message ? (
        <p className={`text-sm ${success ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
