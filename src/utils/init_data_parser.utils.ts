import axios from 'axios';
import { config } from '../config/config';
import { Product } from '../models/product.model';

export default async function getProducts(): Promise<Product[]> {
    const { data } = await axios.get(config.PRODUCTS_API);
    
    const modifiedProductData = data.map((product: any) => ({
        id: product.id,
        name: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: Math.floor(Math.random() * (99 - 11 + 1)) + 11
    }));

    return modifiedProductData;
}
