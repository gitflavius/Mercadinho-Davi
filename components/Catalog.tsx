
import React, { useState } from 'react';
import { Search, Package, Plus } from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../constants';

interface CatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const Catalog: React.FC<CatalogProps> = ({ products, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="space-y-4 lg:space-y-8 pb-4">
      {/* Search Bar - Sticky on Mobile */}
      <div className="sticky top-[73px] lg:top-0 bg-[#FDFDFD]/90 backdrop-blur-md pt-2 pb-4 z-20">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Qual produto você procura?"
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-base transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Filter - Horizontal Scroll on Mobile */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 mask-fade-edges">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${
              activeCategory === cat
                ? 'bg-orange-500 text-white border-orange-500 shadow-orange-200'
                : 'bg-white text-slate-600 border-slate-200 hover:border-orange-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid - 2 columns on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm active:scale-95 transition-transform duration-200">
            <div className="relative aspect-square overflow-hidden bg-slate-50">
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'} 
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                  Últimas un.
                </div>
              )}
            </div>
            
            <div className="p-3 lg:p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-xs lg:text-sm font-bold text-slate-800 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-orange-600 text-sm lg:text-lg font-black tracking-tight">R$ {product.price.toFixed(2)}</span>
                  <span className="text-slate-400 text-[9px] font-bold">/ {product.unit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1">
                 <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                    <Package size={10} />
                    <span>{product.stock}</span>
                 </div>
                 <button 
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock <= 0}
                  className={`w-10 h-10 lg:w-full lg:h-auto lg:py-2 rounded-xl flex items-center justify-center transition-all ${
                    product.stock > 0 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100'
                      : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  <Plus size={20} strokeWidth={3} />
                  <span className="hidden lg:inline ml-2 font-bold text-sm">Vender</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-50">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
            <Search size={32} />
          </div>
          <h3 className="font-bold text-slate-800">Nada por aqui...</h3>
          <p className="text-slate-400 text-sm px-8">Tente buscar por outro termo ou limpe os filtros.</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
