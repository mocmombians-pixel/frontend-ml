import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User, Mail, Shield, ShoppingBag, Settings, LogOut, Phone, MapPin } from 'lucide-react';

export const Perfil = ({ user, setVistaActual, onLogout }) => {
  const esAdmin = user?.rol === 'ROLE_ADMIN';
  const esCliente = user?.rol === 'ROLE_CLIENTE';
  const inicial = (user?.nombre || '?').charAt(0).toUpperCase();

   // Trae los datos más recientes del cliente (por si el Admin los editó)
  const [datosFrescos, setDatosFrescos] = useState(null);

  useEffect(() => {
    if (esCliente && user?.username) {
      apiService.getClientes()
        .then((lista) => {
          const propio = (lista || []).find(c => c.email === user.username);
          if (propio) setDatosFrescos(propio);
        })
        .catch(() => {});
    }
  }, [esCliente, user?.username]);

  const handleLogout = () => {
    onLogout();
    setVistaActual('catalogo');
  };

  return (
    <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl'>
        {/* ═══ HEADER ═══ */}
        <div className='relative bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-700 p-8 text-center overflow-hidden'>
          <div className='absolute -top-10 -right-10 w-40 h-40 bg-white/[0.04] rounded-full blur-2xl'></div>
          <div className='absolute -bottom-8 -left-8 w-28 h-28 bg-fuchsia-400/10 rounded-full blur-2xl'></div>
          <div className='absolute top-6 right-20 w-2 h-2 bg-white/20 rounded-full animate-pulse' style={{ animationDuration: '3s' }}></div>

          <div className='relative z-10 inline-flex mb-4'>
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-xl border-4 border-white/20 ring-2 ring-fuchsia-400/30'>
              <span className='text-4xl font-black text-white drop-shadow-lg'>{inicial}</span>
            </div>
            <div className={'absolute -bottom-1 -right-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border-2 border-white ' + (esAdmin ? 'bg-amber-500 text-amber-900' : 'bg-emerald-500 text-emerald-900')}>
              {esAdmin ? 'Admin' : 'Cliente'}
            </div>
          </div>
          <h1 className='relative z-10 text-2xl sm:text-3xl font-black text-white tracking-tight'>{user?.nombre || 'Usuario'}</h1>
          <p className='relative z-10 text-purple-200/60 text-sm mt-1 font-light'>{user?.username || ''}</p>
        </div>

        {/* ═══ CUERPO ═══ */}
        <div className='p-6 sm:p-8 space-y-6'>
          <div>
            <h3 className='text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2'>
              <User className='w-3.5 h-3.5 text-purple-500' /> Informacion General
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 hover:border-purple-200/50 transition-all duration-200'>
                <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-sm'><User className='w-4 h-4 text-white' /></div>
                <div><p className='text-[11px] text-gray-400 font-semibold uppercase tracking-wider'>Nombre completo</p><p className='text-sm font-bold text-gray-800'>{user?.nombre || '---'}</p></div>
              </div>
              <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 hover:border-purple-200/50 transition-all duration-200'>
                <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-sm'><Mail className='w-4 h-4 text-white' /></div>
                <div><p className='text-[11px] text-gray-400 font-semibold uppercase tracking-wider'>Correo electronico</p><p className='text-sm font-bold text-gray-800'>{user?.username || '---'}</p></div>
              </div>
              <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 hover:border-purple-200/50 transition-all duration-200'>
                <div className={'w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ' + (esAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-emerald-500 to-teal-500')}>
                  <Shield className='w-4 h-4 text-white' />
                </div>
                <div><p className='text-[11px] text-gray-400 font-semibold uppercase tracking-wider'>Rol</p><p className={'text-sm font-bold ' + (esAdmin ? 'text-amber-700' : 'text-emerald-700')}>{esAdmin ? 'Administrador' : 'Cliente'}</p></div>
              </div>
              {esCliente && (
                <>
                  <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 hover:border-purple-200/50 transition-all duration-200'>
                    <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-sm'><Phone className='w-4 h-4 text-white' /></div>
                    <div><p className='text-[11px] text-gray-400 font-semibold uppercase tracking-wider'>Teléfono</p><p className='text-sm font-bold text-gray-800'>{(datosFrescos?.telefono || user?.telefono) || 'No especificado'}</p></div>
                  </div>
                  <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 hover:border-purple-200/50 transition-all duration-200'>
                    <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-sm'><MapPin className='w-4 h-4 text-white' /></div>
                    <div><p className='text-[11px] text-gray-400 font-semibold uppercase tracking-wider'>Dirección</p><p className='text-sm font-bold text-gray-800'>{(datosFrescos?.direccion || user?.direccion) || 'No especificada'}</p></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ═══ ACCIONES ═══ */}
          <div className='border-t border-gray-100 pt-6'>
            <h3 className='text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2'>
              <Settings className='w-3.5 h-3.5 text-purple-500' /> Acciones
            </h3>
            <div className='space-y-3'>
              {esAdmin && (
                <button onClick={() => setVistaActual('admin-panel')}
                  className='w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-100/80 hover:from-purple-100 hover:to-fuchsia-100 hover:border-purple-200 transition-all duration-200 group shadow-sm hover:shadow-md'>
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-purple-700 to-fuchsia-600 flex items-center justify-center shadow-sm'><Settings className='w-4 h-4 text-white' /></div>
                    <div className='text-left'><p className='text-sm font-bold text-purple-800'>Panel de Administracion</p><p className='text-xs text-purple-500'>Gestiona productos y mas</p></div>
                  </div>
                  <span className='text-purple-400 group-hover:translate-x-1 transition-transform text-lg'>&gt;</span>
                </button>
              )}
              {esCliente && (
                <button onClick={() => setVistaActual('catalogo')}
                  className='w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/80 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-200 transition-all duration-200 group shadow-sm hover:shadow-md'>
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-sm'><ShoppingBag className='w-4 h-4 text-white' /></div>
                    <div className='text-left'><p className='text-sm font-bold text-emerald-800'>Seguir Comprando</p><p className='text-xs text-emerald-500'>Explora el catalogo</p></div>
                  </div>
                  <span className='text-emerald-400 group-hover:translate-x-1 transition-transform text-lg'>&gt;</span>
                </button>
              )}
              <button onClick={handleLogout}
                className='w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100/80 hover:from-red-100 hover:to-rose-100 hover:border-red-200 transition-all duration-200 group shadow-sm hover:shadow-md'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-sm'><LogOut className='w-4 h-4 text-white' /></div>
                  <div className='text-left'><p className='text-sm font-bold text-red-700'>Cerrar Sesion</p><p className='text-xs text-red-400'>Desconectarse</p></div>
                </div>
                <span className='text-red-300 group-hover:translate-x-1 transition-transform text-lg'>&gt;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
