
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  AppSection, 
  Product, 
  CustomerDebt, 
  AIInsight,
  Transaction
} from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS } from './constants';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Debts from './components/Debts';
import AIInsights from './components/AIInsights';
import Catalog from './components/Catalog';
import Login from './components/Login';
import { AIService } from './services/geminiService';
import { Store, Settings, Save, Trash2, Download, LogOut } from 'lucide-react';

const App: React.FC = () => {
  // Estado de Autenticação (Persiste apenas durante a sessão do navegador)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('grocy_auth') === 'true';
  });

  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DIVIDAS);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('grocy_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState<CustomerDebt[]>(() => {
    const saved = localStorage.getItem('grocy_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  const aiService = useMemo(() => new AIService(), []);

  useEffect(() => {
    localStorage.setItem('grocy_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('grocy_customers', JSON.stringify(customers));
  }, [customers]);

  const handleLogin = (pin: string) => {
    sessionStorage.setItem('grocy_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('grocy_auth');
    setIsAuthenticated(false);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-6 left-1/2 -translate-x-1/2 ${type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'} text-white px-8 py-4 rounded-[2rem] text-sm font-black shadow-2xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300 uppercase tracking-widest flex items-center gap-3`;
    toast.innerHTML = `<div class="bg-white/20 p-1 rounded-full"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('animate-out', 'fade-out', 'slide-out-to-top-4');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const fetchInsights = useCallback(async () => {
    setIsInsightsLoading(true);
    const data = await aiService.generateBusinessInsights(products, customers);
    setInsights(data);
    setIsInsightsLoading(false);
  }, [products, customers, aiService]);

  useEffect(() => {
    if (isAuthenticated && activeSection === AppSection.INSIGHTS) fetchInsights();
  }, [activeSection, fetchInsights, isAuthenticated]);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, stock: p.stock - 1 } : p
    ));
    showToast(`${product.name} vendido!`);
  };

  const handleAddProduct = (p: Partial<Product>) => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: p.name || 'Novo Produto',
      category: p.category || 'Geral',
      price: p.price || 0,
      costPrice: p.costPrice || 0,
      stock: p.stock || 0,
      unit: p.unit || 'Unid',
      lastUpdated: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast("Produto Salvo");
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p));
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Deseja apagar este produto?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddCustomer = (c: Partial<CustomerDebt>) => {
    const newCustomer: CustomerDebt = {
      id: Math.random().toString(36).substr(2, 9),
      name: c.name || 'Novo Cliente',
      phone: c.phone || '',
      balance: 0,
      history: []
    };
    setCustomers(prev => [newCustomer, ...prev]);
    showToast("Cliente Cadastrado!");
  };

  const handleRecordPayment = (customerId: string, amount: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          customerId,
          items: [],
          total: amount,
          type: 'VISTA',
          status: 'PAGO',
          timestamp: new Date().toISOString()
        };
        return {
          ...c,
          balance: Math.max(0, c.balance - amount),
          history: [newTx, ...c.history]
        };
      }
      return c;
    }));
    showToast("Pagamento Recebido!");
  };

  const handleRecordDebt = (customerId: string, amount: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          customerId,
          items: [],
          total: amount,
          type: 'FIADO',
          status: 'PENDENTE',
          timestamp: new Date().toISOString()
        };
        return {
          ...c,
          balance: c.balance + amount,
          history: [newTx, ...c.history]
        };
      }
      return c;
    }));
    showToast("Novo Fiado Gravado!");
  };

  const handleGenerateReceipt = (customer: CustomerDebt) => {
    const receipt = aiService.generateReceiptText(customer, []);
    const encoded = encodeURIComponent(receipt);
    window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 lg:pb-0 lg:pl-64 transition-all duration-300">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-slate-50 p-4 lg:hidden z-30 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
            <Store size={22} strokeWidth={3} />
          </div>
          <span className="font-black text-slate-800 tracking-tighter text-base uppercase">Gestão Mercearia</span>
        </div>
        <button 
          onClick={() => setActiveSection(AppSection.CONFIGURACOES)}
          className="p-3 bg-slate-50 text-slate-400 rounded-xl"
        >
          <Settings size={22} />
        </button>
      </header>

      <main className="p-4 lg:p-10 max-w-7xl mx-auto">
        {activeSection === AppSection.DIVIDAS && (
          <Debts 
            customers={customers} 
            onAddCustomer={handleAddCustomer} 
            onRecordPayment={handleRecordPayment}
            onRecordDebt={handleRecordDebt}
            onGenerateReceipt={handleGenerateReceipt}
          />
        )}

        {activeSection === AppSection.PAINEL && (
          <Dashboard products={products} customers={customers} />
        )}

        {activeSection === AppSection.CATALOGO && (
          <Catalog products={products} onAddToCart={handleAddToCart} />
        )}
        
        {activeSection === AppSection.ESTOQUE && (
          <Inventory 
            products={products} 
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeSection === AppSection.INSIGHTS && (
          <AIInsights 
            insights={insights} 
            isLoading={isInsightsLoading} 
            onRefresh={fetchInsights} 
          />
        )}

        {activeSection === AppSection.CONFIGURACOES && (
          <div className="p-10 max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Painel do Dono</h2>
              <p className="text-slate-500 text-sm font-medium mt-2">Segurança e Backup dos dados</p>
            </div>

            <div className="space-y-4">
               <button 
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({products, customers}));
                  const downloadAnchorNode = document.createElement('a');
                  const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", `BACKUP_MERCEARIA_${date}.json`);
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                  showToast("Backup baixado!");
                }}
                className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-widest active:scale-95 shadow-lg shadow-emerald-100"
               >
                 <Download size={20} strokeWidth={3} />
                 Salvar Cópia de Segurança
               </button>

               <button 
                onClick={handleLogout}
                className="w-full py-6 bg-slate-800 text-white rounded-[2rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-widest active:scale-95 shadow-lg"
               >
                 <LogOut size={20} />
                 Sair do Sistema
               </button>

               <div className="pt-10">
                 <button 
                  onClick={() => {
                    if(confirm("ATENÇÃO: Isso apagará TODOS os devedores e produtos. Tem certeza?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="w-full py-6 text-rose-600 border-2 border-rose-100 rounded-[2rem] hover:bg-rose-50 font-black transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-4"
                >
                  <Trash2 size={20} />
                  Zerar Todo o Sistema
                </button>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
