import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import {X, ShoppingBasket, Trash2, Plus, Minus, CreditCard, Loader2, AlertCircle} from 'lucide-react';

export const Cart = ({isOpen, onClose, cart, updateQuantity, removeFromCart, clearCart, onCheckout,
    setVistaActual, setVentaActiva}) => {

        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        if (!isOpen) return null;

        const total = cart.reduce((sum, item) => sum + item.producto.precio
        * item.cantidad, 0);

        const handleCheckout = async() => {
            setLoading(true);
            setError('');

            //mapeo de los datos para venta y detalle venta 
            const ventaPayload ={
                detalles: cart.map(item => ({
                    producto: {id: item.producto.id},
                    cantidad: item.cantidad
                }))

            };
            //funcion de registro de venta 
            try{
                const ventaRegistrada = await apiService.procesarVenta(ventaPayload);
                setVentaActiva(ventaRegistrada);
                clearCart();
                onClose();
                setVistaActual('checkout');
            }catch(err){
                setError(err.message || 'Error al procesar la compra.');
            }finally{
                setLoading(false);
            
            }
        
        
        };
       return(
            <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo Traslúcido */}
      <div 
        className="absolute inset-0 bg-purple-950/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* ═══════ CABECERA CON GRADIENTE ═══════ */}
          <div className="relative px-6 py-6 bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-700 text-white overflow-hidden flex-shrink-0">
            <div className='absolute inset-0 opacity-30 pointer-events-none'
              style={{
                backgroundImage: `
                  radial-gradient(circle at 15% 30%, rgba(139,92,246,0.4) 0%, transparent 50%),
                  radial-gradient(circle at 85% 70%, rgba(192,132,252,0.3) 0%, transparent 50%)
                `
              }}
            />
            <div className='absolute inset-0 opacity-5 pointer-events-none'
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />
            <div className='absolute -top-10 -right-10 w-40 h-40 bg-white/[0.04] rounded-full blur-2xl pointer-events-none'></div>

            <div className='relative z-10 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg'>
                  <ShoppingBasket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black leading-tight">Mi Carrito</h2>
                  {cart.length > 0 && (
                    <p className='text-purple-200/70 text-[11px] font-semibold'>
                      {cart.length} producto{cart.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              <button
                type='button'
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="flex-1 py-6 overflow-y-auto px-6 space-y-4">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 text-red-700 p-4 rounded-xl text-xs border border-red-200/80 flex items-start gap-2.5 shadow-sm">
                <AlertCircle className='w-4 h-4 flex-shrink-0 mt-0.5' />
                <span>{error}</span>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center mx-auto'>
                  <ShoppingBasket className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="font-black text-gray-800 text-base">Tu carrito está vacío</h3>
                <p className="text-gray-400 text-xs px-6 leading-relaxed">Explora el catálogo y añade algunos productos para comenzar tu compra.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div 
                    key={item.producto.id} 
                    className="flex items-center gap-4 p-3.5 bg-white rounded-xl border border-gray-200/80 shadow-sm relative group transition-all duration-200 hover:shadow-md hover:border-purple-200/60"
                  >
                    <img 
                      src={item.producto.imagenUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=150"} 
                      alt={item.producto.nombre} 
                      className="w-16 h-16 object-cover rounded-xl bg-gray-100 border border-gray-100 flex-shrink-0" 
                    />
                    
                    <div className="flex-grow space-y-1 min-w-0">
                      <h4 className="font-black text-sm text-gray-800 line-clamp-1">{item.producto.nombre}</h4>
                      {item.producto.categoria?.nombre && (
                        <span className='inline-flex px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md border border-purple-100/50'>
                          {item.producto.categoria.nombre}
                        </span>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Controles de Cantidad */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                          <button 
                            type='button'
                            onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                            className="p-1 px-2 hover:bg-purple-100 hover:text-purple-700 text-gray-500 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-black text-gray-800">{item.cantidad}</span>
                          <button 
                            type='button'
                            onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                            className="p-1 px-2 hover:bg-purple-100 hover:text-purple-700 text-gray-500 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subtotal del Item */}
                        <span className="font-black text-sm text-purple-900">
                          ${(item.producto.precio * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Botón Eliminar */}
                    <button 
                      type='button'
                      onClick={() => removeFromCart(item.producto.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pie de Carrito con Totalizadores */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-6 bg-gradient-to-b from-gray-50/50 to-gray-50 space-y-4 flex-shrink-0">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className='font-semibold text-gray-700'>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-bold">Gratis</span>
                </div>
                <div className="flex justify-between items-center text-base font-black text-gray-900 border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span className='text-xl text-purple-900'>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className='text-xs font-bold text-gray-400'>MXN</span></span>
                </div>
              </div>

              {/* Botón de Pago */}
              <button
                type='button'
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-violet-500 hover:to-purple-400 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-300/50 hover:shadow-lg hover:shadow-purple-400/40 transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Procesando Compra...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" /> Proceder al Pago
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

        );
  





    };

