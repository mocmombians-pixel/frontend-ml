import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import {
  Package, ShoppingBag, Calendar, DollarSign, ChevronDown,
  CheckCircle2, Clock, XCircle, AlertTriangle, ShoppingCart, Sparkles
} from 'lucide-react';

export const ClienteDashboard = ({}) => {
  const [compras, setCompras] = useState([]);
  const [carga, setCarga] = useState(true);
  const [error, setError] = useState('');
  const [expandido, setExpandido] = useState(null);

  const nombre = apiService.getUsername();

  useEffect(() => {
    const cargarCompras = async () => {
      setCarga(true);
      try {
        const datos = await apiService.getMyPurchases();
        setCompras(datos || []);
      } catch (err) {
        setError('No se pudieron cargar tus compras: ' + err.message);
      } finally {
        setCarga(false);
      }
    };
    cargarCompras();
  }, []);

  // --- Métricas ---
  const totalGastado = compras.reduce((acc, v) => acc + (v.total || 0), 0);
  const totalCompras = compras.length;
  const comprasPagadas = compras.filter(v => v.estadoPago === 'PAGADO' || v.estadoPago === 'COMPLETADO').length;

  const toggleExpandido = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  if (carga) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <div className='relative'>
          <div className='w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <ShoppingBag className='w-6 h-6 text-purple-500 animate-pulse' />
          </div>
        </div>
        <p className='text-gray-500 mt-6 font-semibold text-sm tracking-wide'>Cargando tus compras...</p>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
      {/* ═══════ BANNER PRINCIPAL ═══════ */}
      <div className='relative bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-700 rounded-2xl p-8 text-white shadow-xl overflow-hidden'>
        <div className='absolute inset-0 opacity-30 pointer-events-none'
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.2) 0%, transparent 40%)
            `
          }}
        />
        <div className='absolute inset-0 opacity-5 pointer-events-none'
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        <div className='absolute -top-12 -right-12 w-64 h-64 bg-white/[0.04] rounded-full blur-2xl pointer-events-none'></div>
        <div className='absolute -bottom-16 -left-12 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none'></div>

        <div className='relative z-10'>
          <div className='inline-flex items-center gap-2.5 mb-4 px-3.5 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-inner'>
            <Sparkles className='w-3.5 h-3.5 text-purple-300' />
            <span className='text-purple-200/90 text-[11px] font-semibold uppercase tracking-[0.25em]'>Mi Cuenta</span>
          </div>
          <h1 className='text-4xl sm:text-5xl font-black leading-tight tracking-[-0.03em]'>
            <span className='bg-gradient-to-r from-white via-purple-100 to-fuchsia-200 bg-clip-text text-transparent'>
              ¡Hola, {nombre || 'Cliente'}!
            </span>
          </h1>
          <p className='mt-3 text-purple-200/70 text-sm sm:text-base max-w-xl leading-relaxed font-light'>
            Aquí puedes revisar el historial completo de tus compras y el estado de tus pedidos.
          </p>

          {/* Stats bar */}
          <div className='mt-6 flex flex-wrap gap-x-8 gap-y-3'>
            <div className='flex items-center gap-2 text-purple-200/60 text-xs'>
              <div className='p-1 bg-white/5 rounded-md'><ShoppingBag className='w-3.5 h-3.5' /></div>
              <span className='font-semibold'>{totalCompras}</span> compra{totalCompras !== 1 ? 's' : ''}
            </div>
            <div className='flex items-center gap-2 text-purple-200/60 text-xs'>
              <div className='p-1 bg-white/5 rounded-md'><DollarSign className='w-3.5 h-3.5' /></div>
              <span className='font-semibold'>${totalGastado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span> gastado
            </div>
            <div className='flex items-center gap-2 text-purple-200/60 text-xs'>
              <div className='p-1 bg-white/5 rounded-md'><CheckCircle2 className='w-3.5 h-3.5' /></div>
              <span className='font-semibold'>{comprasPagadas}</span> completadas
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='bg-gradient-to-r from-amber-50 to-orange-50/80 text-amber-800 p-4 rounded-xl flex items-start gap-3 border border-amber-200/80 text-sm shadow-sm'>
          <div className='p-1.5 bg-amber-100 rounded-lg flex-shrink-0'>
            <AlertTriangle className='w-4 h-4 text-amber-600' />
          </div>
          <div className='font-medium pt-0.5'>{error}</div>
        </div>
      )}

      {/* ═══════ LISTADO DE COMPRAS ═══════ */}
      <div>
        <div className='flex items-center gap-2 mb-5'>
          <Package className='w-4 h-4 text-purple-500' />
          <h2 className='text-xs font-bold text-gray-400 uppercase tracking-[0.15em]'>Historial de Compras</h2>
        </div>

        {compras.length === 0 ? (
          <div className='bg-white rounded-2xl border border-gray-200/80 shadow-sm p-12 sm:p-16 text-center'>
            <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center mx-auto mb-5'>
              <ShoppingCart className='w-10 h-10 text-purple-300' />
            </div>
            <h3 className='text-xl font-black text-gray-700 mb-2'>Aún no tienes compras</h3>
            <p className='text-gray-400 text-sm max-w-xs mx-auto leading-relaxed'>
              Cuando realices tu primera compra, aparecerá aquí con todos los detalles.
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {compras.map((venta) => (
              <CompraCard
                key={venta.id}
                venta={venta}
                expandido={expandido === venta.id}
                onToggle={() => toggleExpandido(venta.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Subcomponentes ---

const EstadoBadge = ({ estado }) => {
  const normalizado = (estado || '').toUpperCase();

  if (normalizado === 'PAGADO' || normalizado === 'COMPLETADO') {
    return (
      <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200/50'>
        <CheckCircle2 className='w-3.5 h-3.5' />
        Pagado
      </span>
    );
  }
  if (normalizado === 'PENDIENTE') {
    return (
      <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-full border border-amber-200/50'>
        <Clock className='w-3.5 h-3.5' />
        Pendiente
      </span>
    );
  }
  if (normalizado === 'CANCELADO' || normalizado === 'FALLIDO') {
    return (
      <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-[11px] font-bold rounded-full border border-red-200/50'>
        <XCircle className='w-3.5 h-3.5' />
        {normalizado === 'CANCELADO' ? 'Cancelado' : 'Fallido'}
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-full border border-gray-200/50'>
      <Clock className='w-3.5 h-3.5' />
      {estado || 'Sin estado'}
    </span>
  );
};

const CompraCard = ({ venta, expandido, onToggle }) => {
  const fecha = venta.fecha ? new Date(venta.fecha + 'T00:00:00').toLocaleDateString('es-MX', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) : '—';

  const detalles = venta.detalles || [];

  return (
    <div className='group bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-purple-200/60'>
      {/* Header clickeable */}
      <button
        onClick={onToggle}
        className='w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer'
      >
        <div className='flex items-center gap-4 min-w-0'>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-700 to-fuchsia-600 text-white flex items-center justify-center shadow-md flex-shrink-0'>
            <Package className='w-5 h-5' />
          </div>
          <div className='min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='font-black text-gray-800 text-sm'>Pedido #{venta.id}</span>
              <EstadoBadge estado={venta.estadoPago} />
            </div>
            <div className='flex items-center gap-1.5 text-gray-400 text-xs mt-1'>
              <Calendar className='w-3.5 h-3.5' />
              {fecha}
              <span className='text-gray-300'>•</span>
              {detalles.length} producto{detalles.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-4 flex-shrink-0'>
          <div className='text-right'>
            <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider'>Total</p>
            <span className='font-black text-lg text-purple-900'>
              ${Number(venta.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandido ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Detalle expandible */}
      {expandido && (
        <div className='border-t border-gray-100 bg-gray-50/50 p-5'>
          {detalles.length === 0 ? (
            <p className='text-sm text-gray-400 text-center py-4'>No hay detalles disponibles para este pedido.</p>
          ) : (
            <div className='space-y-2.5'>
              {detalles.map((det, i) => (
                <div key={i} className='flex items-center justify-between gap-4 bg-white rounded-xl p-3.5 border border-gray-100'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-9 h-9 rounded-lg bg-purple-50 overflow-hidden flex items-center justify-center flex-shrink-0'>
                      {det.producto?.imagenUrl ? (
                        <img
                          src={det.producto.imagenUrl}
                          alt={det.producto.nombre}
                          className='w-full h-full object-cover'
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <Package className={`w-4 h-4 text-purple-500 ${det.producto?.imagenUrl ? 'hidden' : 'flex'}`} />
                    </div>
                    <div className='min-w-0'>
                      <p className='font-semibold text-gray-800 text-sm truncate'>
                        {det.producto?.nombre || 'Producto'}
                      </p>
                      <p className='text-gray-400 text-xs'>
                        Cantidad: {det.cantidad || 1} × ${Number(det.precioUnitario || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <span className='font-bold text-gray-800 text-sm flex-shrink-0'>
                    ${Number(det.subtotal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};