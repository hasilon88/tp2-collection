import { config } from '../config/config';
import JsonModifier from '../utils/json_modifier.utils';
import { Product } from '../models/product.model';
import { logger } from '../utils/logger.utils';

export class ProductService {
    private static products: Product[] = [];
    private static idCount: number = 0;
    private static jsonModifier = new JsonModifier();

    private static async loadProducts(): Promise<void> {
        try {
            logger.info("Loading products from file...");
            
            const storedProducts: Product[] = await this.jsonModifier.readJsonToData(config.PRODUCTS_DATA);

            if (storedProducts && storedProducts.length > 0) {
                this.products = storedProducts;
                this.idCount = this.products[this.products.length - 1].id + 1;
                logger.info(`Loaded ${this.products.length} products. Next ID: ${this.idCount}`);
            } else {
                this.products = [];
                this.idCount = 1;
                logger.warn("No products found. Starting with an empty product list.");
            }
        } catch (e) {
            logger.error(`Error loading products: ${e}`);
            throw new Error('Failed to load products');
        }
    }

    public static async getAllProducts(minPrice?: number, maxPrice?: number, minStock?: number, maxStock?: number): Promise<Product[]> {
        await this.loadProducts();
        logger.info("Fetching all products with specified filters...");
        return this.products.filter(product => {
            const priceCondition = (
                (minPrice === undefined || product.price >= minPrice) &&
                (maxPrice === undefined || product.price <= maxPrice)
            );

            const stockCondition = (
                (minStock === undefined || product.quantity >= minStock) &&
                (maxStock === undefined || product.quantity <= maxStock)
            );

            return priceCondition && stockCondition;
        });
    }

    public static async getProduct(id: number): Promise<Product | null> {
        await this.loadProducts();
        const product = this.products.find((product: Product) => product.id === id) || null;
        if (product) {
            logger.info(`Product found with ID: ${id}`);
        } else {
            logger.warn(`Product not found with ID: ${id}`);
        }
        return product;
    }

    public static async addProduct(name: string, description: string, price: number, quantity: number): Promise<boolean> {
        await this.loadProducts();

        const id = this.idCount++;
        const newProduct = new Product(id, name, price, description, quantity);
        this.products.push(newProduct);

        try {
            await this.jsonModifier.writeDataToJsonFile(this.products, config.PRODUCTS_DATA);
            logger.info(`Added new product with ID: ${id}`);
        } catch (e) {
            logger.error(`Error adding product: ${e}`);
            return false;
        }

        return this.products.some((product) => product.id === id);
    }

    public static async deleteProduct(id: number): Promise<boolean> {
        await this.loadProducts();

        const initialLength = this.products.length;
        this.products = this.products.filter((product: Product) => product.id !== id);

        if (this.products.length === initialLength) {
            logger.warn(`No product found to delete with ID: ${id}`);
            return false;
        }

        try {
            await this.jsonModifier.writeDataToJsonFile(this.products, config.PRODUCTS_DATA);
            logger.info(`Deleted product with ID: ${id}`);
            return true;
        } catch (e) {
            logger.error(`Error deleting product: ${e}`);
            return false;
        }
    }

    public static async updateProduct(id: number, newName: string, newDesc: string, newPrice: number, newQty: number): Promise<Product | null> {
        await this.loadProducts();

        const index = this.products.findIndex((product: Product) => product.id === id);

        if (index === -1) {
            logger.warn(`Product not found for update with ID: ${id}`);
            return null;
        }

        const updatedProductData = {
            name: newName,
            description: newDesc,
            price: newPrice,
            quantity: newQty,
        };

        this.products[index] = { ...this.products[index], ...updatedProductData };
        try {
            await this.jsonModifier.writeDataToJsonFile(this.products, config.PRODUCTS_DATA);
            logger.info(`Updated product with ID: ${id}`);
            return this.products[index];
        } catch (e) {
            logger.error(`Error updating product with ID: ${id}, error: ${e}`);
            return null;
        }
    }
}
