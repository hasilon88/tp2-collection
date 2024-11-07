import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const protectedRouter = Router();

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product.
 *     description: Adds a new product to the system with the provided name, description, price, and quantity. Validates the input before creation.
 *     tags: 
 *       - Products
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the product. Must be alphabetic and between 3 and 50 characters long.
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         required: false
 *         description: A brief description of the product.
 *       - in: query
 *         name: price
 *         schema:
 *           type: string
 *         required: true
 *         description: The price of the product. Must be a positive number.
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: string
 *         required: true
 *         description: The quantity of the product. Must be a positive integer.
 *     responses:
 *       201:
 *         description: Product successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Création réussie
 *       400:
 *         description: Validation errors in the provided data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreurs de validation des données
 */
protectedRouter.post('/products', ProductController.postProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Modify the details of an existing product by its ID. Only the fields that are provided in the request will be updated.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         required: false
 *         description: The new name of the product (3-50 characters)
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         required: false
 *         description: The new description of the product
 *         schema:
 *           type: string
 *       - in: query
 *         name: price
 *         required: false
 *         description: The new price of the product (must be a positive number)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: quantity
 *         required: false
 *         description: The new quantity of the product (must be a positive number)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 quantity:
 *                   type: integer
 *       400:
 *         description: Validation errors for the provided data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreurs de validation des données"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Le produit n’existe pas"
 */
protectedRouter.put('/products/:id', ProductController.putProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by its ID. Returns a success message if the product is deleted successfully, or an error message if the product does not exist.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product successfully deleted.
 *       400:
 *         description: Validation errors in the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreurs de validation du ID"
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit n'existe pas"
 */
protectedRouter.delete('/products/:id', ProductController.deleteProduct);

export default protectedRouter;