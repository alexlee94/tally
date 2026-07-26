import axios from 'axios';
import { Product, CreateProductDTO, UpdateProductDTO } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:5154',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/api/Products');
    return response.data;
};

export const getLowStockProducts = async (): Promise<Product[]> => {
    const response = await api.get('/api/Products/low-stock');
    return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await api.get(`/api/Products/${id}`);
    return response.data;
};

export const createProduct = async (dto: CreateProductDTO): Promise<Product> => {
    const response = await api.post('/api/Products', dto, {
        headers: { 'X-Changed-By': 'admin' }
    });
    return response.data;
};

export const updateProduct = async (id: number, dto: UpdateProductDTO): Promise<Product> => {
    const response = await api.put(`/api/Products/${id}`, dto, {
        headers: { 'X-Changed-By': 'admin' }
    });
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/api/Products/${id}`, {
        headers: { 'X-Changed-By': 'admin' }
    });
};

export default api;