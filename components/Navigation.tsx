
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Lightbulb, 
  ShoppingCart,
  Menu
} from 'lucide-react';
import { AppSection } from '../types';

interface NavigationProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: AppSection.PAINEL, label: 'Início', icon: LayoutDashboard },
    { id: AppSection.CATALOGO, label: 'Vender', icon: ShoppingCart },
    { id: AppSection.DIVIDAS, label: 'Fiado', icon: Users },
    { id: AppSection.ESTOQUE, label: 'Estoque', icon: Package },
    { id: AppSection.INSIGHTS, label: 'IA', icon: Lightbulb },
  ];

  return (
    <>
      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex-col z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-50">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
            <ShoppingCart size={24} />
          </div>
          <h1 className="font-bold text-slate-800 tracking-tight">GrocyManager</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-orange-50 text-orange-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation (Visible only on mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-2 py-1 flex justify-around items-center z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px] ${
              activeSection === item.id
                ? 'text-orange-600'
                : 'text-slate-400'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeSection === item.id ? 'bg-orange-50' : ''}`}>
              <item.icon size={22} strokeWidth={activeSection === item.id ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
