
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Lightbulb, 
  Settings,
  Store,
  ShoppingCart
} from 'lucide-react';
import { AppSection } from '../types';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: AppSection.PAINEL, label: 'Painel Geral', icon: LayoutDashboard },
    { id: AppSection.CATALOGO, label: 'Catálogo / PDV', icon: ShoppingCart },
    { id: AppSection.ESTOQUE, label: 'Meu Estoque', icon: Package },
    { id: AppSection.DIVIDAS, label: 'Gestão Fiado', icon: Users },
    { id: AppSection.INSIGHTS, label: 'Orquestrador AI', icon: Lightbulb },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-50">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
          <Store size={24} />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 tracking-tight">GrocyManager</h1>
          <span className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">IA Inteligente</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-orange-50 text-orange-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => setActiveSection(AppSection.CONFIGURACOES)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeSection === AppSection.CONFIGURACOES
              ? 'bg-orange-50 text-orange-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings size={20} />
          Configurações
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
