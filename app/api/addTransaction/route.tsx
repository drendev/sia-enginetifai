  import type { NextApiRequest, NextApiResponse } from 'next';
  import { z } from 'zod';

  // Define a schema 
  const FormSchema = z.object({
    engineId: z.string().min(1, 'Engine ID is required'),
    deliveryDate: z.string().refine(date => !isNaN(Date.parse(date)), 'Invalid date format'),
    deliveryAddress: z.string().min(1, 'Delivery address is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
  });

  type FormSchemaType = z.infer<typeof FormSchema>;

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      try {
        
        const result = FormSchema.parse(req.body);

        
        
        console.log('New transaction:', result);

      
        res.status(200).json({ message: 'Transaction added successfully' });
      } catch (error) {
        if (error instanceof z.ZodError) {
        
          res.status(400).json({ errors: error.errors });
        } else {
          
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }
    } else {
      
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
