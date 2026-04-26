import { z } from "zod";

export const bookingSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data non valido")
      .refine((val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      }, "La data non può essere nel passato"),

    slot: z.string().regex(/^\d{2}:\d{2}$/, "Formato orario non valido"),

    type: z.enum(["meet", "phone"], {
      errorMap: () => ({ message: "Tipo chiamata non valido" }),
    }),

    name: z
      .string()
      .min(2, "Il nome deve avere almeno 2 caratteri")
      .max(100, "Il nome è troppo lungo")
      .trim(),

    email: z
      .string()
      .email("Email non valida")
      .max(200, "Email troppo lunga")
      .trim(),

    phone: z
      .string()
      .max(20, "Numero troppo lungo")
      .trim()
      .optional()
      .nullable(),

    privacyAccepted: z
      .boolean()
      .refine(
        (val) => val === true,
        "Devi accettare la Privacy Policy per procedere",
      ),
  })
  .refine(
    (data) => {
      if (data.type === "phone" && !data.phone) return false;
      return true;
    },
    {
      message:
        "Il numero di telefono è obbligatorio per le chiamate telefoniche",
      path: ["phone"],
    },
  );

export const cancelSchema = z.object({
  bookingId: z.string().uuid("ID prenotazione non valido"),

  cancelToken: z.string().uuid("Token non valido"),
});
