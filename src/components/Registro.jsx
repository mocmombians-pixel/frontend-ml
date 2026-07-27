import React, {useState} from "react";
import { apiService } from "../services/apiService";
import { UserPlus, User, Mail, Lock, Phone, MapPin,
    Shield, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
    
    export const Registro = ({onRegisterSuccess, onGoToLogin}) => {

        const [nombre, setNombre] = useState('');
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [rol, setRol] = useState('ROLE_CLIENTE');
        const [direccion, setDireccion] = useState('');
        const [telefono, setTelefono] = useState('');


        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');
            setLoading(true);
            
            const payload = {
                username,
                password,
                nombre,
                rol,    
                direccion: rol === 'ROLE_CLIENTE' ? direccion : null,
                telefono: rol === 'ROLE_CLIENTE' ? telefono : null
            };

            try{
                await apiService.registro(payload);
                setSuccess('¡Registro completado con éxito! Ahora puedes iniciar sesión.');
                setTimeout(() => {
                    onRegisterSuccess();
                }, 2000);
            }catch(err){
                setError(err.message || 'Error al completar el registro. Intenta con otro correo.');
            }finally{
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
              <UserPlus className='w-7 h-7 text-purple-200' />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Crear una Cuenta</h2>
            <p className="text-purple-200/70 mt-1.5 text-sm font-light">Únete a
                MercaditoLibre hoy mismo</p>
            <div className='mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-sm rounded-full border border-white/10'>
              <Sparkles className='w-3 h-3 text-fuchsia-300' />
              <span className='text-[10px] text-purple-200/60 font-bold uppercase tracking-[0.15em]'>Registro rápido</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
            {error && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50/80 text-red-700 p-4 rounded-xl flex items-start gap-2.5 border border-red-200/80 text-sm shadow-sm">
                    <div className='p-1 bg-red-100 rounded-lg flex-shrink-0'>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <span className='font-medium pt-0.5'>{error}</span>
                </div>
            )}
            {success && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50/80 text-emerald-700 p-4 rounded-xl flex items-start gap-2.5 border border-emerald-200/80 text-sm shadow-sm">
                    <div className='p-1 bg-emerald-100 rounded-lg flex-shrink-0'>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className='font-medium pt-0.5'>{success}</span>
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600"/> Selecciona tu rol
                </label>
                <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-500
                    text-sm transition-all duration-200 hover:border-gray-300 bg-white"
                >
                    <option value="ROLE_CLIENTE">Cliente (Comprador)</option>
                    <option value="ROLE_ADMIN">Administrador (Jefe)</option>
                </select>

            </div>

    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre Completo</label>
        <div className="relative group">
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-all duration-300 pointer-events-none" />
            <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-500
                text-sm transition-all duration-200 hover:border-gray-300 bg-white relative z-10"
                placeholder="Tu nombre completo"
            />
        </div>
    </div>

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
                placeholder="Minimo 6 caracteres"
                minLength={6}
            />
        </div>
    </div>

    {rol === 'ROLE_CLIENTE' && (
        <div className="space-y-4 border-t border-gray-100 pt-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <User className='w-3.5 h-3.5 text-purple-500' /> Información Adicional</h3>

    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Teléfono de contacto</label>
        <div className="relative group">
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
            <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-all duration-300 pointer-events-none" />
            <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required={rol === 'ROLE_CLIENTE'}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-500
                text-sm transition-all duration-200 hover:border-gray-300 bg-white relative z-10"
                placeholder="55 1234 5678"
            />
        </div>
    </div>

    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Dirección</label>
        <div className="relative group">
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
            <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-all duration-300 pointer-events-none" />
            <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required={rol === 'ROLE_CLIENTE'}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-500
                text-sm transition-all duration-200 hover:border-gray-300 bg-white relative z-10"
                placeholder="Calle, número, colonia"
            />
        </div>
    </div>
    </div>
)}

    <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5
         bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500
         text-white font-bold py-3 rounded-xl transition-all duration-200
         shadow-lg shadow-purple-300/30 hover:shadow-xl hover:shadow-purple-400/40 active:scale-[0.98]"
    >
        <UserPlus className="w-5 h-5" />
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
    </button>

    <div className="text-center text-sm pt-3">
        <span className="text-gray-400">¿Ya tienes una cuenta? </span>
        <button
        type="button"
        onClick={onGoToLogin}
        className="text-purple-700 hover:text-fuchsia-600 font-black transition-colors duration-200 hover:underline"
        >
            Inicia sesión
        </button>
    </div>
       
    
</form>

        </div>
        )
    }