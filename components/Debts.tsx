import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Users,
  ChevronRight,
  ChevronLeft,
  Calendar,
  AlertCircle,
  Plus,
  X,
  Check,
  Phone,
  Wallet
} from 'lucide-react';
import { CustomerDebt } from '../types';

interface DebtsProps {
  customers: CustomerDebt[];
  onAddCustomer: (c: Partial<CustomerDebt>) => void;
  onRecordPayment: (id: string, amount: number) => void;
  onRecordDebt: (id: string, amount: number) => void;
  onGenerateReceipt: (customer: CustomerDebt) => void;
}

const Debts: React.FC<DebtsProps> = ({ customers, onAddCustomer, onRecordPayment, onRecordDebt, onGenerateReceipt }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDebt | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  const totalReceivable = customers.reduce((acc, c) => acc + c.balance, 0);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => b.balance - a.balance);

  const handleConfirmAction = (type: 'payment' | 'debt') => {
    // Converte vírgula para ponto antes de transformar em número
    const cleanValue = amount.replace(',', '.');
    const numericValue = parseFloat(cleanValue);
    
    if (isNaN(numericValue) || numericValue <= 0 || !selectedCustomer) {
      alert("Por favor, insira um valor válido.");
      return;
    }
    
    if (type === 'payment') {
      onRecordPayment(selectedCustomer.id, numericValue);
    } else {
      onRecordDebt(selectedCustomer.id, numericValue);
    }
    
    setSelectedCustomer(null);
    setAmount('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Permite apenas números, ponto e vírgula
    if (/^[0-9.,]*$/.test(val)) {
      setAmount(val);
    }
  };

  if (selectedCustomer) {
    return (
      <div className="space-y-4 animate-in slide-in-from-right duration-300 pb-20 max-w-lg mx-auto">
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={() => {
              setSelectedCustomer(null);
              setAmount('');
            }}
            className="flex items-center gap-2 text-slate-500 font-black text-sm uppercase tracking-widest"
          >
            <ChevronLeft size={24} strokeWidth={3} />
            Voltar
          </button>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalhes do Cliente</span>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl shadow-slate-100/50 text-center">
          <div className="w-20 h-20 bg-orange-600 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto shadow-lg shadow-orange-200">
            {selectedCustomer.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-4 tracking-tight">{selectedCustomer.name}</h2>
          <p className="text-slate-400 text-sm font-bold mt-1">{selectedCustomer.phone || 'Sem telefone'}</p>
          
          <div className="mt-8 p-6 bg-orange-50 rounded-[2rem] border-2 border-orange-100">
             <span className="text-[10px] uppercase font-black text-orange-400 tracking-widest block mb-1">Saldo Devedor Atual</span>
             <div className="text-4xl font-black text-orange-700">R$ {selectedCustomer.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl shadow-slate-100/50 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1 text-center">Quanto o cliente está pagando ou comprando?</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-2xl">R$</span>
              <input 
                type="text" 
                inputMode="decimal"
                placeholder="0,00"
                autoFocus
                className="w-full pl-16 pr-6 py-8 bg-slate-50 border-4 border-transparent rounded-[2rem] text-4xl font-black outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-200"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => handleConfirmAction('payment')}
              className="flex items-center justify-center gap-4 p-6 bg-emerald-600 text-white rounded-[2rem] font-black text-sm active:scale-95 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
            >
              <ArrowDownLeft size={28} strokeWidth={3} />
              BAIXA / PAGO
            </button>
            <button 
              onClick={() => handleConfirmAction('debt')}
              className="flex items-center justify-center gap-4 p-6 bg-orange-600 text-white rounded-[2rem] font-black text-sm active:scale-95 shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all"
            >
              <ArrowUpRight size={28} strokeWidth={3} />
              NOVO FIADO
            </button>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => onGenerateReceipt(selectedCustomer)}
              className="w-full py-6 bg-slate-800 text-white rounded-[2rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-widest active:scale-95 shadow-lg"
            >
              <MessageSquare size={20} className="text-emerald-400" />
              Enviar Cobrança WhatsApp
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Últimas Transações</h3>
             <Calendar size={18} className="text-slate-300" />
           </div>
           <div className="space-y-4">
              {selectedCustomer.history.slice(0, 5).map((h, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${h.type === 'VISTA' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {h.type === 'VISTA' ? <ArrowDownLeft size={18} strokeWidth={3} /> : <ArrowUpRight size={18} strokeWidth={3} />}
                    </div>
                    <div>
                      <span className="text-sm font-black text-slate-800 block">{h.type === 'VISTA' ? 'Pagamento' : 'Novo Débito'}</span>
                      <span className="text-xs font-bold text-slate-400">{new Date(h.timestamp).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <span className={`text-lg font-black ${h.type === 'VISTA' ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {h.type === 'VISTA' ? '-' : '+'} {h.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-lg mx-auto">
      {/* Card de Resumo Financeiro (Gatilho de Necessidade) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="text-orange-500" size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total "Na Rua" (Fiado)</span>
          </div>
          <div className="text-4xl font-black text-white">R$ {totalReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">Você tem {customers.filter(c => c.balance > 0).length} clientes pendentes</p>
        </div>
      </div>

      <header className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Meus Clientes</h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 active:scale-95 transition-all"
        >
          <Plus size={18} strokeWidth={4} />
          Novo
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
        <input 
          type="text" 
          placeholder="Buscar cliente pelo nome..." 
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[2rem] shadow-sm outline-none focus:border-orange-500 transition-all font-bold text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {sortedCustomers.map(customer => (
          <button
            key={customer.id}
            onClick={() => setSelectedCustomer(customer)}
            className="w-full bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 flex items-center gap-5 shadow-sm active:bg-orange-50 active:border-orange-100 transition-all group relative overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
              customer.balance > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-300'
            }`}>
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-black text-slate-800 text-lg tracking-tight line-clamp-1">{customer.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{customer.phone || 'Sem celular'}</p>
            </div>
            <div className="text-right">
              <div className={`text-lg font-black ${customer.balance > 0 ? 'text-orange-600' : 'text-emerald-500'}`}>
                R$ {customer.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <ChevronRight size={16} className="text-slate-200 ml-auto mt-1" />
            </div>
          </button>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-end lg:items-center justify-center p-0 lg:p-4">
           <div className="bg-white rounded-t-[3rem] lg:rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in slide-in-from-bottom duration-300">
             <AddCustomerForm 
               onSubmit={(data) => {
                 onAddCustomer(data);
                 setShowAddModal(false);
               }}
               onCancel={() => setShowAddModal(false)}
             />
           </div>
        </div>
      )}
    </div>
  );
};

const AddCustomerForm = ({ onSubmit, onCancel }: { onSubmit: (d: any) => void, onCancel: () => void }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Cadastrar Cliente</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Insira os dados básicos</p>
        </div>
        <button onClick={onCancel} className="p-4 bg-slate-50 text-slate-400 rounded-2xl">
          <X size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-widest px-1">Nome do Cliente</label>
          <input 
            type="text" 
            placeholder="Ex: João da Padaria"
            className="w-full px-6 py-5 bg-slate-50 border-4 border-transparent rounded-[1.5rem] focus:border-orange-500 focus:bg-white outline-none font-black text-slate-800 transition-all text-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-widest px-1">Celular (WhatsApp)</label>
          <input 
            type="tel" 
            placeholder="Ex: 11 99999-0000"
            className="w-full px-6 py-5 bg-slate-50 border-4 border-transparent rounded-[1.5rem] focus:border-orange-500 focus:bg-white outline-none font-black text-slate-800 transition-all text-xl"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        <button 
          onClick={onCancel}
          className="flex-1 py-5 bg-slate-100 rounded-[1.5rem] font-black text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
        >
          Voltar
        </button>
        <button 
          disabled={!name}
          onClick={() => onSubmit({ name, phone })}
          className="flex-2 px-10 py-5 bg-orange-600 text-white rounded-[1.5rem] font-black hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          <Check size={24} strokeWidth={4} />
          Salvar Cliente
        </button>
      </div>
    </div>
  );
};

export default Debts;