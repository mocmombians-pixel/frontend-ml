import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import {
  DollarSign, ShoppingBag, Package, Tags, Users,
  AlertTriangle, Search, X, Clock, ShieldAlert,
  ShoppingCart, BarChart3, Building2, Eye, Info, Phone, Mail, MapPin, Tag, UserPlus
} from 'lucide-react';

export const AdminDashboard = ({}) => {
  // --- Estado del componente ---
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
   const [admins, setAdmins] = useState([]);
  const [carga, setCarga] = useState(true);
  const [error, setError] = useState('');
  const [tabActiva, setTabActiva] = useState('productos');
  const [busqueda, setBusqueda] = useState('');

  // --- Carga inicial de datos ---
  useEffect(() => {
    const cargarDatos = async () => {
      setCarga(true);
      try {
        const [datosProductos, datosCategorias, datosProveedores, datosClientes, datosVentas, datosAdmins] =
          await Promise.all([
            apiService.getProductos(),
            apiService.getCategorias(),
            apiService.getProveedores(),
            apiService.getClientes(),
            apiService.getVentas(),
            apiService.getAdmins(),
          ]);
        setProductos(datosProductos || []);
        setCategorias(datosCategorias || []);
        setProveedores(datosProveedores || []);
        setClientes(datosClientes || []);
        setVentas(datosVentas || []);
        setAdmins(datosAdmins || []);
      } catch (err) {
        setError('Error al cargar los datos del panel: ' + err.message);
      } finally {
        setCarga(false);
      }
    };
    cargarDatos();
  }, []);

  // --- Métricas del panel ---
  const totalRecaudado = ventas.reduce((acc, v) => acc + (v.total || 0), 0);
  const ordenesTotales = ventas.length;
  const productosActivos = productos.filter(p => p.stock > 0).length;
  const totalCategorias = categorias.length;
  const totalProveedores = proveedores.length;

  // --- Filtros de búsqueda ---
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const clientesFiltrados = clientes.filter(c =>
    (c.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const proveedoresFiltrados = proveedores.filter(p =>
    (p.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.telefono || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const categoriasFiltradas = categorias.filter(c =>
    (c.nombre || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const ventasFiltradas = ventas.filter(v =>
    (v.cliente?.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (v.estadoPago || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- Estado del modal CRUD ---
  const [modal, setModal] = useState({ open: false, type: null, mode: null, data: null });
  // modal.type = 'producto' | 'proveedor' | 'categoria'
  // modal.mode = 'crear' | 'editar'
  const [formData, setFormData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: null, id: null, nombre: '' });
  //nueva liena
  const [detalle, setDetalle] = useState({ open: false, type: null, data: null });
  const [guardando, setGuardando] = useState(false);

  // --- Estado para "Registrar Usuario" (solo Admin) ---
  const [registroForm, setRegistroForm] = useState({
    nombre: '', username: '', password: '', rol: 'ROLE_CLIENTE', telefono: '', direccion: ''
  });
  const [registroError, setRegistroError] = useState('');
  const [registroSuccess, setRegistroSuccess] = useState('');
  const [registrando, setRegistrando] = useState(false);

  const handleRegistroChange = (e) => {
    setRegistroForm({ ...registroForm, [e.target.name]: e.target.value });
  };

  const handleRegistrarUsuario = async (e) => {
    e.preventDefault();
    setRegistroError('');
    setRegistroSuccess('');
    setRegistrando(true);
    try {
      const payload = {
        username: registroForm.username,
        password: registroForm.password,
        nombre: registroForm.nombre,
        rol: registroForm.rol,
        telefono: registroForm.telefono || null,
        direccion: registroForm.direccion || null,
      };
     /* await apiService.registrarUsuarioAdmin(payload);
      setRegistroSuccess(`¡${registroForm.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'} registrado con éxito!`);
      setRegistroForm({ nombre: '', username: '', password: '', rol: 'ROLE_CLIENTE', telefono: '', direccion: '' });
      const nuevosClientes = await apiService.getClientes();
      setClientes(nuevosClientes || []);*/

      await apiService.registrarUsuarioAdmin(payload);
      setRegistroSuccess(`¡${registroForm.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'} registrado con éxito!`);
      setRegistroForm({ nombre: '', username: '', password: '', rol: 'ROLE_CLIENTE', telefono: '', direccion: '' });
      const [nuevosClientes, nuevosAdmins] = await Promise.all([
        apiService.getClientes(),
        apiService.getAdmins(),
      ]);
      setClientes(nuevosClientes || []);
      setAdmins(nuevosAdmins || []);


    } catch (err) {
      setRegistroError(err.message || 'Error al registrar el usuario.');
    } finally {
      setRegistrando(false);
    }
  };

  // --- Funciones CRUD ---
  const abrirModalCrear = (tipo) => {
    setError('');
    const vacio = tipo === 'producto'
      ? { nombre: '', descripcion: '', precio: '', stock: '', imagenUrl: '', categoriaId: '', proveedorId: '' }
      : tipo === 'proveedor'
        ? { nombre: '', telefono: '', email: '', direccion: '' }
        : { nombre: '' };
    setFormData(vacio);
    setModal({ open: true, type: tipo, mode: 'crear', data: null });
  };

  const abrirModalEditar = (tipo, item) => {
    setError('');
    const data = tipo === 'producto'
      ? {
          nombre: item.nombre || '',
          descripcion: item.descripcion || '',
          precio: item.precio || '',
          stock: item.stock || '',
          imagenUrl: item.imagenUrl || '',
          categoriaId: item.categoria?.id || '',
          proveedorId: item.proveedor?.id || ''
        }
      : tipo === 'proveedor'
        ? { nombre: item.nombre || '', telefono: item.telefono || '', email: item.email || '', direccion: item.direccion || '' }
        : { nombre: item.nombre || '' };
    setFormData(data);
    setModal({ open: true, type: tipo, mode: 'editar', data: item });
  };

  const cerrarModal = () => {
    setModal({ open: false, type: null, mode: null, data: null });
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      if (modal.type === 'producto') {
        const payload = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
          imagenUrl: formData.imagenUrl,
          categoria: formData.categoriaId ? { id: parseInt(formData.categoriaId) } : null,
          proveedor: formData.proveedorId ? { id: parseInt(formData.proveedorId) } : null
        };
        if (modal.mode === 'crear') {
          await apiService.crearProducto(payload);
        } else {
          await apiService.actualizarProducto(modal.data.id, payload);
        }
      } else if (modal.type === 'proveedor') {
        const payload = {
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email,
          direccion: formData.direccion
        };
        if (modal.mode === 'crear') {
          await apiService.crearProveedores(payload);
        } else {
          await apiService.actualizarProveedores(modal.data.id, payload);
        }
      } else if (modal.type === 'categoria') {
        const payload = { nombre: formData.nombre };
        if (modal.mode === 'crear') {
          await apiService.crearCategorias(payload);
        } else {
          await apiService.actualizarCategorias(modal.data.id, payload);
        }
      }
      setError('');
      cerrarModal();
      const nuevos = await Promise.all([
        apiService.getProductos(),
        apiService.getCategorias(),
        apiService.getProveedores()
      ]);
      setProductos(nuevos[0] || []);
      setCategorias(nuevos[1] || []);
      setProveedores(nuevos[2] || []);
    } catch (err) {
      setError('Error al guardar: ' + (err.message || 'Intenta de nuevo.'));
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    try {
      if (confirmDelete.type === 'producto') {
        await apiService.eliminarProducto(confirmDelete.id);
      } else if (confirmDelete.type === 'proveedor') {
        await apiService.eliminarProveedores(confirmDelete.id);
      } else if (confirmDelete.type === 'categoria') {
        await apiService.eliminarCategorias(confirmDelete.id);
      }
      setConfirmDelete({ open: false, type: null, id: null, nombre: '' });
      const nuevos = await Promise.all([
        apiService.getProductos(),
        apiService.getCategorias(),
        apiService.getProveedores()
      ]);
      setProductos(nuevos[0] || []);
      setCategorias(nuevos[1] || []);
      setProveedores(nuevos[2] || []);
    } catch (err) {
      setError('Error al eliminar: ' + (err.message || 'Intenta de nuevo.'));
      setConfirmDelete({ open: false, type: null, id: null, nombre: '' });
    }
  };

  // --- Estado de carga (skeleton) ---
  if (carga) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
        <div className='rounded-2xl p-8 bg-gradient-to-r from-purple-800/60 to-violet-600/60 animate-pulse'>
          <div className='h-9 w-72 bg-white/20 rounded-lg'></div>
          <div className='h-5 w-96 bg-white/20 rounded-lg mt-3'></div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 animate-pulse'>
              <div className='w-14 h-14 rounded-xl bg-gray-200'></div>
              <div className='flex-1 space-y-2'>
                <div className='h-3 w-24 bg-gray-200 rounded'></div>
                <div className='h-6 w-32 bg-gray-200 rounded'></div>
              </div>
            </div>
          ))}
        </div>
        <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse'>
          <div className='flex gap-1 px-5 py-4 border-b border-gray-200'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-4 w-28 bg-gray-200 rounded'></div>
            ))}
          </div>
          <div className='p-6 space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex gap-4'>
                <div className='h-4 w-16 bg-gray-100 rounded'></div>
                <div className='h-4 w-32 bg-gray-100 rounded'></div>
                <div className='h-4 w-24 bg-gray-100 rounded'></div>
                <div className='h-4 w-20 bg-gray-100 rounded'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
      {/* ═══════ BANNER PRINCIPAL ═══════ */}
      <div className='relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-700 rounded-2xl p-8 text-white shadow-xl overflow-hidden'>
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.2) 0%, transparent 40%)
            `
          }}
        />
        {/* Pattern dots */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        {/* Floating decorative shapes */}
        <div className='absolute -top-12 -right-12 w-64 h-64 bg-white/[0.04] rounded-full blur-2xl animate-ping' style={{ animationDuration: '4s' }}></div>
        <div className='absolute -bottom-16 -left-12 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl'></div>
        <div className='absolute top-6 right-32 w-3 h-3 bg-white/30 rounded-full animate-pulse' style={{ animationDuration: '2s' }}></div>
        <div className='absolute bottom-8 right-20 w-2 h-2 bg-purple-300/40 rounded-full animate-pulse' style={{ animationDuration: '3s', animationDelay: '1s' }}></div>

        <div className='relative z-10'>
          {/* Badge superior */}
          <div className='inline-flex items-center gap-2.5 mb-4 px-3.5 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-inner'>
            <div className='p-1 bg-purple-500/30 rounded-md'>
              <ShieldAlert className='w-3.5 h-3.5 text-purple-200' />
            </div>
            <span className='text-purple-200/90 text-[11px] font-semibold uppercase tracking-[0.25em]'>Panel de Control</span>
          </div>

          {/* Título principal */}
          <h1 className='text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.03em] bg-gradient-to-r from-white via-purple-100 via-pink-100 to-indigo-200 bg-clip-text text-transparent' style={{textShadow: '0 2px 15px rgba(0,0,0,0.2)'}}>
            Administración
          </h1>

          {/* Línea decorativa */}
          <div className='mt-4 w-20 h-1 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full'></div>

          {/* Subtítulo */}
          <p className='mt-5 text-purple-200/70 text-sm sm:text-base max-w-2xl leading-relaxed font-light tracking-wide'>
            Resumen general de tu tienda. Controla productos, gestiona clientes y supervisa
            el rendimiento de tu negocio desde un solo lugar.
          </p>

          {/* Stats bar */}
          <div className='mt-7 flex flex-wrap gap-x-8 gap-y-3'>
            <div className='flex items-center gap-2.5 text-purple-200/70 text-xs font-medium'>
              <span className='relative flex w-2 h-2'>
                <span className='absolute inline-flex w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping'></span>
                <span className='relative inline-flex w-2 h-2 bg-emerald-400 rounded-full'></span>
              </span>
              Sistema activo
            </div>
            <div className='flex items-center gap-2 text-purple-200/60 text-xs'>
              <div className='p-1 bg-white/5 rounded-md'>
                <ShoppingCart className='w-3 h-3' />
              </div>
              <span className='font-medium'>{productos.length}</span> productos
            </div>
            <div className='flex items-center gap-2 text-purple-200/60 text-xs'>
              <div className='p-1 bg-white/5 rounded-md'>
                <Building2 className='w-3 h-3' />
              </div>
              <span className='font-medium'>{proveedores.length}</span> proveedores
            </div>
            <div className='flex items-center gap-2 text-purple-200/60 text-xs'>
              <div className='p-1 bg-white/5 rounded-md'>
                <Users className='w-3 h-3' />
              </div>
              <span className='font-medium'>{clientes.length}</span> clientes
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className='bg-gradient-to-r from-amber-50 to-orange-50/80 text-amber-800 p-4 rounded-xl flex items-start gap-3 border border-amber-200/80 text-sm shadow-sm'>
          <div className='p-1.5 bg-amber-100 rounded-lg flex-shrink-0'>
            <AlertTriangle className='w-4 h-4 text-amber-600' />
          </div>
          <div className='font-medium pt-0.5'>{error}</div>
        </div>
      )}

      {/* ═══════ TARJETAS DE RESUMEN ═══════ */}
      <div>
        <div className='flex items-center gap-2 mb-5'>
          <BarChart3 className='w-4 h-4 text-purple-500' />
          <h2 className='text-xs font-bold text-gray-400 uppercase tracking-[0.15em]'>Resumen del Panel</h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
          <TarjetaResumen
            icono={<DollarSign className='w-7 h-7' />}
            titulo='Total Recaudado'
            valor={`$${totalRecaudado.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`}
            color='from-purple-800 to-purple-700'
            border='hover:border-purple-300'
          />
          <TarjetaResumen
            icono={<ShoppingBag className='w-7 h-7' />}
            titulo='Órdenes Totales'
            valor={ordenesTotales}
            color='from-violet-600 to-violet-500'
            border='hover:border-violet-300'
          />
          <TarjetaResumen
            icono={<Package className='w-7 h-7' />}
            titulo='Productos Activos'
            valor={productosActivos}
            color='from-fuchsia-600 to-fuchsia-500'
            border='hover:border-fuchsia-300'
          />
          <TarjetaResumen
            icono={<Building2 className='w-7 h-7' />}
            titulo='Proveedores'
            valor={totalProveedores}
            color='from-cyan-600 to-cyan-500'
            border='hover:border-cyan-300'
          />
          <TarjetaResumen
            icono={<Tags className='w-7 h-7' />}
            titulo='Categorías'
            valor={totalCategorias}
            color='from-indigo-600 to-indigo-500'
            border='hover:border-indigo-300'
          />
        </div>
      </div>

      {/* ═══════ PANEL DE TABS ═══════ */}
      <div className='bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md'>
        {/* Barra de Tabs */}
        <div className='flex border-b border-gray-100 bg-gray-50/30 px-1 pt-1 relative'>
          <TabBoton
            activa={tabActiva === 'productos'}
            onClick={() => { setTabActiva('productos'); setBusqueda(''); }}
            icono={<Package className='w-4 h-4' />}
            label='Gestión Productos'
          />
          <TabBoton
            activa={tabActiva === 'ventas'}
         
            onClick={() => { setTabActiva('ventas'); setBusqueda(''); }}
            icono={<ShoppingBag className='w-4 h-4' />}
            label='Registro Ventas'
            
          />
          <TabBoton
            activa={tabActiva === 'proveedores'}
            onClick={() => { setTabActiva('proveedores'); setBusqueda(''); }}
            icono={<Building2 className='w-4 h-4' />}
            label='Proveedores'
          />
          <TabBoton
            activa={tabActiva === 'categorias'}
            onClick={() => { setTabActiva('categorias'); setBusqueda(''); }}
            icono={<Tags className='w-4 h-4' />}
            label='Categorías'
          />
          <TabBoton
            activa={tabActiva === 'clientes'}
            onClick={() => { setTabActiva('clientes'); setBusqueda(''); }}
            icono={<Users className='w-4 h-4' />}
            label='Gestión Clientes'
          />
          <TabBoton
            activa={tabActiva === 'registrar'}
            onClick={() => { setTabActiva('registrar'); setBusqueda(''); }}
            icono={<UserPlus className='w-4 h-4' />}
            label='Registrar Usuario'
          />
        </div>

        <div className='p-6'>
          {/* Buscador */}
             {tabActiva !== 'registrar' &&  (
            <div className='relative mb-6 max-w-md group'>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300'></div>
              <Search className='w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-all duration-300' />
              <input
                type='text'
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={tabActiva === 'productos' ? 'Buscar producto por nombre...' : tabActiva === 'proveedores' ? 'Buscar proveedor por nombre o email...' : tabActiva === 'categorias' ? 'Buscar categoría por nombre...' : tabActiva === 'ventas' ? 'Buscar venta por cliente o estado...' : 'Buscar cliente por nombre o correo...'}
                className='w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 text-sm transition-all duration-200 bg-white hover:border-gray-300'
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className='absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-all'
                >
                  <X className='w-3.5 h-3.5' />
                </button>
              )}
            </div>
          )}

          {/* Tabla de Proveedores */}
          {tabActiva === 'proveedores' && (
            <div>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Building2 className='w-4 h-4 text-purple-500' />
                  <span className='text-sm font-bold text-gray-700'>
                    Proveedores <span className='text-gray-400 font-normal'>({proveedoresFiltrados.length})</span>
                  </span>
                </div>
                <button onClick={() => abrirModalCrear('proveedor')}
                  className='flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:from-cyan-500 hover:to-teal-400 transition-all duration-200 shadow-md'>
                  <span className='text-lg leading-none'>+</span> Nuevo
                </button>
              </div>
              <TablaGenerica
                columnas={['ID', 'Nombre', 'Teléfono', 'Email', 'Dirección', 'Acciones']}
                filas={proveedoresFiltrados.map(p => [
                  <span className='font-mono text-gray-400 text-xs'>#{p.id}</span>,
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0'>
                      {(p.nombre || '?').charAt(0).toUpperCase()}
                    </div>
                    <span className='font-semibold text-gray-800'>{p.nombre || '—'}</span>
                  </div>,
                  <span className='text-gray-500 text-sm'>{p.telefono || '—'}</span>,
                  <a href={`mailto:${p.email}`} className='text-gray-600 hover:text-purple-600 transition-colors text-sm'>
                    {p.email || '—'}
                  </a>,
                  <span className='text-gray-400 text-xs max-w-[180px] truncate block' title={p.direccion}>
                    {p.direccion || '—'}
                  </span>,
                  <AccionesBoton
                    /////
                     onDetalles={() => setDetalle({ open: true, type: 'proveedor', data: p })}
                    onEditar={() => abrirModalEditar('proveedor', p)}
                    onEliminar={() => setConfirmDelete({ open: true, type: 'proveedor', id: p.id, nombre: p.nombre })}
                  />
                ])}
                vacio={
                  <div className='flex flex-col items-center gap-4 py-12'>
                    <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center'>
                      <Building2 className='w-8 h-8 text-cyan-300' />
                    </div>
                    <div className='text-center'>
                      <p className='font-bold text-gray-500 text-sm'>No hay proveedores registrados</p>
                      <p className='text-gray-400 text-xs mt-1'>Intenta modificar los términos de búsqueda.</p>
                    </div>
                  </div>
                }
              />
            </div>
          )}

          {/* Tabla de Categorías */}
          {tabActiva === 'categorias' && (
            <div>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Tags className='w-4 h-4 text-purple-500' />
                  <span className='text-sm font-bold text-gray-700'>
                    Categorías <span className='text-gray-400 font-normal'>({categoriasFiltradas.length})</span>
                  </span>
                </div>
                <button onClick={() => abrirModalCrear('categoria')}
                  className='flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:from-indigo-500 hover:to-purple-400 transition-all duration-200 shadow-md'>
                  <span className='text-lg leading-none'>+</span> Nuevo
                </button>
              </div>
              <TablaGenerica
                columnas={['ID', 'Nombre', 'Acciones']}
                filas={categoriasFiltradas.map(c => [
                  <span className='font-mono text-gray-400 text-xs'>#{c.id}</span>,
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0'>
                      {(c.nombre || '?').charAt(0).toUpperCase()}
                    </div>
                    <span className='font-semibold text-gray-800'>{c.nombre || '—'}</span>
                  </div>,
                  <AccionesBoton
                     onDetalles={() => setDetalle({ open: true, type: 'categoria', data: c })}
                    onEditar={() => abrirModalEditar('categoria', c)}
                    onEliminar={() => setConfirmDelete({ open: true, type: 'categoria', id: c.id, nombre: c.nombre })}
                  />
                ])}
                vacio={
                  <div className='flex flex-col items-center gap-4 py-12'>
                    <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center'>
                      <Tags className='w-8 h-8 text-indigo-300' />
                    </div>
                    <div className='text-center'>
                      <p className='font-bold text-gray-500 text-sm'>No hay categorías disponibles</p>
                      <p className='text-gray-400 text-xs mt-1'>Intenta modificar los términos de búsqueda.</p>
                    </div>
                  </div>
                }
              />
            </div>
          )}

          {/* Tabla de Productos */}
          {tabActiva === 'productos' && (
            <div>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Package className='w-4 h-4 text-purple-500' />
                  <span className='text-sm font-bold text-gray-700'>
                    Productos <span className='text-gray-400 font-normal'>({productosFiltrados.length})</span>
                  </span>
                </div>
                <button onClick={() => abrirModalCrear('producto')}
                  className='flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:from-purple-600 hover:to-fuchsia-500 transition-all duration-200 shadow-md'>
                  <span className='text-lg leading-none'>+</span> Nuevo
                </button>
              </div>
              <TablaGenerica
                columnas={['Imagen', 'ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones']}
                filas={productosFiltrados.map(p => [
                  <div className='flex items-center'>
                    <div className='w-10 h-10 rounded-lg border border-gray-100 overflow-hidden shadow-sm bg-gray-50'>
                      <img
                        src={p.imagenUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'}
                        alt={p.nombre}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300';
                        }}
                      />
                    </div>
                  </div>,
                  <span className='font-mono text-gray-400 text-xs'>#{p.id}</span>,
                  <div>
                    <span className='font-semibold text-gray-800'>{p.nombre}</span>
                    {p.proveedor && (
                      <div className='text-[10px] text-gray-400 mt-0.5'>{p.proveedor.nombreEmpresa}</div>
                    )}
                  </div>,
                  <span className='inline-flex px-2.5 py-1 bg-purple-50 text-purple-700 text-[11px] font-bold rounded-md border border-purple-100/50'>
                    {p.categoria?.nombre || '—'}
                  </span>,
                  <span className='font-black text-gray-900 text-base tracking-tight'>
                    ${p.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>,
                  <StockBadge stock={p.stock} />,
                  <AccionesBoton
                     onDetalles={() => setDetalle({ open: true, type: 'producto', data: p })}
                    onEditar={() => abrirModalEditar('producto', p)}
                    onEliminar={() => setConfirmDelete({ open: true, type: 'producto', id: p.id, nombre: p.nombre })}
                  />
                ])}
                vacio={
                  <div className='flex flex-col items-center gap-4 py-12'>
                    <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center'>
                      <Package className='w-8 h-8 text-purple-300' />
                    </div>
                    <div className='text-center'>
                      <p className='font-bold text-gray-500 text-sm'>No hay productos disponibles</p>
                      <p className='text-gray-400 text-xs mt-1'>Intenta modificar los términos de búsqueda.</p>
                    </div>
                  </div>
                }
              />
            </div>
          )}

          {/* Módulo Ventas (en desarrollo) */}
          {/* Tabla de Ventas */}
          {tabActiva === 'ventas' && (
            <div>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <ShoppingBag className='w-4 h-4 text-purple-500' />
                  <span className='text-sm font-bold text-gray-700'>
                    Ventas <span className='text-gray-400 font-normal'>({ventasFiltradas.length})</span>
                  </span>
                </div>
              </div>
              <TablaGenerica
                columnas={['ID', 'Fecha', 'Cliente', 'Productos', 'Total', 'Estado', 'Acciones']}
                filas={ventasFiltradas.map(v => [
                  <span className='font-mono text-gray-400 text-xs'>#{v.id}</span>,
                  <span className='text-gray-600 text-sm'>
                    {v.fecha ? new Date(v.fecha).toLocaleDateString('es-MX') : '—'}
                  </span>,
                  <span className='font-semibold text-gray-800'>{v.cliente?.nombre || '—'}</span>,
                  <span
                    className='text-gray-500 text-xs max-w-[220px] block truncate'
                    title={(v.detalles || []).map(d => `${d.producto?.nombre} x${d.cantidad}`).join(', ')}
                  >
                    {(v.detalles || []).map(d => `${d.producto?.nombre} x${d.cantidad}`).join(', ') || '—'}
                  </span>,
                  <span className='font-black text-gray-900 text-base tracking-tight'>
                    ${(v.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>,
                  <EstadoBadge estado={v.estadoPago} />,
                  <AccionesBoton
                    onDetalles={() => setDetalle({ open: true, type: 'venta', data: v })}
                  />
                ])}
                vacio={
                  <div className='flex flex-col items-center gap-4 py-12'>
                    <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center'>
                      <ShoppingBag className='w-8 h-8 text-amber-300' />
                    </div>
                    <div className='text-center'>
                      <p className='font-bold text-gray-500 text-sm'>No hay ventas registradas</p>
                      <p className='text-gray-400 text-xs mt-1'>Intenta modificar los términos de búsqueda.</p>
                    </div>
                  </div>
                }
              />
            </div>
          )}
          {/* Tabla de Clientes */}
          {tabActiva === 'clientes' && (
            <div>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Users className='w-4 h-4 text-purple-500' />
                  <span className='text-sm font-bold text-gray-700'>
                    Clientes <span className='text-gray-400 font-normal'>({clientesFiltrados.length})</span>
                  </span>
                </div>
              </div>
              <TablaGenerica
                columnas={['ID', 'Nombre', 'Correo', 'Teléfono', 'Dirección', 'Acciones']}
                filas={clientesFiltrados.map(c => [
                  <span className='font-mono text-gray-400 text-xs'>#{c.id}</span>,
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0'>
                      {(c.nombre || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className='font-semibold text-gray-800'>{c.nombre || '—'}</span>
                      {c.rol === 'ROLE_ADMIN' && (
                        <span className='ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded'>Admin</span>
                      )}
                    </div>
                  </div>,
                  <a href={`mailto:${c.email}`} className='text-gray-600 hover:text-purple-600 transition-colors text-sm'>
                    {c.email || '—'}
                  </a>,
                  <span className='text-gray-500 text-sm'>{c.telefono || '—'}</span>,
                  <span className='text-gray-400 text-xs max-w-[180px] truncate block' title={c.direccion}>
                    {c.direccion || '—'}
                  </span>,
                  <AccionesBoton
                    onDetalles={() => setDetalle({ open: true, type: 'cliente', data: c })}
                  />
                ])}
                vacio={
                  <div className='flex flex-col items-center gap-4 py-12'>
                    <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center'>
                      <Users className='w-8 h-8 text-purple-300' />
                    </div>
                    <div className='text-center'>
                      <p className='font-bold text-gray-500 text-sm'>No hay clientes registrados</p>
                      <p className='text-gray-400 text-xs mt-1'>Intenta modificar los términos de búsqueda.</p>
                    </div>
                  </div>
                }
              />
            </div>
          )}
          {/* Formulario Registrar Usuario (solo Admin) */}
          {tabActiva === 'registrar' && (
            <div className='max-w-lg'>
              <div className='flex items-center gap-2 mb-5'>
                <UserPlus className='w-4 h-4 text-purple-500' />
                <span className='text-sm font-bold text-gray-700'>Registrar nuevo usuario</span>
              </div>

              {registroError && (
                <div className='bg-gradient-to-r from-red-50 to-rose-50/80 text-red-700 p-4 rounded-xl flex items-start gap-2.5 border border-red-200/80 text-sm shadow-sm mb-4'>
                  <AlertTriangle className='w-4 h-4 text-red-500 flex-shrink-0 mt-0.5' />
                  <span className='font-medium'>{registroError}</span>
                </div>
              )}
              {registroSuccess && (
                <div className='bg-gradient-to-r from-emerald-50 to-green-50/80 text-emerald-700 p-4 rounded-xl flex items-start gap-2.5 border border-emerald-200/80 text-sm shadow-sm mb-4'>
                  <ShieldAlert className='w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5' />
                  <span className='font-medium'>{registroSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegistrarUsuario} className='space-y-4'>
                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>Rol del usuario</label>
                  <select
                    name='rol'
                    value={registroForm.rol}
                    onChange={handleRegistroChange}
                    className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm bg-white'
                  >
                    <option value='ROLE_CLIENTE'>Cliente (Comprador)</option>
                    <option value='ROLE_ADMIN'>Administrador (Jefe)</option>
                  </select>
                </div>

               <CampoForm label='Nombre completo' name='nombre' value={registroForm.nombre} onChange={handleRegistroChange} required />
                <CampoForm label='Correo electrónico' name='username' type='email' value={registroForm.username} onChange={handleRegistroChange} required />
                <CampoForm label='Contraseña' name='password' type='password' value={registroForm.password} onChange={handleRegistroChange} required />

                {registroForm.rol === 'ROLE_CLIENTE' && (
                  <>
                    <CampoForm label='Teléfono' name='telefono' value={registroForm.telefono} onChange={handleRegistroChange} />
                    <CampoForm label='Dirección' name='direccion' value={registroForm.direccion} onChange={handleRegistroChange} />
                  </>
                )}

                <button
                  type='submit'
                  disabled={registrando}
                  className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50'
                >
                  <UserPlus className='w-4 h-4' />
                  {registrando ? 'Registrando...' : 'Registrar usuario'}
                </button>
              </form>

              {/* Tabla de Administradores existentes */}
              <div className='mt-8'>
                <div className='flex items-center gap-2 mb-4'>
                  <ShieldAlert className='w-4 h-4 text-purple-500' />
                  <span className='text-sm font-bold text-gray-700'>
                    Administradores <span className='text-gray-400 font-normal'>({admins.length})</span>
                  </span>
                </div>
                <TablaGenerica
                  columnas={['ID', 'Nombre', 'Correo']}
                  filas={admins.map(a => [
                    <span className='font-mono text-gray-400 text-xs'>#{a.id}</span>,
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0'>
                        {(a.nombre || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className='font-semibold text-gray-800'>{a.nombre || '—'}</span>
                    </div>,
                    <span className='text-gray-600 text-sm'>{a.username || '—'}</span>,
                  ])}
                  vacio={
                    <div className='flex flex-col items-center gap-4 py-8'>
                      <p className='font-bold text-gray-500 text-sm'>No hay administradores registrados</p>
                    </div>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      

      {/* ═══════ MODAL CRUD ═══════ */}
      {modal.open && (
        <ModalFormulario
          type={modal.type}
          mode={modal.mode}
          formData={formData}
          onChange={handleChange}
          onGuardar={handleGuardar}
          onCerrar={cerrarModal}
          guardando={guardando}
          categorias={categorias}
          proveedores={proveedores}
        />
      )}

      {/* ═══════ MODAL DETALLES ═══════ */}
{detalle.open && (
  <DetalleModal
    type={detalle.type}
    data={detalle.data}
     ventas={ventas}
    onCerrar={() => setDetalle({ open: false, type: null, data: null })}
  />
)}

      {/* ═══════ CONFIRMAR ELIMINAR ═══════ */}
      {confirmDelete.open && (
        <ConfirmDialog
          nombre={confirmDelete.nombre}
          onConfirmar={handleEliminar}
          onCancelar={() => setConfirmDelete({ open: false, type: null, id: null, nombre: '' })}
        />
      )}
    </div>
  );
};

// --- Subcomponentes ---

const TarjetaResumen = ({ icono, titulo, valor, color, border }) => (
  <div className={`group bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:shadow-purple-200/20 ${border}`}>
    <div className={`bg-gradient-to-br ${color} text-white p-4 rounded-2xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl relative overflow-hidden flex-shrink-0`}>
      <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
      <div className='relative z-10'>{icono}</div>
    </div>
    <div className='min-w-0 flex-1'>
      <p className='text-xs text-gray-400 font-bold uppercase tracking-[0.15em] mb-1.5'>{titulo}</p>
      <p className='text-2xl font-black text-gray-800 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:to-violet-600 group-hover:bg-clip-text group-hover:text-transparent'>
        {valor}
      </p>
    </div>
  </div>
);

const StockBadge = ({ stock }) => {
  if (stock > 10) {
    return (
      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md border border-emerald-200/50'>
        <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse'></span>
        {stock} en stock
      </span>
    );
  }
  if (stock > 0) {
    return (
      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-md border border-amber-200/50'>
        <span className='w-1.5 h-1.5 bg-amber-500 rounded-full'></span>
        {stock} en stock
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-[11px] font-bold rounded-md border border-red-200/50'>
      <span className='w-1.5 h-1.5 bg-red-500 rounded-full'></span>
      Sin stock
    </span>
  );
};

const EstadoBadge = ({ estado }) => {
  const e = (estado || '').toUpperCase();
  if (e === 'PAGADO' || e === 'PAID') {
    return (
      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md border border-emerald-200/50'>
        <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></span>
        Pagado
      </span>
    );
  }
  if (e === 'PENDIENTE' || e === 'PENDING') {
    return (
      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-md border border-amber-200/50'>
        <span className='w-1.5 h-1.5 bg-amber-500 rounded-full'></span>
        Pendiente
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-md border border-gray-200/50'>
      {estado || '—'}
    </span>
  );
};

const TabBoton = ({ activa, onClick, icono, label, deshabilitado }) => {
  if (deshabilitado) {
    return (
      <div className='relative group flex items-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 border-transparent text-gray-300 bg-gray-50/50 select-none cursor-default rounded-t-lg'>
        <span className='opacity-50'>{icono}</span>
        <span className='opacity-50'>{label}</span>
        <span className='ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[9px] font-black rounded leading-none tracking-wider'>
          PROX
        </span>
        <div className='absolute opacity-0 group-hover:opacity-100 transition-all duration-200 -bottom-9 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none z-20'>
          Módulo en desarrollo
          <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45'></div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer relative rounded-t-lg ${
        activa
          ? 'text-purple-700 bg-white shadow-sm'
          : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
      }`}
    >
      <span className={`transition-transform duration-200 ${activa ? 'scale-110' : ''}`}>
        {icono}
      </span>
      {label}
      {activa && (
        <span className='absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-600 to-violet-500 rounded-full'></span>
      )}
    </button>
  );
};

const AccionesBoton = ({ onDetalles, onEditar, onEliminar }) => (
  <div className='flex items-center gap-1.5'>
    
     {onDetalles && (
      <button onClick={onDetalles}
        className='p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200'
        title='Detalles'>
        <Eye className='w-4 h-4' />
      </button>
    )}

    {onEditar &&(
    <button onClick={onEditar}
      className='p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200'
      title='Editar'>
      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
      </svg>
    </button>

    )}
    {onEliminar && (
    <button onClick={onEliminar}
      className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200'
      title='Eliminar'>
      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
      </svg>
    </button>
    )}
  </div>
);

  const ModalFormulario = ({ type, mode, formData, onChange, onGuardar, onCerrar, guardando, categorias, proveedores }) => {
  const config = {
    producto: { nombre: 'Producto', icono: <Package className='w-5 h-5' /> },
    proveedor: { nombre: 'Proveedor', icono: <Building2 className='w-5 h-5' /> },
    categoria: { nombre: 'Categoría', icono: <Tags className='w-5 h-5' /> },
  };
  const { nombre: nombreTipo, icono } = config[type] || config.categoria;
  const titulo = mode === 'crear' ? `Nuevo ${nombreTipo}` : `Editar ${nombreTipo}`;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200/80'>
        {/* ═══════ HEADER CON GRADIENTE ═══════ */}
        <div className='relative bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-700 rounded-t-2xl p-6 text-white overflow-hidden'>
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

          <button type='button' onClick={onCerrar}
            className='absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all z-20'>
            <X className='w-5 h-5' />
          </button>
     

          <div className='relative z-10 flex items-center gap-3'>
            <div className='w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0'>
              {icono}
            </div>
            <div>
              <div className='inline-flex items-center px-2.5 py-0.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-1'>
                <span className='text-purple-200/90 text-[10px] font-bold uppercase tracking-[0.15em]'>
                  {mode === 'crear' ? 'Creando' : 'Editando'}
                </span>
              </div>
              <h3 className='text-lg font-black'>{titulo}</h3>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className='p-5 space-y-4'>

          {type === 'producto' && (
            <>
              <CampoForm label='Nombre' name='nombre' value={formData.nombre} onChange={onChange} required />
              <div>
                <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>Descripción</label>
                <textarea name='descripcion' value={formData.descripcion || ''} onChange={onChange} rows={3}
                  className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 text-sm transition-all resize-none' />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <CampoForm label='Precio ($)' name='precio' type='number' value={formData.precio} onChange={onChange} required />
                <CampoForm label='Stock' name='stock' type='number' value={formData.stock} onChange={onChange} required />
              </div>
              <CampoForm label='URL de Imagen' name='imagenUrl' value={formData.imagenUrl} onChange={onChange} />
              <SelectForm label='Categoría' value={formData.categoriaId} onChange={(e) => onChange({ target: { name: 'categoriaId', value: e.target.value } })}
                opciones={categorias.map(c => ({ value: c.id, label: c.nombre }))} />
              <SelectForm label='Proveedor' value={formData.proveedorId} onChange={(e) => onChange({ target: { name: 'proveedorId', value: e.target.value } })}
                opciones={proveedores.map(p => ({ value: p.id, label: p.nombre }))} />
            </>
          )}

          {type === 'proveedor' && (
            <>
              <CampoForm label='Nombre de empresa' name='nombre' value={formData.nombre} onChange={onChange} required />
              <CampoForm label='Teléfono' name='telefono' value={formData.telefono} onChange={onChange} />
              <CampoForm label='Email' name='email' type='email' value={formData.email} onChange={onChange} />
              <div>
                <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>Dirección</label>
                <textarea name='direccion' value={formData.direccion || ''} onChange={onChange} rows={2}
                  className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 text-sm transition-all resize-none' />
              </div>
            </>
          )}

          {type === 'categoria' && (
            <CampoForm label='Nombre de la categoría' name='nombre' value={formData.nombre} onChange={onChange} required />
          )}
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 p-5 border-t border-gray-100'>
          <button onClick={onCerrar} className='px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all'>
            Cancelar
          </button>
          <button onClick={onGuardar} disabled={guardando}
            className='px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-fuchsia-600 rounded-xl hover:shadow-lg hover:from-violet-500 hover:to-purple-400 transition-all duration-200 shadow-md disabled:opacity-50'>
            {guardando ? 'Guardando...' : mode === 'crear' ? 'Crear' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CampoForm = ({ label, name, type, value, onChange, required }) => (
  <div>
    <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>
      {label} {required && <span className='text-fuchsia-500'>*</span>}
    </label>
    <input type={type || 'text'} name={name} value={value || ''} onChange={onChange} required={required}
      className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm transition-all duration-200 hover:border-gray-300 bg-gray-50/50 focus:bg-white' />
  </div>
);

const SelectForm = ({ label, value, onChange, opciones }) => (
  <div>
    <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>{label}</label>
    <select value={value} onChange={onChange}
      className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm transition-all duration-200 hover:border-gray-300 bg-gray-50/50 focus:bg-white cursor-pointer'>
      <option value=''>Seleccionar...</option>
      {opciones.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const ConfirmDialog = ({ nombre, onConfirmar, onCancelar }) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
    <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200/80 p-6 text-center'>
      <div className='w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4'>
        <AlertTriangle className='w-7 h-7 text-red-500' />
      </div>
      <h3 className='text-lg font-black text-gray-800 mb-2'>¿Eliminar?</h3>
      <p className='text-sm text-gray-500 mb-6'>
        ¿Estás seguro de eliminar <span className='font-bold text-gray-700'>{nombre}</span>? Esta acción no se puede deshacer.
      </p>
      <div className='flex gap-3 justify-center'>
        <button onClick={onCancelar}
          className='px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all'>
          Cancelar
        </button>
        <button onClick={onConfirmar}
          className='px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-md hover:shadow-lg'>
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
);

///
const DetalleModal = ({ type, data, ventas = [], onCerrar  }) => {
  const config = {
    producto: { titulo: 'Detalles del Producto', icono: <Package className='w-5 h-5' /> },
    proveedor: { titulo: 'Detalles del Proveedor', icono: <Building2 className='w-5 h-5' /> },
    categoria: { titulo: 'Detalles de la Categoría', icono: <Tags className='w-5 h-5' /> },
    cliente: { titulo: 'Detalles del Cliente', icono: <Users className='w-5 h-5' /> },
    venta: { titulo: 'Detalles de la Venta', icono: <ShoppingBag className='w-5 h-5' /> },
  };
  const { titulo, icono } = config[type] || config.categoria;
  const inicial = (data.nombre || '?').charAt(0).toUpperCase();

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200/80'>

        {/* ═══════ HEADER CON GRADIENTE ═══════ */}
          <div className='relative bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-700 rounded-t-2xl p-6 text-white overflow-hidden'>
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

          <button type='button' onClick={onCerrar}
            className='absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all z-20'>
            <X className='w-5 h-5' />
          </button>

          <div className='relative z-10 flex items-center gap-4'>
            {type === 'producto' && data.imagenUrl ? (
              <img src={data.imagenUrl} alt={data.nombre}
                className='w-16 h-16 rounded-xl object-cover border-2 border-white/20 shadow-lg flex-shrink-0' />
            ) : (
              <div className='w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl font-black shadow-lg flex-shrink-0'>
                {inicial}
              </div>
            )}
            <div className='min-w-0'>
              <div className='inline-flex items-center gap-1.5 mb-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10'>
                {icono}
                <span className='text-purple-200/90 text-[10px] font-bold uppercase tracking-[0.15em]'>{titulo}</span>
              </div>
             <h3 className='text-xl font-black truncate'>
                {type === 'venta' ? `Venta #${data.id}` : (data.nombre || '—')}
              </h3>
            </div>
          </div>
        </div>

        {/* ═══════ CONTENIDO ═══════ */}
        <div className='p-5 space-y-2.5'>
          <FilaDetalle icono={<Tag className='w-3.5 h-3.5' />} label='ID' valor={`#${data.id}`} />

          {type === 'producto' && (
            <>
              <FilaDetalle icono={<Info className='w-3.5 h-3.5' />} label='Descripción' valor={data.descripcion || '—'} />
              <div className='grid grid-cols-2 gap-2.5'>
                <div className='bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-3.5 border border-purple-100/70'>
                  <p className='text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1'>Precio</p>
                  <p className='text-lg font-black text-purple-900'>
                    ${Number(data.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={`rounded-xl p-3.5 border ${
                  data.stock > 10 ? 'bg-emerald-50 border-emerald-100' :
                  data.stock > 0 ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'
                }`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    data.stock > 10 ? 'text-emerald-500' : data.stock > 0 ? 'text-amber-500' : 'text-red-500'
                  }`}>Stock</p>
                  <p className={`text-lg font-black ${
                    data.stock > 10 ? 'text-emerald-700' : data.stock > 0 ? 'text-amber-700' : 'text-red-700'
                  }`}>{data.stock} uds</p>
                </div>
              </div>
              <FilaDetalle icono={<Tags className='w-3.5 h-3.5' />} label='Categoría' valor={data.categoria?.nombre || '—'} badge />
              <FilaDetalle icono={<Building2 className='w-3.5 h-3.5' />} label='Proveedor' valor={data.proveedor?.nombre || '—'} />
            </>
          )}
         {type === 'proveedor' && (() => {
            const ventasProveedor = ventas.filter(v =>
              (v.detalles || []).some(d => d.producto?.proveedor?.id === data.id)
            );
            const totalVendido = ventasProveedor.reduce((acc, v) => {
              const suma = (v.detalles || [])
                .filter(d => d.producto?.proveedor?.id === data.id)
                .reduce((s, d) => s + (d.subtotal || 0), 0);
              return acc + suma;
            }, 0);
            return (
              <>
                <FilaDetalle icono={<Phone className='w-3.5 h-3.5' />} label='Teléfono' valor={data.telefono || '—'} />
                <FilaDetalle icono={<Mail className='w-3.5 h-3.5' />} label='Email' valor={data.email || '—'} />
                <FilaDetalle icono={<MapPin className='w-3.5 h-3.5' />} label='Dirección' valor={data.direccion || '—'} />

                <div className='pt-2'>
                  <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>Ventas de sus productos</p>
                  <div className='grid grid-cols-2 gap-2.5 mb-2'>
                    <div className='bg-cyan-50 rounded-xl p-3.5 border border-cyan-100'>
                      <p className='text-[10px] text-cyan-500 font-bold uppercase tracking-wider mb-1'>Ventas</p>
                      <p className='text-lg font-black text-cyan-800'>{ventasProveedor.length}</p>
                    </div>
                    <div className='bg-emerald-50 rounded-xl p-3.5 border border-emerald-100'>
                      <p className='text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1'>Total vendido</p>
                      <p className='text-lg font-black text-emerald-800'>
                        ${totalVendido.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  {ventasProveedor.length > 0 ? (
                    <div className='space-y-1.5 max-h-40 overflow-y-auto'>
                      {ventasProveedor.map(v => (
                        <div key={v.id} className='flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs'>
                          <span className='text-gray-600'>Venta #{v.id} — {v.cliente?.nombre || '—'}</span>
                          <span className='font-bold text-gray-800'>
                            ${(v.detalles || [])
                              .filter(d => d.producto?.proveedor?.id === data.id)
                              .reduce((s, d) => s + (d.subtotal || 0), 0)
                              .toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-xs text-gray-400'>Este proveedor aún no tiene ventas registradas.</p>
                  )}
                </div>
              </>
            );
          })()}

          {type === 'categoria' && (
            <FilaDetalle icono={<Tags className='w-3.5 h-3.5' />} label='Nombre' valor={data.nombre} />
          )}

          {type === 'venta' && (
            <>
              <FilaDetalle icono={<Users className='w-3.5 h-3.5' />} label='Cliente' valor={data.cliente?.nombre || '—'} />
              <FilaDetalle icono={<Clock className='w-3.5 h-3.5' />} label='Fecha' valor={data.fecha ? new Date(data.fecha).toLocaleDateString('es-MX') : '—'} />
              <div className='grid grid-cols-2 gap-2.5'>
                <div className='bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-3.5 border border-purple-100/70'>
                  <p className='text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1'>Total</p>
                  <p className='text-lg font-black text-purple-900'>
                    ${Number(data.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className='rounded-xl p-3.5 border bg-gray-50 border-gray-100'>
                  <p className='text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-500'>Estado</p>
                  <p className='text-sm font-black text-gray-700'>{data.estadoPago || '—'}</p>
                </div>
              </div>
              <div className='pt-2'>
                <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>Productos</p>
                <div className='space-y-1.5'>
                  {(data.detalles || []).map(d => (
                    <div key={d.id} className='flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm'>
                      <span className='text-gray-700 font-medium'>
                        {d.producto?.nombre} <span className='text-gray-400'>x{d.cantidad}</span>
                      </span>
                      <span className='font-bold text-gray-800'>
                        ${(d.subtotal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {type === 'cliente' && (
            <>
              <FilaDetalle icono={<Mail className='w-3.5 h-3.5' />} label='Correo' valor={data.email || '—'} />
              <FilaDetalle icono={<Phone className='w-3.5 h-3.5' />} label='Teléfono' valor={data.telefono || '—'} />
              <FilaDetalle icono={<MapPin className='w-3.5 h-3.5' />} label='Dirección' valor={data.direccion || '—'} />
              <div className='pt-1'>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  data.rol === 'ROLE_ADMIN'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  <Users className='w-3.5 h-3.5' />
                  {data.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
            </>
          )}
        </div>

        <div className='flex justify-end gap-3 p-5 border-t border-gray-100'>
          <button onClick={onCerrar}
            className='px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-fuchsia-600 rounded-xl hover:shadow-lg hover:from-violet-500 hover:to-purple-400 transition-all duration-200 shadow-md'>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const FilaDetalle = ({ icono, label, valor, badge }) => (
  <div className='flex items-start justify-between gap-4 py-2.5 px-1 border-b border-gray-50 last:border-0'>
    <span className='flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex-shrink-0'>
      {icono}
      {label}
    </span>
    {badge ? (
      <span className='inline-flex px-2.5 py-1 bg-purple-50 text-purple-700 text-[11px] font-bold rounded-md border border-purple-100/50'>
        {valor}
      </span>
    ) : (
      <span className='text-sm text-gray-700 text-right max-w-[65%] break-words'>{valor}</span>
    )}
  </div>
);

const TablaGenerica = ({ columnas, filas, vacio }) => {
  if (filas.length === 0) {
    return (
      <div className='text-center py-12 text-gray-400 text-sm'>
        {vacio}
      </div>
    );
  }
  return (
    <div className='overflow-x-auto rounded-xl border border-gray-100/80'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='bg-gradient-to-r from-gray-50 to-gray-100/50'>
            {columnas.map((col, i) => (
              <th key={i} className='text-left font-extrabold text-gray-500 px-4 py-3.5 text-[11px] uppercase tracking-[0.1em] first:rounded-tl-xl last:rounded-tr-xl'>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={i} className={`group border-b border-gray-50/80 transition-all duration-150 ${
              i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
            } hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-transparent`}>
              {fila.map((celda, j) => (
                <td key={j} className={`px-4 py-3.5 text-gray-700 transition-all duration-150 ${
                  j === 0 ? 'group-hover:pl-5' : ''
                }`}>{celda}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};