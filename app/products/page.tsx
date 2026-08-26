'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productService, Product } from '@/services/productService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/context/ToastContext';
import { formatINR } from '@/lib/utils';
import { Search, ShoppingBag, SlidersHorizontal, Eye } from 'lucide-react';

export default function ProductsCatalogPage() {
  const router = useRouter();
  const { error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await productService.getProducts();
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
        error('Error', 'Unable to load products catalog.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const sortedAndFiltered = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'price-desc') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      return 0; // featured/default
    });

  if (isLoading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen bg-forge-950">
        <LoadingSpinner label="Opening IronForge Store vault..." />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-forge-950 text-white px-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="flame">IronForge Gear Store</Badge>
        <h1 className="text-4xl md:text-5xl font-black uppercase font-heading tracking-tight">
          Pro-Grade Training Equipment
        </h1>
        <p className="text-xs text-forge-400">
          Fuel your gains with our premium dumbbells, heavy resistance bands, and high-performance nutrition formulas.
        </p>
      </div>

      {/* Filter panel */}
      <Card className="p-5 bg-forge-900 border-forge-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search equipment or supplements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-forge-400" />}
          />
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c }))}
          />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'featured', label: 'Sort: Featured' },
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
            ]}
          />
        </div>
      </Card>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sortedAndFiltered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-forge-400">
            No products match your selected filters.
          </div>
        ) : (
          sortedAndFiltered.map((p) => {
            const hasDiscount = p.discountPrice && p.discountPrice < p.price;
            const currentPrice = hasDiscount ? p.discountPrice! : p.price;

            return (
              <Card
                key={p._id}
                className="group relative flex flex-col justify-between overflow-hidden bg-forge-900 border-forge-800 p-0 transition-transform duration-300 hover:-translate-y-1 hover:border-brand-red"
              >
                {/* Image Banner */}
                <div className="relative h-60 bg-forge-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'}
                    alt={p.name}
                    className="object-cover w-full h-full opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  {hasDiscount && (
                    <Badge variant="flame" className="absolute top-4 left-4">
                      Save {Math.round(((p.price - p.discountPrice!) / p.price) * 100)}%
                    </Badge>
                  )}
                  {p.stock === 0 ? (
                    <Badge variant="outline" className="absolute top-4 right-4 bg-red-950 border-red-800 text-red-400">
                      Out of Stock
                    </Badge>
                  ) : p.stock < 5 ? (
                    <Badge variant="outline" className="absolute top-4 right-4 bg-amber-950 border-amber-800 text-amber-400">
                      Only {p.stock} Left
                    </Badge>
                  ) : null}
                </div>

                {/* Details Content */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">{p.category}</span>
                    <h3 className="text-lg font-bold font-heading text-white line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-forge-400 line-clamp-2">{p.description || 'Professional grade equipment for elite athletes.'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-forge-850">
                    <div className="flex flex-col">
                      {hasDiscount && (
                        <span className="text-xs text-forge-500 line-through font-mono">
                          {formatINR(p.price)}
                        </span>
                      )}
                      <span className="text-xl font-black text-white font-heading">
                        {formatINR(currentPrice)}
                      </span>
                    </div>

                    <Button
                      onClick={() => router.push(`/products/${p._id}`)}
                      variant="secondary"
                      size="sm"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
