import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ChevronDown,
  ArrowUpDown,
  Check,
  X,
  Package
} from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../constants';

interface InventoryProps {
  products: Product[];
  onAddProduct: (p: Partial<Product>) => void;
  onUpdateProduct: (id: string, p: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">Estoque</h2>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider text-[10px]">Controle seus produtos e preços</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-orange-100 active:scale-95"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou categoria..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50">
            <Filter size={18} />
            Categorias
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-orange-600 transition-colors">
                    Qtd <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-4">Venda</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm">{product.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Unid: {product.unit}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-sm ${product.stock < 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {product.stock}
                      </span>
                      {product.stock < 10 && (
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Estoque baixo" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-black text-sm">R$ {product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-16 text-center text-slate-400">
              <Package size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-bold">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Backdrop */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-end lg:items-center justify-center p-0 lg:p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in slide-in-from-bottom duration-300">
            <ProductForm 
              initialData={editingProduct || undefined}
              onSubmit={(data) => {
                if (editingProduct) {
                  onUpdateProduct(editingProduct.id, data);
                } else {
                  onAddProduct(data);
                }
                setShowAddModal(false);
                setEditingProduct(null);
              }}
              onCancel={() => {
                setShowAddModal(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || CATEGORIES[1],
    price: initialData?.price || 0,
    costPrice: initialData?.costPrice || 0,
    stock: initialData?.stock || 0,
    unit: initialData?.unit || 'Unid'
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800">
            {initialData ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Preencha as informações abaixo</p>
        </div>
        <button onClick={onCancel} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Nome do Produto</label>
          <input 
            type="text" 
            className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 outline-none font-bold text-slate-800 transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Arroz Tipo 1 5kg"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Categoria</label>
            <select 
              className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 outline-none font-bold text-slate-800 transition-all appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Unidade</label>
            <input 
              type="text" 
              placeholder="Ex: Kg, Unid"
              className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 outline-none font-bold text-slate-800 transition-all"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Custo (R$)</label>
            <input 
              type="number" 
              className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 outline-none font-black text-slate-800 transition-all"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Venda (R$)</label>
            <input 
              type="number" 
              className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 outline-none font-black text-emerald-600 transition-all"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Estoque</label>
            <input 
              type="number" 
              className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 outline-none font-black text-slate-800 transition-all"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <button 
          onClick={onCancel}
          className="flex-1 py-4 bg-slate-50 rounded-2xl font-black text-slate-400 hover:bg-slate-100 transition-all active:scale-95"
        >
          Cancelar
        </button>
        <button 
          onClick={() => onSubmit(formData)}
          className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 active:scale-95"
        >
          <Check size={20} strokeWidth={3} />
          {initialData ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </div>
  );
};

export default Inventory;