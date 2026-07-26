import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import {
    Container, Typography, Box, Button, TextField,
    Card, CardContent, Alert, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Chip, Grid, IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { Product, CreateProductDTO, UpdateProductDTO } from '../types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api';

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sku: '',
        quantity: '',
        lowStockThreshold: '10',
        price: '',
        category: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setFormData({ name: '', description: '', sku: '', quantity: '', lowStockThreshold: '10', price: '', category: '' });
        setOpenDialog(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            sku: product.sku || '',
            quantity: product.quantity.toString(),
            lowStockThreshold: product.lowStockThreshold.toString(),
            price: product.price.toString(),
            category: product.category || ''
        });
        setOpenDialog(true);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (editingProduct) {
                const dto: UpdateProductDTO = {
                    name: formData.name,
                    description: formData.description,
                    sku: formData.sku,
                    quantity: parseInt(formData.quantity),
                    lowStockThreshold: parseInt(formData.lowStockThreshold),
                    price: parseFloat(formData.price),
                    category: formData.category,
                    rowVersion: editingProduct.rowVersion
                };
                await updateProduct(editingProduct.id, dto);
                setSuccess('Product updated successfully');
            } else {
                const dto: CreateProductDTO = {
                    name: formData.name,
                    description: formData.description,
                    sku: formData.sku,
                    quantity: parseInt(formData.quantity),
                    lowStockThreshold: parseInt(formData.lowStockThreshold),
                    price: parseFloat(formData.price),
                    category: formData.category
                };
                await createProduct(dto);
                setSuccess('Product created successfully');
            }
            setOpenDialog(false);
            fetchProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            setSuccess('Product deleted successfully');
            fetchProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete product');
        }
    };

    const lowStockCount = products.filter(p => p.isLowStock).length;

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Tally
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
                    Add Product
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {lowStockCount > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
                    {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} running low on stock
                </Alert>
            )}

            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                        <Card sx={{ height: '100%', border: product.isLowStock ? '1px solid #ff9800' : 'none' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {product.name}
                                    </Typography>
                                    <Box>
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => handleOpenEdit(product)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                                {product.sku && (
                                    <Typography variant="body2" color="text.secondary">SKU: {product.sku}</Typography>
                                )}
                                {product.category && (
                                    <Chip label={product.category} size="small" sx={{ mt: 1, mb: 1 }} />
                                )}
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                    ${product.price.toFixed(2)}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={product.isLowStock ? 'warning.main' : 'success.main'}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {product.isLowStock ? '⚠ ' : '✓ '}
                                    {product.quantity} in stock
                                    {product.isLowStock && ` (low stock threshold: ${product.lowStockThreshold})`}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
                        <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" multiline rows={2} />
                        <TextField fullWidth label="SKU" name="sku" value={formData.sku} onChange={handleChange} margin="normal" />
                        <TextField fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} margin="normal" />
                        <TextField fullWidth label="Price" name="price" type="number" value={formData.price} onChange={handleChange} margin="normal" required />
                        <TextField fullWidth label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} margin="normal" required />
                        <TextField fullWidth label="Low Stock Threshold" name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleChange} margin="normal" required />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editingProduct ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductsPage;