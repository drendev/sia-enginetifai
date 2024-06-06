import * as z from 'zod';

export const TransactionSchema = z.object({
  engineId: z.string().min(1, 'Engine ID is required'),
  deliveryDate: z.date().refine(date => date >= new Date(), 'Delivery date must be in the future'),
  deliveryAddress: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  isDelivery: z.boolean(),
});

export const DeliverySchema = z.object({
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
});
