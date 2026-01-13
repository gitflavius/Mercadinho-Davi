import React from 'react';
import { 
  Sparkles, 
  RefreshCcw, 
  ArrowRight,
  Target,
  TrendingUp,
  AlertCircle,
  Zap
} from 'lucide-react';
import { AIInsight } from '../types';

interface AIInsightsProps {
  insights: AIInsight[];
  isLoading: boolean;
  onRefresh: () => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights, isLoading, onRefresh }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            Orquestrador IA
            <Sparkles className="text-orange-600" size={24} />
          </h2>
          <p className="text-slate-500 text-sm font-medium">Seu assistente inteligente analisando tendências e necessidades da sua loja.</p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-white border border-slate-100 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 font-bold shadow-sm disabled:opacity-50 active:scale-95"
        >
          <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
          Recalcular Insights
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white h-48 rounded-3xl border border-slate-50 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, idx) => (
            <div key={idx} className={`relative overflow-hidden group p-7 bg-white border border-slate-100 rounded-3xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-1`}>
              <div className={`absolute -right-12 -top-12 w-32 h-32 blur-3xl opacity-10 transition-all group-hover:opacity-25 rounded-full ${
                insight.priority === 'ALTA' ? 'bg-rose-500' : insight.type === 'TENDENCIA' ? 'bg-indigo-500' : 'bg-emerald-500'
              }`} />

              <div className="flex items-start gap-5 relative z-10">
                <div className={`p-4 rounded-2xl flex-shrink-0 ${
                  insight.type === 'REPOR' ? 'bg-rose-50 text-rose-600' :
                  insight.type === 'TENDENCIA' ? 'bg-indigo-50 text-indigo-600' :
                  insight.type === 'FINANCEIRO' ? 'bg-amber-50 text-amber-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {insight.type === 'REPOR' && <RefreshCcw size={24} />}
                  {insight.type === 'TENDENCIA' && <TrendingUp size={24} />}
                  {insight.type === 'FINANCEIRO' && <Zap size={24} />}
                  {insight.type === 'CONSELHO' && <Target size={24} />}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                      {insight.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                      insight.priority === 'ALTA' ? 'bg-rose-100 text-rose-700' : 
                      insight.priority === 'MEDIA' ? 'bg-amber-100 text-amber-700' : 
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">
                    {insight.message}
                  </h3>
                  {insight.impact && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Zap size={12} className="text-orange-500" />
                      Impacto Estimado: <span className="font-black text-slate-700">{insight.impact}</span>
                    </p>
                  )}
                  <button className="flex items-center gap-2 text-orange-600 text-xs font-black pt-2 group-hover:gap-3 transition-all uppercase tracking-widest">
                    Agir Agora
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Special Advice Card */}
          <div className="md:col-span-2 bg-orange-600 rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-orange-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 space-y-5 max-w-lg text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={14} /> Recomendação da IA
              </div>
              <h2 className="text-2xl lg:text-4xl font-black leading-tight">Melhore a transparência e fidelize seus clientes.</h2>
              <p className="text-orange-50 text-sm opacity-90 font-medium">Envie comprovantes digitais via WhatsApp para seus clientes do fiado. Isso gera confiança e reduz esquecimentos de pagamento.</p>
              <div className="pt-2">
                <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-3 mx-auto md:mx-0 active:scale-95">
                  Ativar Integração WhatsApp
                  <ArrowRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>

            <div className="hidden md:flex relative z-10 flex-1 justify-center">
              <div className="w-56 h-72 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 flex flex-col justify-between transform rotate-3 shadow-2xl">
                <div className="flex justify-between items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                  <div className="w-12 h-2 rounded-full bg-white/20" />
                </div>
                <div className="space-y-3">
                  <div className="w-full h-3 rounded-full bg-white/20" />
                  <div className="w-3/4 h-3 rounded-full bg-white/20" />
                  <div className="w-1/2 h-3 rounded-full bg-white/20" />
                </div>
                <div className="w-full h-12 rounded-xl bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;