import express from 'express'
const router = express.Router()
import {
  getProperties,
  getPropertyById,
  deleteProperty,
  createProperty,
  updateProperty,
  createPropertyReview,
  getTopProperties,
} from '../controllers/propertyController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getProperties).post(protect, admin, createProperty)
router.route('/:id/reviews').post(protect, createPropertyReview)
router.get('/top', getTopProperties)
router
  .route('/:id')
  .get(getPropertyById)
  .delete(protect, admin, deleteProperty)
  .put(protect, admin, updateProperty)

export default router
