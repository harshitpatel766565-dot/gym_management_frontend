'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productService, Product } from '@/services/productService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/context/ToastContext';
import { formatINR } from '@/lib/utils';
import { ArrowLeft, ShoppingBag, Truck, ShieldAlert, Award, Star } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await productService.getProductById(productId);
        setProduct(res.data);
        if (res.data?.images?.length > 0) {
          setActiveImage(res.data.images[0]);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        error('Error', 'Unable to load product.');
      } finally {
        setIsLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleCheckout = () => {
    if (!product) return;
    success(
      'Checkout Simulated',
      `Simulated purchase of ${quantity}x ${product.name}. Delivery order created.`
    );
  };

  if (isLoading || !product) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen bg-forge-950">
        <LoadingSpinner label="Retrieving product specifications..." />
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-forge-950 text-white px-6 max-w-7xl mx-auto space-y-8">
      {/* Back navigation */}
      <button
        onClick={() => router.push('/products')}
        className="inline-flex items-center gap-2 text-sm text-forge-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </button>

      {/* Main product view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="relative h-[450px] w-full bg-forge-900 border border-forge-800 rounded-3xl overflow-hidden flex items-center justify-center">
            <img
              src={activeImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600'}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            {hasDiscount && (
              <Badge variant="flame" className="absolute top-4 left-4">
                Save {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
              </Badge>
            )}
          </div>

          {/* Gallery selector */}
          {product.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 ${
                    activeImage === img ? 'border-brand-red' : 'border-forge-800'
                  }`}
                >
                  <img src={img} alt="" className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="flame">{product.category}</Badge>
              {product.brand && <span className="text-xs text-forge-400">By {product.brand}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-heading uppercase text-white tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 text-amber-400">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-forge-400">(24 customer reviews)</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-forge-900 border border-forge-800 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black font-heading text-white">{formatINR(currentPrice)}</span>
              {hasDiscount && (
                <span className="text-sm text-forge-500 line-through font-mono">{formatINR(product.price)}</span>
              )}
            </div>

            <div className="text-xs space-y-2 text-forge-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free nationwide delivery. Ships in 24-48 hours.</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-orange shrink-0" />
                <span>100% Genuine product directly from IronForge Gym partner brands.</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase font-heading text-forge-300">Description</h3>
            <p className="text-xs text-forge-400 leading-relaxed">
              {product.description || 'Elevate your fitness journey with our high-grade IronForge store gear. Designed and tested under intense workout conditions to maximize durability, ergonomics, and muscle tension.'}
            </p>
          </div>

          {/* Specs */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase font-heading text-forge-300">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="p-3 bg-forge-900/60 border border-forge-850 rounded-xl">
                    <span className="text-forge-400 block mb-0.5">{key}</span>
                    <span className="font-bold text-white font-heading">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action box */}
          <div className="pt-6 border-t border-forge-800 flex items-center gap-4">
            {product.stock > 0 ? (
              <>
                <div className="flex items-center border border-forge-800 rounded-xl bg-forge-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-forge-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-forge-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleCheckout}
                  variant="primary"
                  size="md"
                  className="flex-grow"
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                >
                  Buy Now
                </Button>
              </>
            ) : (
              <div className="w-full p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-center text-red-400 text-xs font-bold font-heading">
                Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
