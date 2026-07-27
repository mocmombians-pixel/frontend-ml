    import React, {useState} from "react";
import { apiService } from "../services/apiService";
import { Mail, Lock, LogIn, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';

export const Login = ({onLoginSuccess, onGoToRegister}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiService.login(username, password );
            onLoginSuccess(data);


        } catch (err) {
            setError(err.message || 'Credenciales invalidas. Verefica tu correo y contraseña.');
        } finally {
            setLoading(false);
            
        }
    };



    
     return(
             <div className="max-w-lg w-full mx-auto my-12 bg-white
        rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-700
            px-6 py-8 text-center text-white overflow-hidden">
          <div className='absolute -top-10 -right-10 w-40 h-40 bg-white/[0.04] rounded-full blur-2xl'></div>
          <div className='absolute -bottom-8 -left-8 w-28 h-28 bg-fuchsia-400/10 rounded-full blur-2xl'></div>
          <div className='relative z-10'>
            <div className='inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-inner mb-4'>
              <ShoppingBag className='w-7 h-7 text-purple-200' />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Bienvenido de nuevo</h2>
            <p className="text-purple-200/70 mt-1.5 text-sm font-light">Inicia sesión
                en tu cuenta de Mercadito hoy mismo</p>
            <div className='mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-sm rounded-full border border-white/10'>
              <Sparkles className='w-3 h-3 text-fuchsia-300' />
              <span className='text-[10px] text-purple-200/60 font-bold uppercase tracking-[0.15em]'>Compra segura</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-5">
            {error && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50/80 text-red-700 p-4 rounded-xl flex items-start gap-2.5 border border-red-200/80 text-sm shadow-sm">
                    <div className='p-1 bg-red-100 rounded-lg flex-shrink-0'>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <span className='font-medium pt-0.5'>{error}</span>
                </div>
            )}

    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Correo electrónico</label>
        <div className="relative group">
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-all duration-300 pointer-events-none" />
            <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-500
                text-sm transition-all duration-200 hover:border-gray-300 bg-white relative z-10"
                placeholder="tucorreo@ejemplo.com"
            />
        </div>
    </div>

    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Contraseña</label>
        <div className="relative group">
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-all duration-300 pointer-events-none" />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-500
                text-sm transition-all duration-200 hover:border-gray-300 bg-white relative z-10"
                placeholder="••••••••"
            />
        </div>
    </div>

    <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5
         bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500
         text-white font-bold py-3 rounded-xl transition-all duration-200
         shadow-lg shadow-purple-300/30 hover:shadow-xl hover:shadow-purple-400/40 active:scale-[0.98]"
    >
        <LogIn className="w-5 h-5" />
        {loading ? 'Iniciando sesión...' : 'Entrar'}
    </button>

    <div className="relative">
      <div className='absolute inset-0 flex items-center'>
        <div className='w-full border-t border-gray-100'></div>
      </div>
      <div className='relative flex justify-center'>
        <span className='px-4 bg-white text-[10px] text-gray-400 font-bold uppercase tracking-wider'>o</span>
      </div>
    </div>

    <div className="text-center text-sm">
        <span className="text-gray-400">¿No tienes una cuenta? </span>
        <button
            type="button"
            onClick={onGoToRegister}
            className="text-purple-700 hover:text-fuchsia-600 font-black transition-colors duration-200 hover:underline"
        >
            Regístrate Ahora
        </button>
    </div>
</form>

        </div>
        )
    }