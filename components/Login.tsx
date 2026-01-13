
import React, { useState } from 'react';
import { Store, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (pin: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1540') { // PIN Padrão para o protótipo
      onLogin(pin);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleKeypad = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-orange-200">
            <Store size={40} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">GrocyManager</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Acesso Restrito ao Dono</p>
          </div>
        </div>

        <div className={`bg-white rounded-[3rem] p-10 shadow-xl border-2 transition-all ${error ? 'border-rose-200 shake' : 'border-slate-50'}`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 text-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digite seu PIN de Acesso</label>
              <div className="flex justify-center gap-4 py-4">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      pin.length > i ? 'bg-orange-600 border-orange-600 scale-125' : 'bg-slate-100 border-slate-200'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Teclado Numérico Visual para Celular */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypad(num.toString())}
                  className="h-16 rounded-2xl bg-slate-50 text-slate-800 font-black text-xl hover:bg-orange-50 hover:text-orange-600 active:scale-90 transition-all"
                >
                  {num}
                </button>
              ))}
              <button 
                type="button" 
                onClick={() => setPin('')}
                className="h-16 rounded-2xl bg-slate-50 text-rose-500 font-black text-xs uppercase"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => handleKeypad('0')}
                className="h-16 rounded-2xl bg-slate-50 text-slate-800 font-black text-xl"
              >
                0
              </button>
              <button
                type="submit"
                disabled={pin.length < 4}
                className="h-16 rounded-2xl bg-orange-600 text-white flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
              >
                <ArrowRight size={24} strokeWidth={3} />
              </button>
            </div>

            {error && (
              <p className="text-rose-500 text-[10px] font-black text-center uppercase tracking-widest animate-bounce">
                PIN Incorreto. Tente novamente.
              </p>
            )}
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          SaaS Mercearia v1.0 • Seguro & Privado
        </p>
      </div>

      <style>{`
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10, 90% { transform: translate3d(-1px, 0, 0); }
          20, 80% { transform: translate3d(2px, 0, 0); }
          30, 50, 70% { transform: translate3d(-4px, 0, 0); }
          40, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
