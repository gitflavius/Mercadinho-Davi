
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { Product, CustomerDebt } from '../types';

interface DashboardProps {
  products: Product[];
  customers: CustomerDebt[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, customers }) => {
  const totalReceivables = customers.reduce((acc, c) => acc + c.balance, 0);
  const totalInDebt = customers.filter(c => c.balance > 0).length;
  
  // Calculando recebimentos recentes (exemplo simplificado)
  const recentPayments = customers.reduce((acc, c) => {
    const payments = c.history.filter(h => h.type === 'VISTA').reduce((sum, h) => sum + h.total, 0);
    return acc + payments;
  }, 0);

  const debtData = customers
    .filter(c => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5)
    .map(c => ({ 
      name: c.name.split(' ')[0], 
      valor: c.balance 
    }));

  return (
    <div className="space-y-6 pb-4 animate-in fade-in duration-500">
      <header className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-800 leading-tight">Saúde Financeira</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resumo de contas e recebíveis</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
          <TrendingUp size={20} />
        </div>
      </header>

      {/* Stats Principais */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-orange-600 rounded-[2rem] p-8 text-white shadow-xl shadow-orange-100 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-black uppercase tracking-widest opacity-80">Total a Receber (Fiado)</span>
            <div className="text-4xl font-black mt-1">R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center gap-2 mt-4 text-orange-100 text-sm font-bold">
              <Users size={16} />
              {totalInDebt} clientes com pendências
            </div>
          </div>
          <Wallet size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
             <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
               <ArrowDownLeft size={20} />
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Recebido (Mês)</span>
             <div className="text-lg font-black text-slate-800">R$ {recentPayments.toFixed(2)}</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
             <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-3">
               <AlertTriangle size={20} />
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Estoque Crítico</span>
             <div className="text-lg font-black text-slate-800">{products.filter(p => p.stock < 5).length} Itens</div>
          </div>
        </div>
      </div>

      {/* Gráfico de Devedores */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Maiores Pendências</h3>
          <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">TOP 5</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={debtData} layout="vertical" margin={{ left: -20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#64748b" 
                fontSize={12} 
                fontWeight="bold"
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="valor" radius={[0, 8, 8, 0]} barSize={32}>
                {debtData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#ea580c' : '#f97316'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Botão de Ação Rápida Cobrança */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white flex items-center justify-between shadow-lg shadow-indigo-100 active:scale-95 transition-transform">
        <div>
          <h4 className="font-black text-lg">Gerar Relatório de Cobrança</h4>
          <p className="text-indigo-100 text-xs opacity-80">A IA preparou uma lista de clientes para lembrar hoje.</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
          <ArrowUpRight size={24} />
        </div>
      </div>
    </div>
  );
};

const Users = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default Dashboard;
