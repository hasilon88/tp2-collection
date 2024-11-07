import { ProductService } from '../services/product.service';

test('Add product', async () => {
    const result = await ProductService.addProduct("Laptop", "High-end gaming laptop", 1500, 10);
    expect(result).toBe(true);
});

test('Add product with negative price', async () => {
    const result = await ProductService.addProduct("Faulty Product", "Invalid Price", -100, 5);
    expect(result).toBe(false);
});

test('Add product with negative quantity', async () => {
    const result = await ProductService.addProduct("Faulty Product", "Invalid Quantity", 100, -10);
    expect(result).toBe(false);
});

test('Get all products', async () => {
    const products = await ProductService.getAllProducts();
    expect(products.length).toBeGreaterThanOrEqual(0);
});

test('Filter products by price', async () => {
    const products = await ProductService.getAllProducts(500, 1000);
    expect(products.every(product => product.price >= 500 && product.price <= 1000)).toBe(true);
});

test('Filter products by quantity', async () => {
    const products = await ProductService.getAllProducts(undefined, undefined, 5, 15);
    expect(products.every(product => product.quantity >= 5 && product.quantity <= 15)).toBe(true);
});

test('Get product by ID', async () => {
    const product = await ProductService.getProduct(3);
    expect(product).not.toBeNull();
});

test('Product not found by ID', async () => {
    const product = await ProductService.getProduct(9999);
    expect(product).toBeNull();
});

test('Update product', async () => {
    const updatedProduct = await ProductService.updateProduct(1, "Updated Laptop", "Updated description", 1200, 8);
    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct?.name).toBe("Updated Laptop");
});

test('Update product not found', async () => {
    const updatedProduct = await ProductService.updateProduct(9999, "Non-existing Product", "Invalid", 500, 5);
    expect(updatedProduct).toBeNull();
});

test('Update product with invalid values', async () => {
    const updatedProduct = await ProductService.updateProduct(1, "Updated Laptop", "Invalid Price", -500, 8);
    expect(updatedProduct).toBeNull();
});

test('Delete product', async () => {
    const result = await ProductService.deleteProduct(2);
    expect(result).toBe(true);
});

test('Delete product not found', async () => {
    const result = await ProductService.deleteProduct(9999);
    expect(result).toBe(false);
});