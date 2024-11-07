import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     deprecated: false
 *     summary: Retrieves a list of products.
 *     description: Retrieve a list of products from the API. Can be used to populate a list of products in your system.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                  id:
 *                     type: integer
 *                     example: 1
 *                  name:
 *                     type: string
 *                     example: Software
 *                  price:
 *                     type: float
 *                     example : 12.38$
 *                  description: 
 *                     type: string
 *                     example : "Software sold for 12.38$"
 */
router.get('/products', ProductController.getProducts);

export default router;