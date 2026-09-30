"use client";
// components/contact/contact-form.tsx
// Accessible KCATCH contact form.
// Uses shadcn/base-ui primitives as accessible foundation.
// No backend yet — form state architecture only.

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_FORM } from "@/content/contact";
import { NeedSelector } from "./need-selector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/motion/magnetic-button";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
  needs: string[];
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  needs: [],
};

function validateForm(data: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email";
  if (!data.message.trim()) errors.message = "Tell us about your project";
  return errors;
}

type InputFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
};

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="font-body text-xs uppercase tracking-widest text-kc-black/70"
      >
        {label}
        {required && <span className="text-kc-yellow ml-1" aria-hidden="true">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full bg-transparent border-0 border-b rounded-none px-0 font-body text-kc-black text-sm py-2.5 placeholder:text-kc-black/30 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-b-kc-black transition-colors",
          error
            ? "border-b-red-500 focus-visible:border-b-red-500"
            : "border-b-kc-black/20"
        )}
      />
      {error && (
        <p id={`${id}-error`} className="font-body text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleNeed = (id: string) => {
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(id)
        ? prev.needs.filter((n) => n !== id)
        : [...prev.needs, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const newErrors = validateForm(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to send message. Please try again."
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-16" role="status" aria-live="polite">
        <p className="font-display text-kc-black uppercase text-4xl">
          GOT IT. WE&apos;LL BE IN TOUCH.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className="flex flex-col gap-7"
    >
      <InputField
        id="contact-name"
        label={CONTACT_FORM.fields.name.label}
        placeholder={CONTACT_FORM.fields.name.placeholder}
        value={form.name}
        onChange={setField("name")}
        error={errors.name}
        required
      />
      <InputField
        id="contact-email"
        label={CONTACT_FORM.fields.email.label}
        type="email"
        placeholder={CONTACT_FORM.fields.email.placeholder}
        value={form.email}
        onChange={setField("email")}
        error={errors.email}
        required
      />
      <InputField
        id="contact-company"
        label={CONTACT_FORM.fields.company.label}
        placeholder={CONTACT_FORM.fields.company.placeholder}
        value={form.company}
        onChange={setField("company")}
      />

      {/* Message textarea */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="contact-message"
          className="font-body text-xs uppercase tracking-widest text-kc-black/70"
        >
          {CONTACT_FORM.fields.message.label}
          <span className="text-kc-yellow ml-1" aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="contact-message"
          rows={4}
          placeholder={CONTACT_FORM.fields.message.placeholder}
          value={form.message}
          onChange={(e) => setField("message")(e.target.value)}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            "w-full bg-transparent border-0 border-b rounded-none px-0 font-body text-kc-black text-sm py-2.5 placeholder:text-kc-black/30 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-b-kc-black transition-colors resize-none",
            errors.message
              ? "border-b-red-500 focus-visible:border-b-red-500"
              : "border-b-kc-black/20"
          )}
        />
        {errors.message && (
          <p id="message-error" className="font-body text-xs text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Need selector */}
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-kc-black/70 mb-2">
          {CONTACT_FORM.fields.need.label}
        </p>
        <NeedSelector selected={form.needs} onChange={toggleNeed} />
      </div>

      {/* Submit */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4">
        <MagneticButton>
          <Button
            type="submit"
            disabled={status === "submitting"}
            className="px-8 py-4 h-auto"
          >
            {status === "submitting" ? "SENDING..." : CONTACT_FORM.cta}
            {status !== "submitting" && (
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            )}
          </Button>
        </MagneticButton>
        <p className="font-hand text-kc-black/50 text-base">
          {CONTACT_FORM.orNote}
        </p>
      </div>
      {status === "error" && submitError && (
        <p className="font-body text-xs text-red-600" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
