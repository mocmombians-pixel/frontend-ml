import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiService } from '../services/apiService';
import { CreditCard, CheckCircle2, ShieldAlert, Loader2, Play, Package, Receipt, Sparkles, ShoppingBag  } from 'lucide-react';

// Clave pública de prueba de Stripe. Puede ser reemplazada por una clave real 'pk_test_...'
const stripePromise = loadStripe('pk_test_51TwjpBJWKf6A3saOKfDS3d8G6pC89bXzhlzs8xoOeQxPhQdDLFZsAGPuqKbVBKV13XbfdbbNkhNcRWrMx0wcIng500rCyM9oD7');

const PaymentForm = ({ venta, onPaymentSuccess, setCurrentTab }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [clientSecret, setClientSecret] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    // 1. Obtener el clientSecret del backend
    const getSecret = async () => {
      try {
        const res = await apiService.crearIntencionPago(venta.id);
        if (res && res.clientSecret) {
          setClientSecret(res.clientSecret);
        }
      } catch (err) {
        // Ignoramos el error en interfaz porque proveemos el simulador de respaldo
        console.warn('No se pudo inicializar Stripe. Se usará el simulador de pago.', err);
      }
    };
    if (venta && venta.id) {
      getSecret();
    }
  }, [venta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      setError('Stripe no está inicializado o la clave es incorrecta. Usa el Simulador de Pago abajo.');
      return;
    }

    setProcesando(true);
    setError('');

    try {
      // 2. Confirmar pago en Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
        setProcesando(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        // 3. Confirmar pago en nuestro Backend
        await apiService.confirmarPagoVenta(venta.id);
        onPaymentSuccess();
      }
    } catch (err) {
      setError(err.message || 'Error de conexión durante el pago.');
      setProcesando(false);
    }
  };

  // Simulador de pago para pruebas rápidas o si no hay conexión/claves reales
  const handleSimulatePayment = async () => {
    setSimulating(true);
    setError('');
    try {
      await apiService.confirmarPagoVenta(venta.id);
      onPaymentSuccess();
    } catch (err) {
      setError('Error al conectar con la API local para simular el pago.');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 text-red-700 p-4 rounded-xl flex items-start gap-2.5 border border-red-200/80 text-sm shadow-sm">
          <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Formulario Stripe */}
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-50/50 to-fuchsia-50/30 p-5 rounded-2xl border border-purple-100/70 space-y-4">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <CreditCard className='w-4 h-4 text-purple-600' />
          Tarjeta de Crédito o Débito
        </label>
        <div className="bg-white p-4 rounded-xl border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1f2937',
                '::placeholder': { color: '#9ca3af' },
              },
            }
          }} />
        </div>

        <button
          type="submit"
          disabled={!stripe || procesando || !clientSecret}
          className="w-full bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-violet-500 hover:to-purple-400 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-300/50 hover:shadow-lg hover:shadow-purple-400/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
        >
          {procesando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Procesando pago con Stripe...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" /> Pagar Ahora (${venta.total.toFixed(2)} MXN)
            </>
          )}
        </button>
      </form>

      {/* Separador */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
        <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">O de Respaldo</span>
      </div>

      {/* Simulador */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 rounded-2xl p-5 border border-amber-200/80 space-y-3 shadow-sm">
        <div className="flex items-start gap-2.5">
          <div className='p-1.5 bg-amber-100 rounded-lg flex-shrink-0'>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-800">Simulador de Pago de Pruebas</h4>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Si estás usando las claves de Stripe por defecto o si no tienes internet, puedes simular una transacción exitosa para actualizar la base de datos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={simulating}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-sm"
        >
          {simulating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Simulando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Simular Pago Exitoso (Recomendado para Pruebas)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
//export const CheckoutForm = ({ ventaActiva, setCurrentTab }) => {
  export const CheckoutForm = ({ ventaActiva, setVistaActual }) => {
  const [pagado, setPagado] = useState(false);

if (!ventaActiva) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl p-10 border border-gray-200/80 text-center shadow-sm">
        <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center mx-auto mb-5'>
          <ShoppingBag className="w-10 h-10 text-purple-300" />
        </div>
        <h3 className="font-black text-lg text-gray-800">No hay ninguna venta activa</h3>
        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Regresa al catálogo y añade productos para realizar el pago.</p>
        <button
          onClick={() => setVistaActual('catalogo')}
          className="mt-5 bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-violet-500 hover:to-purple-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer shadow-md transition-all duration-200"
        >
          Ver Catálogo
        </button>
      </div>
    );
  }

  const handlePaymentSuccess = () => {
    setPagado(true);
  };

  if (pagado) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl overflow-hidden border border-gray-100 text-center shadow-xl">
        {/* Header con gradiente y check */}
        <div className='relative bg-gradient-to-br from-emerald-600 to-teal-500 p-8 overflow-hidden'>
          <div className='absolute inset-0 opacity-20 pointer-events-none'
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />
          <div className='relative z-10 w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto shadow-lg'>
            <CheckCircle2 className="w-11 h-11 text-white" />
          </div>
          <h2 className="relative z-10 text-2xl font-black text-white mt-4">¡Pago Exitoso!</h2>
          <p className="relative z-10 text-sm text-emerald-50/90 mt-1">Tu orden #{ventaActiva.id} ha sido procesada correctamente.</p>
        </div>

        <div className='p-6 space-y-5'>
          <div className="bg-gradient-to-br from-purple-50/50 to-fuchsia-50/30 p-4 rounded-xl text-left text-xs text-gray-600 border border-purple-100/70 space-y-2">
            <div className='flex justify-between items-center'>
              <span className="font-bold text-gray-500 flex items-center gap-1.5"><Receipt className='w-3.5 h-3.5' />Total Pagado</span>
              <span className='font-black text-purple-900 text-sm'>${ventaActiva.total.toFixed(2)} MXN</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className="font-bold text-gray-500">Estado</span>
              <span className='inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-[10px]'>
                <CheckCircle2 className='w-3 h-3' /> PAGADO
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className="font-bold text-gray-500">Cliente</span>
              <span className='font-semibold text-gray-700'>{ventaActiva.cliente?.nombre || 'Demo'}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setVistaActual('miscompras')}
              className="flex-1 bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-violet-500 hover:to-purple-400 text-white py-3 rounded-xl text-sm font-bold shadow-md transition-all duration-200 cursor-pointer"
            >
              Ver Mis Compras
            </button>
            <button
              onClick={() => setVistaActual('catalogo')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

 return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* ═══════ HEADER CON GRADIENTE ═══════ */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-700 px-6 py-7 text-white text-center overflow-hidden">
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

        <div className='relative z-10'>
          <div className='inline-flex items-center gap-1.5 mb-2.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10'>
            <Sparkles className='w-3 h-3 text-purple-200' />
            <span className='text-purple-200/90 text-[10px] font-bold uppercase tracking-[0.15em]'>Pago Seguro</span>
          </div>
          <h2 className="text-xl font-black">Checkout de Venta</h2>
          <p className="text-purple-200/70 mt-1 text-xs">Completa tu pago para la orden #{ventaActiva.id}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Resumen Venta */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-gray-700 text-xs uppercase tracking-wider">
            <Package className='w-3.5 h-3.5 text-purple-500' />
            Resumen del Pedido
          </h3>
          <div className="bg-gradient-to-br from-purple-50/50 to-fuchsia-50/30 p-4 rounded-xl border border-purple-100/70 text-sm space-y-2">
            {ventaActiva.detalles.map((det, idx) => (
              <div key={idx} className="flex justify-between text-gray-700 text-xs">
                <span>
                  {det.producto?.nombre || `Producto #${det.producto?.id}`} <span className='text-gray-400'>(x{det.cantidad})</span>
                </span>
                <span className="font-bold text-gray-800">${(det.precioUnitario * det.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-purple-200/60 pt-2.5 flex justify-between items-center font-black text-purple-900">
              <span className='text-sm'>Total a Cobrar</span>
              <span className='text-lg'>${ventaActiva.total.toFixed(2)} <span className='text-xs font-bold text-gray-400'>MXN</span></span>
            </div>
          </div>
        </div>

        {/* Formulario Stripe Provider */}
        <Elements stripe={stripePromise}>
          <PaymentForm 
            venta={ventaActiva} 
            onPaymentSuccess={handlePaymentSuccess} 
           // setCurrentTab={setCurrentTab} 
          />
        </Elements>
      </div>
    </div>
  );
};