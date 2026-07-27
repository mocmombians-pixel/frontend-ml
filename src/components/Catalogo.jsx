import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import {
  Search, Filter, ShoppingCart, Info, AlertTriangle,
  Package, Tag, Truck, Sparkles
} from 'lucide-react';

export const Catalogo = ({setVistaActual,user,AddToCart}) =>{
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carga, setCarga] = useState([true]);
    const [error, setError] = useState('');

    //filtros 
    const [searchQuery, setSearchQuery] = useState('');
    const [selecionCategoria, setSelecionCategoria] = useState('Todos');

    useEffect(() => {
        const cargaDatosCatalogo = async()=>{
            setCarga(true);
            try{
                const datosProductos = await apiService.getProductos();
                setProductos(datosProductos);
                const datosCategorias = await apiService.getCategorias();
                setCategorias(datosCategorias);
            }catch(err){
                cargaDatosCatalogo();
                setError('Error en el servidor backend..' + err);
            }finally{
                setCarga(false);
            }
        }; cargaDatosCatalogo();
    },[]);

    //AGREGAR AL CARRITO

    const handleAddToCart = (producto) => {
        if (!user) {
        setVistaActual('login');
        return;
        }
        if (user.rol !== 'ROLE_CLIENTE') {
        alert('Solo los usuarios registrados con el rol de Cliente pueden realizar compras.');
        return;
        }
        AddToCart(producto);
    };

    const filtroProductos = productos.filter((producto)=>{
        const busqueda = 
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (producto.descripcion 
        && producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

        const busquedaCategorias =
        selecionCategoria === 'Todos' || 
        (producto.categoria && producto.categoria.nombre === selecionCategoria);    

        return busqueda && busquedaCategorias;
    
    });
    
    if(carga){
        return(
            <div className='flex flex-col items-center justify-center min-h-[60vh]'>
              <div className='relative'>
                <div className='w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin'></div>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Package className='w-6 h-6 text-purple-500 animate-pulse' />
                </div>
              </div>
              <p className='text-gray-500 mt-6 font-semibold text-sm tracking-wide'>
                Cargando productos...
              </p>
              <div className='flex gap-1.5 mt-3'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='w-2 h-2 bg-purple-500 rounded-full animate-bounce' style={{ animationDelay: `${i * 0.15}s` }}></div>
                ))}
              </div>
            </div>
        );
    }

    return(
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* ═══════ BANNER PRINCIPAL ═══════ */}
          <div className='relative bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-700 rounded-2xl p-8 sm:p-10 mb-10 text-white shadow-xl overflow-hidden'>
            {/* Mesh gradient overlay */}
            <div className='absolute inset-0 opacity-30'
              style={{
                backgroundImage: `
                  radial-gradient(circle at 15% 40%, rgba(139,92,246,0.35) 0%, transparent 50%),
                  radial-gradient(circle at 85% 30%, rgba(192,132,252,0.25) 0%, transparent 50%),
                  radial-gradient(circle at 50% 90%, rgba(217,70,239,0.15) 0%, transparent 40%)
                `
              }}
            />
            {/* Pattern dots */}
            <div className='absolute inset-0 opacity-5'
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />
            {/* Floating decorative shapes */}
            <div className='absolute -top-16 -right-16 w-72 h-72 bg-white/[0.04] rounded-full blur-3xl'></div>
            <div className='absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl'></div>
            <div className='hidden sm:block absolute top-8 right-16 w-3 h-3 bg-white/20 rounded-full animate-pulse' style={{ animationDuration: '3s' }}></div>
            <div className='hidden sm:block absolute bottom-8 right-32 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse' style={{ animationDuration: '2.5s', animationDelay: '1s' }}></div>

            <div className='relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
              <div className='max-w-xl'>
                <div className='inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-inner'>
                  <Sparkles className='w-3.5 h-3.5 text-purple-300' />
                  <span className='text-purple-200/80 text-[10px] font-bold uppercase tracking-[0.2em]'>Descubre productos exclusivos</span>
                </div>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight'>
                  <span className='bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 bg-clip-text text-transparent'>
                    Catálogo de Productos
                  </span>
                </h1>
                <p className='mt-3 text-purple-200/70 text-sm sm:text-base leading-relaxed font-light'>
                  Explora las mejores ofertas, productos de calidad y envíos garantizados
                  directamente por nuestros proveedores.
                </p>
                <div className='mt-5 flex flex-wrap gap-4'>
                  <div className='flex items-center gap-1.5 text-purple-200/60 text-xs'>
                    <Package className='w-3.5 h-3.5' />
                    <span className='font-semibold'>{productos.length}</span> productos
                  </div>
                  <div className='flex items-center gap-1.5 text-purple-200/60 text-xs'>
                    <Tag className='w-3.5 h-3.5' />
                    <span className='font-semibold'>{categorias.length}</span> categorías
                  </div>
                </div>
              </div>
              {/* Icono decorativo grande - solo visible en desktop */}
              <div className='hidden lg:flex items-center justify-center w-32 h-32 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-inner'>
                <ShoppingCart className='w-16 h-16 text-white/20' />
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className='bg-gradient-to-r from-amber-50 to-orange-50/80 text-amber-800 p-4 rounded-xl flex items-start gap-3 border border-amber-200/80 text-sm mb-6 shadow-sm'>
              <div className='p-1.5 bg-amber-100 rounded-lg flex-shrink-0'>
                <Info className='w-4 h-4 text-amber-600' />
              </div>
              <div>
                <span className='font-bold'>Aviso del Servidor:</span> {error}. Mostrando interfaz local.
                Asegúrate de iniciar la API en Spring Boot.
              </div>
            </div>
          )}

          {/* ═══════ BUSCADOR Y CONTENIDO ═══════ */}
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Sidebar */}
            <div className='w-full lg:w-72 flex-shrink-0 space-y-6'>
              {/* Busqueda */}
              <div className='bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md'>
                <div className='p-4 border-b border-gray-100/80'>
                  <h3 className='font-bold text-gray-700 text-xs uppercase tracking-[0.15em] flex items-center gap-2'>
                    <Search className='w-3.5 h-3.5 text-purple-600' /> Buscar Producto
                  </h3>
                </div>
                <div className='p-4'>
                  <div className='relative group'>
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-600/10 to-fuchsia-600/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300'></div>
                    <Search className='w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-purple-600 transition-all duration-300' />
                    <input
                      type='text'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder='Buscar nombre o descripción...'
                      className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600/40 focus:border-purple-500 text-sm transition-all duration-200 bg-white hover:border-gray-300'
                    />
                  </div>
                </div>
              </div>

              {/* Categorias */}
              <div className='bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md'>
                <div className='p-4 border-b border-gray-100/80'>
                  <h3 className='font-bold text-gray-700 text-xs uppercase tracking-[0.15em] flex items-center gap-2'>
                    <Filter className='w-3.5 h-3.5 text-purple-600' /> Categorías
                  </h3>
                </div>
                <div className='p-3'>
                  <div className='space-y-1'>
                    <button
                      onClick={() => setSelecionCategoria('Todos')}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        selecionCategoria === 'Todos'
                          ?'bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white shadow-md shadow-purple-300/50'
                          : 'text-gray-600 hover:bg-purple-100 hover:text-purple-800'
                      }`}
                    >
                      <Package className='w-4 h-4' />
                      Todas las categorías
                    </button>
                    {categorias.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelecionCategoria(cat.nombre)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                          selecionCategoria === cat.nombre
                            ? 'bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white shadow-md shadow-purple-300/50'
                            : 'text-gray-600 hover:bg-purple-100 hover:text-purple-800'
                      }`}
                      >
                        <Tag className='w-4 h-4' />
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Productos */}
            <div className='flex-1 min-w-0'>
              {/* Barra de resultado */}
              <div className='flex items-center justify-between mb-5 px-1'>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <Package className='w-4 h-4 text-purple-500' />
                  <span className='font-medium'>{filtroProductos.length}</span> producto{filtroProductos.length !== 1 ? 's' : ''} encontrado{filtroProductos.length !== 1 ? 's' : ''}
                  {selecionCategoria !== 'Todos' && (
                    <>
                      <span className='text-gray-300'>en</span>
                      <span className='inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-[11px] font-bold rounded-md'>
                        <Tag className='w-3 h-3' /> {selecionCategoria}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {filtroProductos.length === 0 ? (
                <div className='bg-white rounded-2xl border border-gray-200/80 shadow-sm p-12 sm:p-16 text-center'>
                  <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center mx-auto mb-5'>
                    <Search className='w-10 h-10 text-purple-300' />
                  </div>
                  <h3 className='text-xl font-black text-gray-700 mb-2'>Sin resultados</h3>
                  <p className='text-gray-400 text-sm max-w-xs mx-auto leading-relaxed'>
                    No encontramos productos con los filtros seleccionados. Intenta con otros términos.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelecionCategoria('Todos'); }}
                    className='mt-6 px-5 py-2.5 bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:from-violet-500 hover:to-purple-400 transition-all duration-200 shadow-md'
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                  {filtroProductos.map((producto) => {
                    const defaultImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300";
                    const isOutOfStock = producto.stock <= 0;

                    return (
                      <div
                        key={producto.id}
                        className='group bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-purple-300/50'
                      >
                        {/* Imagen */}
                        <div className='h-52 w-full bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden'>
                          <img
                            src={producto.imagenUrl || defaultImage}
                            alt={producto.nombre}
                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                            onError={(e) => {
                              e.target.src = defaultImage;
                            }}
                          />
                          {/* Overlay gradient en hover */}
                          <div className='absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                          {/* Categoria Badge */}
                          {producto.categoria && (
                            <span className='absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-purple-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-purple-200/50 transition-all duration-300 group-hover:bg-purple-800 group-hover:text-white group-hover:border-purple-700'>
                              <Tag className='w-3 h-3' />
                              {producto.categoria.nombre}
                            </span>
                          )}

                          {/* Stock Badge */}
                          <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm transition-all duration-300 ${
                            isOutOfStock
                              ? 'bg-red-50/90 text-red-600 border border-red-200/50'
                              : producto.stock <= 5
                                ? 'bg-amber-50/90 text-amber-600 border border-amber-200/50'
                                : 'bg-emerald-50/90 text-emerald-600 border border-emerald-200/50'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isOutOfStock ? 'bg-red-500' : producto.stock <= 5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                            }`}></span>
                            {isOutOfStock ? 'Agotado' : `${producto.stock} uds`}
                          </span>
                        </div>

                        {/* Cuerpo */}
                        <div className='p-5 flex-grow flex flex-col justify-between gap-3'>
                          <div className='space-y-2'>
                            {/* Proveedor */}
                            {producto.proveedor && (
                              <div className='flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold'>
                                <Truck className='w-3.5 h-3.5 text-purple-500' />
                                <span>{producto.proveedor.nombre || 'Proveedor'}</span>
                              </div>
                            )}

                            {/* Nombre */}
                            <h3 className='font-black text-gray-800 text-base leading-tight group-hover:text-purple-800 transition-colors duration-200 line-clamp-1'>
                              {producto.nombre}
                            </h3>

                            {/* Descripcion */}
                            <p className='text-gray-400 text-xs leading-relaxed line-clamp-2'>
                              {producto.descripcion || 'Sin descripción disponible.'}
                            </p>
                          </div>

                          {/* Precio y Boton */}
                          <div className='pt-1 space-y-3'>
                            <div className='flex items-end justify-between'>
                              <div>
                                <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider'>Precio</p>
                                <span className='font-black text-xl text-purple-900 tracking-tight'>
                                  ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              {!isOutOfStock && (
                                <div className='text-right'>
                                  <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-wider'>Stock</p>
                                  <span className={`text-sm font-bold ${producto.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {producto.stock} uds
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Boton */}
                            <button
                              onClick={() => handleAddToCart(producto)}
                              disabled={isOutOfStock}
                              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 cursor-pointer ${
                                isOutOfStock
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white shadow-md shadow-purple-300/50 hover:shadow-lg hover:shadow-purple-400/40 hover:from-violet-500 hover:to-purple-400 active:scale-[0.98]'
                              }`}
                            >
                              <ShoppingCart className='w-4 h-4' />
                              {!user ? 'Ingresa para comprar' : isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
    );

};