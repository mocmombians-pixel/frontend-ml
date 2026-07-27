import React from 'react';
import { apiService } from '../services/apiService';
import { ShoppingCart, LogOut, User, ListOrdered, ShoppingBag, Sparkles } from 'lucide-react';

export const Navbar = ({ vistaActual, setVistaActual, user, onLogout, cartCount, openCart }) => {
  const handleLogout = () => {
    apiService.logout();
    onLogout();
    setVistaActual('catalogo');
  };

  const isCliente = user && user.rol === 'ROLE_CLIENTE';
  const isAdmin = user && user.rol === 'ROLE_ADMIN';

   

  return (
    <nav className='sticky top-0 z-50 bg-gradient-to-r from-purple-950 via-purple-900 to-fuchsia-950 text-white shadow-lg border-b border-purple-800/30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          
          <div
            className='flex items-center gap-2 cursor-pointer group'
            onClick={() => setVistaActual('catalogo')}
          >
            <div className='p-1.5 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-xl shadow-lg shadow-purple-800/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3'>
              <ShoppingBag className='h-5 w-5 text-white' />
            </div>
            <span className='font-black text-lg tracking-tight'>Mercadito<span className='text-fuchsia-400'>Libre</span></span>
          </div>

          <div className='flex items-center gap-1'>
            <button
           onClick={() => setVistaActual('catalogo')}
           className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
             vistaActual === 'catalogo'
               ? 'bg-white/15 text-white shadow-sm'
               : 'text-purple-200/70 hover:bg-white/10 hover:text-white'
           }`}>
              <ShoppingBag className='w-3.5 h-3.5 inline-block mr-1.5' />
              Catálogo
            </button>

            {isCliente && (
              <button
           onClick={() => setVistaActual('miscompras')}
           className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
             vistaActual === 'miscompras'
               ? 'bg-white/15 text-white shadow-sm'
               : 'text-purple-200/70 hover:bg-white/10 hover:text-white'
           }`}>
                <ListOrdered className='w-3.5 h-3.5 inline-block mr-1.5' />
                 Mis Compras
              </button>
            )}

            {isAdmin && (
              <button
           onClick={() => setVistaActual('admin-panel')}
           className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
             vistaActual === 'admin-panel'
               ? 'bg-white/15 text-white shadow-sm'
               : 'text-purple-200/70 hover:bg-white/10 hover:text-white'
           }`}>
                <Sparkles className='w-3.5 h-3.5 inline-block mr-1.5' />
                 Admin Panel
              </button>
            )}

            <div className='w-px h-6 bg-purple-700/30 mx-1.5'></div>

              {user ? (<>

    <button
      onClick={() => setVistaActual('perfil')}
      className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer hover:bg-white/10 text-purple-200/70 hover:text-white'
      title='Mi Perfil'>
      <User className='w-4 h-4' />
      <span className='max-w-[100px] truncate'>{user.nombre}</span>
    </button>

           {isCliente && (
        <button onClick={openCart}
        className='relative p-2 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer group'>
            <ShoppingCart className='w-5 h-5 text-purple-200/70 group-hover:text-white' />
            {cartCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-rose-600
                text-white rounded-full text-[10px] w-5 h-5
                flex items-center justify-center font-black border-2 border-purple-900 shadow-lg animate-bounce'>
                {cartCount}
                </span>
            )}
        </button>
            )}

            <button
            onClick={handleLogout}
            className='p-2 rounded-xl hover:bg-red-500/20 hover:text-red-300
            transition-all duration-200 cursor-pointer text-purple-200/70'
            title='Cerrar Sesión'>
            <LogOut className='w-5 h-5' />
        </button>
                 
            </>
            ):(<>
              <button onClick={() => setVistaActual('login')}
              className='px-3.5 py-2 rounded-xl text-sm font-bold
              transition-all duration-200 cursor-pointer text-purple-200/70 hover:bg-white/10 hover:text-white'>
                Iniciar Sesión
              </button>
              <button onClick={() => setVistaActual('register')}
              className='px-4 py-2 rounded-xl text-sm font-bold
              bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400
              text-white transition-all duration-200 shadow-lg shadow-purple-800/30 hover:shadow-xl hover:shadow-purple-700/40'>
                Registrarse
              </button>
            
            </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};