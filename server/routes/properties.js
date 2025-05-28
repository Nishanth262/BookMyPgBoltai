import express from 'express';
import { 
  getAllProperties, 
  getPropertyById, 
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties
} from '../controllers/properties.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { validateProperty } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.post('/', authenticateToken, authorizeRole(['owner', 'admin']), validateProperty, createProperty);
router.put('/:id', authenticateToken, authorizeRole(['owner', 'admin']), validateProperty, updateProperty);
router.delete('/:id', authenticateToken, authorizeRole(['owner', 'admin']), deleteProperty);

export default router;