import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
    static async getProducts(req: Request, res: Response) {
        const { minPrice, maxPrice, minStock, maxStock } = req.query;
        if (
            (minPrice !== undefined && isNaN(Number(minPrice))) ||
            (maxPrice !== undefined && isNaN(Number(maxPrice))) ||
            (minStock !== undefined && isNaN(Number(minStock))) ||
            (maxStock !== undefined && isNaN(Number(maxStock)))
        ) {
            return res.status(400).json({ message: 'Requête invalide' });
        }

        const filteredProducts = await ProductService.getAllProducts(
            minPrice ? Number(minPrice) : undefined,
            maxPrice ? Number(maxPrice) : undefined,
            minStock ? Number(minStock) : undefined,
            maxStock ? Number(maxStock) : undefined
        );

        res.status(200).json(filteredProducts);
    }

    static async postProduct(req: Request, res: Response) {
        const { name, description, price, quantity } = req.query;
        const nameRegex = /^[a-zA-Z\s]{3,50}$/;
        const checkPositiveRegex = /^\d+$/;

        if (
            !nameRegex.test(name as string) || 
            !checkPositiveRegex.test(price as string) || 
            !checkPositiveRegex.test(quantity as string)
        ) {
            return res.status(400).json({ message: 'Erreurs de validation des données' });
        }
            
        return res.status(201).json(
            await ProductService.addProduct(name as string, description as string, parseFloat(price as string), parseInt(quantity as string, 10)) ?
                { message: "Création réussie" } 
            :   
                { message: "Création non-réussie" }
        );
    }
    
    static async putProduct(req: Request, res: Response) {
        const productId = req.params['id'];
        const { name, description, price, quantity } = req.query;
        const nameRegex = /^[a-zA-Z\s]{3,50}$/;
        const checkPositiveRegex = /^\d+$/;

        if (
            (productId && !checkPositiveRegex.test(productId as string)) ||
            (name && !nameRegex.test(name as string)) || 
            (price && !checkPositiveRegex.test(price as string)) || 
            (quantity && !checkPositiveRegex.test(quantity as string))
        ) {
            return res.status(400).json({ message: 'Erreurs de validation des données' });
        }
    
        const product = await ProductService.getProduct(Number(productId));
        
        if (product == null) {
            return res.status(404).json({ message: "Le produit n’existe pas" });
        }
    
        const newName = name && name !== "" ? name as string : product.name;
        const newDesc = description && description !== "" ? description as string : product.description;
        const newPrice = price && price !== "" ? Number(price) : product.price;
        const newQty = quantity && quantity !== "" ? Number(quantity) : product.quantity;
        
        const result = await ProductService.updateProduct(Number(productId), newName, newDesc, newPrice, newQty);
    
        return res.status(200).json(result);
    }

    static async deleteProduct(req: Request, res: Response) {
        const productId = req.params['id'];
        const checkPositiveRegex = /^\d+$/;

        if (!productId || isNaN(Number(productId)) || !checkPositiveRegex.test(productId)) {
            return res.status(400).json({ message: 'Erreurs de validation du ID' });
        }
    
        const result = await ProductService.deleteProduct(Number(productId));
    
        return result
            ? res.status(204).json({ message: "Produit supprimé avec succès" })
            : res.status(404).json({ message: "Produit n'existe pas" });
    }    
}
