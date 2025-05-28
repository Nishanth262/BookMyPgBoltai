import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(50),
  role: z.enum(['user', 'owner', 'admin']).optional()
});

const propertySchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  price: z.number().positive(),
  deposit: z.number().positive(),
  amenities: z.array(z.string()),
  images: z.array(z.string().url()),
  type: z.enum(['single', 'double', 'triple', 'shared']),
  capacity: z.number().positive(),
  available: z.boolean()
});

const bookingSchema = z.object({
  propertyId: z.string(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str))
});

export const validateRegistration = (req, res, next) => {
  try {
    userSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};

export const validateLogin = (req, res, next) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
  });

  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};

export const validateProperty = (req, res, next) => {
  try {
    propertySchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};

export const validateBooking = (req, res, next) => {
  try {
    bookingSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
};