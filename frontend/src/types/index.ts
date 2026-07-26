export interface Product {
    id: number;
    name: string;
    description?: string;
    sku?: string;
    quantity: number;
    lowStockThreshold: number;
    isLowStock: boolean;
    price: number;
    category?: string;
    createdAt: string;
    updatedAt: string;
    rowVersion: string;
}

export interface CreateProductDTO {
    name: string;
    description?: string;
    sku?: string;
    quantity: number;
    lowStockThreshold: number;
    price: number;
    category?: string;
}

export interface UpdateProductDTO {
    name: string;
    description?: string;
    sku?: string;
    quantity: number;
    lowStockThreshold: number;
    price: number;
    category?: string;
    rowVersion: string;
}

export interface AuditLog {
    id: number;
    entityName: string;
    entityId: number;
    action: string;
    oldValue?: string;
    newValue?: string;
    changedBy: string;
    changedAt: string;
}