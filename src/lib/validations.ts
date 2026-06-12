import { z } from 'zod'

export const biodataFormSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  height: z.string().optional(),
  bloodGroup: z.string().optional(),
  complexion: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  income: z.string().optional(),
  
  // Family Details
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  brothers: z.string().optional(),
  sisters: z.string().optional(),
  
  // Contact
  mobile: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email("Valid email is required").optional(),
  address: z.string().optional(),
  
  // Extra fields that could be dynamic based on template
  extraFields: z.record(z.string(), z.string()).optional()
})

export type BiodataFormValues = z.infer<typeof biodataFormSchema>

export const createOrderSchema = z.object({
  templateId: z.string().cuid("Invalid template ID"),
  draftToken: z.string().min(1, "Draft token is required"),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
})

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})
