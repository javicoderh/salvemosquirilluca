import { z } from "zod";
import {
  looksLikeRepeatedGarbage,
  looksMeaningless,
  normalizeEmail,
  normalizeName,
  normalizeText
} from "../security/normalization";

const normalizedString = (max: number) =>
  z
    .string()
    .transform((value) => normalizeText(value))
    .refine((value) => value.length <= max, "El valor excede el largo permitido.");

const promptInjectionPatterns = [
  /\b(?:ignora|olvida|omite|anula|desobedece|ignore|forget|disregard|override)\b.{0,80}\b(?:instrucciones|instruction|prompt|sistema|system|desarrollador|developer)\b/iu,
  /\b(?:system prompt|developer message|mensaje del sistema|modo desarrollador|jailbreak|do anything now)\b/iu,
  /<\s*(?:script|iframe|object|embed|style|link|meta)\b/iu,
  /\bjavascript\s*:/iu,
  /\$\{\s*jndi\s*:/iu
];

export function looksLikePromptInjection(value: string) {
  const normalized = normalizeText(value);
  return promptInjectionPatterns.some((pattern) => pattern.test(normalized));
}

export const volunteerSchema = z
  .object({
    fullName: normalizedString(120),
    email: normalizedString(120),
    phone: normalizedString(24),
    reason: normalizedString(800),
    consent: z.boolean()
  })
  .superRefine((value, context) => {
    const namePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]{4,}$/u;
    const normalizedPhone = value.phone.replace(/[^\d+]/g, "");
    const phoneDigits = normalizedPhone.replace(/\D/g, "");

    if (
      !namePattern.test(value.fullName) ||
      normalizeName(value.fullName).split(" ").filter(Boolean).length < 2 ||
      looksMeaningless(value.fullName)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fullName"],
        message: "Ingresa tu nombre completo."
      });
    }

    if (!z.string().email().safeParse(normalizeEmail(value.email)).success) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Ingresa un correo electrónico válido."
      });
    }

    if (
      !/^\+?[\d\s().-]+$/u.test(value.phone) ||
      phoneDigits.length < 8 ||
      phoneDigits.length > 15
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Ingresa un teléfono válido."
      });
    }

    if (
      value.reason.length < 20 ||
      looksMeaningless(value.reason) ||
      looksLikeRepeatedGarbage(value.reason)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reason"],
        message: "Cuéntanos tu motivación en al menos 20 caracteres."
      });
    }

    if (!value.consent) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["consent"],
        message: "Debes aceptar el tratamiento de tus datos."
      });
    }
  });

export type VolunteerInput = z.infer<typeof volunteerSchema>;

export interface NormalizedVolunteer {
  fullName: string;
  email: string;
  phone: string;
  reason: string;
  consent: boolean;
  normalized: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export function parseVolunteerPayload(raw: Record<string, unknown>): NormalizedVolunteer {
  const parsed = volunteerSchema.parse(raw);
  const phone = parsed.phone.replace(/[^\d+]/g, "");

  return {
    fullName: normalizeText(parsed.fullName),
    email: normalizeEmail(parsed.email),
    phone,
    reason: normalizeText(parsed.reason),
    consent: parsed.consent,
    normalized: {
      fullName: normalizeName(parsed.fullName),
      email: normalizeEmail(parsed.email),
      phone
    }
  };
}
