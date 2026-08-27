'use client';

import React, { useState, useEffect } from 'react';
import { productService, Product } from '@/services/productService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/context/ToastContext';
import { formatINR } from '@/lib/utils';
import { Plus, Edit2, Trash2, Search, SlidersHorizontal, Package, AlertTriangle, Power } from 'lucide-react';

export default function AdminProductsPage() {
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Weights',
    description: '',
    price: 0,
    discountPrice: 0,
    brand: 'IronForge Gear',
    stock: 10,
    sku: '',
    images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'],
    features: '',
    specifications: '',
    isActive: true,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size should be less than 10MB');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result as string;
        const apiBaseUrl =
          process.env.NEXT_API_URL ||
          "https://gym-management-backend-phi.vercel.app";
        const response = await fetch(`${apiBaseUrl}/api/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Data }),
        });

        const resData = await response.json();
        if (resData.success && resData.url) {
          setFormData((prev) => ({
            ...prev,
            images: [resData.url],
          }));
          success('Uploaded', 'Product image uploaded successfully.');
        } else {
          setUploadError(resData.message || 'Image upload failed.');
        }
      } catch (err) {
        console.error('Upload error:', err);
        setUploadError('Network error during image upload.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch admin inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ['All', 'Weights', 'Accessories', 'Supplements', 'Apparel'];

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Weights',
      description: '',
      price: 0,
      discountPrice: 0,
      brand: 'IronForge Gear',
      stock: 10,
      sku: '',
      images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'],
      features: '',
      specifications: '',
      isActive: true,
    });
    setIsUploading(false);
    setUploadError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      description: p.description || '',
      price: p.price,
      discountPrice: p.discountPrice || 0,
      brand: p.brand || 'IronForge Gear',
      stock: p.stock,
      sku: p.sku || '',
      images: p.images || [''],
      features: p.features?.join(', ') || '',
      specifications: p.specifications ? Object.entries(p.specifications).map(([k, v]) => `${k}:${v}`).join(', ') : '',
      isActive: p.isActive,
    });
    setIsUploading(false);
    setUploadError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse features and specs
    const featuresArray = formData.features.split(',').map((f) => f.trim()).filter(Boolean);
    const specificationsObj: Record<string, string> = {};
    formData.specifications.split(',').forEach((chunk) => {
      const parts = chunk.split(':');
      if (parts.length === 2) {
        specificationsObj[parts[0].trim()] = parts[1].trim();
      }
    });

    const payload = {
      ...formData,
      features: featuresArray,
      specifications: specificationsObj,
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
        success('Success', 'Product specifications updated.');
      } else {
        await productService.createProduct(payload);
        success('Success', 'Product added to active inventory catalog.');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      error('Error', 'Unable to persist product catalog changes.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        success('Deleted', 'Product removed from catalog.');
        fetchProducts();
      } catch (err) {
        error('Error', 'Failed to remove product from catalog.');
      }
    }
  };

  const handleToggleActive = async (p: Product) => {
    try {
      await productService.updateProduct(p._id, { isActive: !p.isActive });
      success('Status Changed', `Product set to ${!p.isActive ? 'Active' : 'Inactive'}.`);
      fetchProducts();
    } catch (err) {
      error('Error', 'Unable to toggle product state.');
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Inventory analytics
  const totalItemsCount = products.length;
  const totalStockSum = products.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const inventoryValue = products.reduce((acc, curr) => acc + (curr.discountPrice || curr.price) * curr.stock, 0);

  if (isLoading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen bg-forge-950">
        <LoadingSpinner label="Auditing store catalog database..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Inventory &amp; Gym Store Products
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Configure catalogs, pricing updates, discount programs and stocks.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Product
        </Button>
      </div>

      {/* Cards summary info */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card className="p-5 bg-forge-900 border-forge-800 flex items-center gap-4">
          <Package className="w-8 h-8 text-brand-orange shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-forge-400 uppercase tracking-wider block font-heading">Total Items</span>
            <p className="text-2xl font-black font-heading text-white">{totalItemsCount}</p>
          </div>
        </Card>
        <Card className="p-5 bg-forge-900 border-forge-800 flex items-center gap-4">
          <Package className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-forge-400 uppercase tracking-wider block font-heading">Stock Sum</span>
            <p className="text-2xl font-black font-heading text-white">{totalStockSum}</p>
          </div>
        </Card>
        <Card className="p-5 bg-forge-900 border-forge-800 flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-forge-400 uppercase tracking-wider block font-heading">Low Stock Alerts</span>
            <p className="text-2xl font-black font-heading text-amber-550">{lowStockCount}</p>
          </div>
        </Card>
        <Card className="p-5 bg-forge-900 border-forge-800 flex items-center gap-4">
          <SlidersHorizontal className="w-8 h-8 text-brand-red shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-forge-400 uppercase tracking-wider block font-heading">Inventory Value</span>
            <p className="text-2xl font-black font-heading text-white">{formatINR(inventoryValue)}</p>
          </div>
        </Card>
      </div>

      {/* Filter Options */}
      <Card className="p-5 bg-forge-900 border-forge-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Search catalog by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-forge-400" />}
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c === 'All' ? 'All Categories' : c }))}
          />
        </div>
      </Card>

      {/* Inventory Table list */}
      <Card className="p-0 bg-forge-900 border-forge-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase bg-forge-950/60">
                <th className="py-4 px-5 font-bold">Product Item</th>
                <th className="py-4 px-4 font-bold">Category</th>
                <th className="py-4 px-4 font-bold">Price Rate</th>
                <th className="py-4 px-4 font-bold">Discounts</th>
                <th className="py-4 px-4 font-bold">Current Stock</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-850">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-forge-400">
                    No items in store catalog.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-forge-800/40 transition-colors">
                    <td className="py-4 px-5 font-bold text-white font-heading">
                      <div className="flex items-center gap-3">
                        {p.images && p.images[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-forge-700 bg-forge-800 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-forge-800 border border-forge-700 flex items-center justify-center text-forge-500 shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-forge-300">{p.category}</td>
                    <td className="py-4 px-4 text-forge-300 font-mono font-bold">{formatINR(p.price)}</td>
                    <td className="py-4 px-4 text-emerald-400 font-mono">
                      {p.discountPrice ? formatINR(p.discountPrice) : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-mono font-bold ${p.stock < 5 ? 'text-brand-red' : 'text-forge-300'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={p.isActive ? 'success' : 'outline'}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            p.isActive ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60' : 'bg-forge-850 text-forge-400 hover:text-white'
                          }`}
                          title="Toggle Active Status"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-forge-800 hover:bg-forge-700 text-forge-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Update Product Details' : 'Add Store Product'}
        description="Verify product information and details"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              required
              placeholder="e.g., Heavy Adjustable Dumbbell"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories.filter(c => c !== 'All').map(c => ({ value: c, label: c }))}
            />
          </div>

          <Input
            label="Product Tagline / Description"
            placeholder="Description for customers..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Original Price (INR)"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Discount Price (INR)"
              type="number"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Stock Inventory Quantity"
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Brand name"
              placeholder="e.g., IronForge Gear"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
            <Input
              label="SKU Code"
              placeholder="e.g., WT-DB-ADJ"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
          </div>

          <div className="border border-forge-800 bg-forge-950/40 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
              Product Image Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 mb-1.5 font-heading">
                    Upload Local Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="block w-full text-xs text-forge-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:font-heading file:bg-forge-850 file:text-white hover:file:bg-forge-800 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                  {isUploading && (
                    <p className="text-[10px] text-brand-orange animate-pulse font-bold mt-1.5">
                      Uploading image...
                    </p>
                  )}
                  {uploadError && (
                    <p className="text-[10px] text-brand-red font-bold mt-1.5">
                      {uploadError}
                    </p>
                  )}
                </div>
                <Input
                  label="Or Product Image URL"
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Preview image */}
              <div className="flex flex-col items-center justify-center p-3 border border-forge-850 bg-forge-900/60 rounded-xl h-full min-h-[140px]">
                {formData.images[0] ? (
                  <div className="relative group w-full h-32 flex items-center justify-center">
                    <img
                      src={formData.images[0]}
                      alt="Product Preview"
                      className="max-h-full max-w-full object-contain rounded-lg border border-forge-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-1.5 py-4">
                    <Package className="w-8 h-8 text-forge-600 mx-auto" />
                    <p className="text-[10px] text-forge-500 font-bold uppercase tracking-wider">
                      No Image Preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Input
            label="Features (comma-separated list)"
            placeholder="e.g., Non-slip steel grip, dial adjust, compact tray"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          />

          <Input
            label="Specifications (comma-separated key:value blocks)"
            placeholder="e.g., Weight:24kg, Material:Chrome Steel, Warranty:2 Years"
            value={formData.specifications}
            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          />

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full uppercase font-heading tracking-wider mt-4"
          >
            {editingProduct ? 'Save Product Specs' : 'Add to Inventory'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
