import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
export interface Material {
  id?: number;
  nombre: string;
  precioCosto: number;
  unidad: string; // 'metro', 'unidad', 'hora', etc.
  stock: number;
}

export interface ComponenteProducto {
  id?: number;
  productoId: number;
  materialId: number;
  cantidad: number;
}

export interface Producto {
  id?: number;
  nombre: string;
  precioCosto: number;
  precioVenta: number;
  stock: number;
  codigoBarras?: string; // nuevo campo
  componentes?: ComponenteProducto[];
  variantes?: VarianteProducto[];
}

export interface VarianteProducto {
  id: number;
  productoId: number;
  nombre: string;
  stock: number;
  codigoBarras?: string; // nuevo campo
}

export interface Venta {
  id?: number;
  fecha: string;
  totalProductos: number;
  precioTotal: number;
  ganancia: number;
  productos: {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    ganancia: number;
    varianteId?: number;
  }[];
}

let _db: SQLite.SQLiteDatabase | null = null;


export const setupProductosDB = async () => {
  console.log('=== INICIALIZANDO BASE DE DATOS ===');
  try {
    if (_db === null) {
      _db = await SQLite.openDatabaseAsync('productos.db');
      console.log('✅ Base de datos abierta correctamente');
    }
    
    // Crear la tabla de materiales
    await _db.execAsync(`
      CREATE TABLE IF NOT EXISTS materiales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precioCosto REAL NOT NULL,
        unidad TEXT NOT NULL,
        stock REAL NOT NULL
      );
    `);
    console.log('✅ Tabla materiales creada correctamente');

    // Crear la tabla de productos
// productos
await _db.execAsync(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precioCosto REAL NOT NULL,
    precioVenta REAL NOT NULL,
    stock INTEGER NOT NULL,
    codigoBarras TEXT
  );
`);

// variantes_producto
await _db.execAsync(`
  CREATE TABLE IF NOT EXISTS variantes_producto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productoId INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    stock INTEGER NOT NULL,
    codigoBarras TEXT,
    FOREIGN KEY (productoId) REFERENCES productos (id) ON DELETE CASCADE
  );
`);

    // Crear la tabla de componentes de productos
    await _db.execAsync(`
      CREATE TABLE IF NOT EXISTS componentes_producto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productoId INTEGER NOT NULL,
        materialId INTEGER NOT NULL,
        cantidad REAL NOT NULL,
        FOREIGN KEY (productoId) REFERENCES productos (id) ON DELETE CASCADE,
        FOREIGN KEY (materialId) REFERENCES materiales (id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Tabla componentes_producto creada correctamente');

    // Crear la tabla de ventas
    await _db.execAsync(`
      CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        totalProductos INTEGER NOT NULL,
        precioTotal REAL NOT NULL,
        ganancia REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ventas_detalle (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ventaId INTEGER NOT NULL,
        productoId INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        precioUnitario REAL NOT NULL,
        ganancia REAL NOT NULL,
        FOREIGN KEY (ventaId) REFERENCES ventas (id),
        FOREIGN KEY (productoId) REFERENCES productos (id)
      );
    `);
    console.log('✅ Tablas de ventas creadas correctamente');

    // Verificar la estructura de las tablas
    const tableInfo = await _db.getAllAsync("PRAGMA table_info(productos);");
    console.log('📋 Estructura de la tabla productos:', tableInfo);

    const ventasTableInfo = await _db.getAllAsync("PRAGMA table_info(ventas);");
    console.log('📋 Estructura de la tabla ventas:', ventasTableInfo);

    const ventasDetalleTableInfo = await _db.getAllAsync("PRAGMA table_info(ventas_detalle);");
    console.log('📋 Estructura de la tabla ventas_detalle:', ventasDetalleTableInfo);

    // Verificar si hay datos en la tabla
    const countResult = await _db.getFirstAsync("SELECT COUNT(*) as count FROM productos;");
    console.log('📊 Cantidad de productos en la base de datos:', countResult);

    console.log('=== BASE DE DATOS INICIALIZADA CORRECTAMENTE ===');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
};

export const getDb = (): SQLite.SQLiteDatabase => {
  if (_db === null) {
    throw new Error('Database not initialized. Call setupProductosDB first.');
  }
  return _db;
};

// Función para mostrar todo el contenido de la base de datos
export const mostrarContenidoDB = async () => {
  console.log('=== CONTENIDO DE LA BASE DE DATOS ===');
  try {
    const dbInstance = getDb();
    // Mostrar todas las tablas
    const tablesQuery = "SELECT name FROM sqlite_master WHERE type='table';";
    const tables = await dbInstance.execAsync(tablesQuery);
    console.log('📚 Tablas en la base de datos:', tables);

    // Para cada tabla, mostrar su contenido
    const tablesStr = JSON.stringify(tables);
    const parsedTables = JSON.parse(tablesStr);
    
    for (const table of parsedTables) {
      const tableName = table.name;
      console.log(`\n=== Contenido de la tabla: ${tableName} ===`);
      const contentQuery = `SELECT * FROM ${tableName};`;
      const content = await dbInstance.execAsync(contentQuery);
      console.log('📝 Contenido:', content);
    }
  } catch (error) {
    console.error('❌ Error al mostrar contenido de la DB:', error);
  }
  console.log('=== FIN DEL CONTENIDO ===');
};

export const insertarProducto = async (producto: Producto, callback?: () => void) => {
  const { nombre, precioCosto, precioVenta, stock, codigoBarras } = producto;
  console.log('📥 Insertando producto en DB:', producto);
  try {
    const dbInstance = getDb();
    const result = await dbInstance.runAsync(
      'INSERT INTO productos (nombre, precioCosto, precioVenta, stock, codigoBarras) VALUES (?, ?, ?, ?, ?)',
      [nombre, precioCosto, precioVenta, stock, codigoBarras || null]
    );
    console.log('✅ Producto insertado en DB exitosamente. ID:', result.lastInsertRowId);
    callback?.();
  } catch (error) {
    console.error('❌ Error al insertar producto en DB:', error);
    throw error;
  }
};

export const obtenerProductos = async (callback: (productos: Producto[]) => void) => {
  console.log('📋 Obteniendo productos de DB...');
  try {
    const dbInstance = getDb();
    const productos = await dbInstance.getAllAsync<Producto>('SELECT * FROM productos;');
    
    // Obtener variantes para cada producto
    for (const producto of productos) {
      const variantes = await dbInstance.getAllAsync<VarianteProducto>(
        'SELECT * FROM variantes_producto WHERE productoId = ?',
        [producto.id!]
      );
      producto.variantes = variantes;
      
      // Calcular stock total (producto base + variantes)
      const stockVariantes = variantes.reduce((total, v) => total + v.stock, 0);
      producto.stock = producto.stock + stockVariantes;
    }
    
    console.log("📦 Productos obtenidos:", JSON.stringify(productos, null, 2));
    callback(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos de DB:', error);
    callback([]);
  }
};

export const obtenerProductoPorCodigo = async (codigo: string): Promise<Producto | null> => {
  console.log('🔍 Buscando producto por código de barras:', codigo);
  try {
    const dbInstance = getDb();
    
    // Buscar en productos base
    let producto = await dbInstance.getFirstAsync<Producto>(
      'SELECT * FROM productos WHERE codigoBarras = ?',
      [codigo]
    );

    // Si se encontró un producto base, obtener sus variantes
    if (producto) {
      const variantes = await dbInstance.getAllAsync<VarianteProducto>(
        'SELECT * FROM variantes_producto WHERE productoId = ?',
        [producto.id!]
      );
      producto.variantes = variantes;
      return producto;
    }

    // Si no se encontró en productos base, buscar en variantes
    const variante = await dbInstance.getFirstAsync<VarianteProducto>(
      'SELECT * FROM variantes_producto WHERE codigoBarras = ?',
      [codigo]
    );

    if (variante) {
      // Si se encuentra una variante, obtener el producto padre
      producto = await dbInstance.getFirstAsync<Producto>(
        'SELECT * FROM productos WHERE id = ?',
        [variante.productoId]
      );
      
      if (producto) {
         // Obtener todas las variantes del producto padre
        const todasLasVariantes = await dbInstance.getAllAsync<VarianteProducto>(
          'SELECT * FROM variantes_producto WHERE productoId = ?',
          [producto.id!]
        );
        producto.variantes = todasLasVariantes;
        return producto;
      }
    }

    console.log('🚫 Producto no encontrado para el código:', codigo);
    return null;
  } catch (error) {
    console.error('❌ Error al obtener producto por código de barras:', error);
    return null;
  }
};

export const eliminarBaseDeDatos = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/productos.db`;
  const existe = await FileSystem.getInfoAsync(dbPath);
  if (existe.exists) {
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
    console.log('🗑️ Base de datos borrada exitosamente');
  } else {
    console.log('ℹ️ No se encontró base para borrar');
  }
};
export const eliminarProducto = async (id: number, callback?: () => void) => {
  console.log('🗑️ Eliminando producto de DB:', id);
  try {
    const dbInstance = getDb();
    const result = await dbInstance.runAsync('DELETE FROM productos WHERE id = ?', [id]);
    console.log('✅ Producto eliminado en DB exitosamente. Filas afectadas:', result.changes);
    callback?.();
  } catch (error) {
    console.error('❌ Error al eliminar producto de DB:', error);
    throw error;
  }
};

export const actualizarProducto = async (producto: Producto, callback?: () => void) => {
  const { id, nombre, precioCosto, precioVenta, stock, codigoBarras } = producto;
  console.log('📝 Actualizando producto en DB:', producto);
  try {
    const dbInstance = getDb();
    if (id === undefined || id === null) {
      console.error('❌ Error: El ID del producto es indefinido o nulo al intentar actualizar.');
      throw new Error('ID del producto no puede ser nulo para actualizar.');
    }
    const result = await dbInstance.runAsync(
  'UPDATE productos SET nombre = ?, precioCosto = ?, precioVenta = ?, stock = ?, codigoBarras = ? WHERE id = ?',
  [nombre, precioCosto, precioVenta, stock, codigoBarras || null, id]
);
    console.log('✅ Producto actualizado en DB exitosamente. Filas afectadas:', result.changes);
    callback?.();
  } catch (error) {
    console.error('❌ Error al actualizar producto de DB:', error);
    throw error;
  }
};

export const registrarVenta = async (venta: Venta, callback?: () => void) => {
  console.log('📥 Registrando venta en DB:', venta);
  try {
    const dbInstance = getDb();
    // Iniciar transacción
    await dbInstance.execAsync('BEGIN TRANSACTION;');
    
    // Insertar la venta
    const ventaResult = await dbInstance.runAsync(
      'INSERT INTO ventas (fecha, totalProductos, precioTotal, ganancia) VALUES (?, ?, ?, ?)',
      [venta.fecha, venta.totalProductos, venta.precioTotal, venta.ganancia]
    );
    const ventaId = ventaResult.lastInsertRowId;

    // Insertar detalles de la venta y actualizar stock
    for (const detalle of venta.productos) {
      // Insertar detalle de venta
      await dbInstance.runAsync(
        'INSERT INTO ventas_detalle (ventaId, productoId, cantidad, precioUnitario, ganancia) VALUES (?, ?, ?, ?, ?)',
        [ventaId, detalle.productoId, detalle.cantidad, detalle.precioUnitario, detalle.ganancia]
      );

      // Actualizar stock del producto o variante
      if (detalle.varianteId) {
        await dbInstance.runAsync(
          'UPDATE variantes_producto SET stock = stock - ? WHERE id = ?',
          [detalle.cantidad, detalle.varianteId]
        );
      } else {
        await dbInstance.runAsync(
          'UPDATE productos SET stock = stock - ? WHERE id = ?',
          [detalle.cantidad, detalle.productoId]
        );
      }
    }

    // Confirmar transacción
    await dbInstance.execAsync('COMMIT;');
    console.log('✅ Venta registrada exitosamente');
    callback?.();
  } catch (error) {
    // Revertir transacción en caso de error
    await getDb().execAsync('ROLLBACK;'); // Use getDb() here as well
    console.error('❌ Error al registrar venta:', error);
    throw error;
  }
};

export const obtenerVentas = async (callback: (ventas: Venta[]) => void) => {
  console.log('📋 Obteniendo ventas de DB...');
  try {
    const dbInstance = getDb();
    const ventas = await dbInstance.getAllAsync<Venta & { detalles: string }>(
      `SELECT v.*, 
             GROUP_CONCAT(vd.productoId || ',' || vd.cantidad || ',' || vd.precioUnitario || ',' || vd.ganancia) as detalles
      FROM ventas v
      LEFT JOIN ventas_detalle vd ON v.id = vd.ventaId
      GROUP BY v.id
      ORDER BY v.fecha DESC;`
    );

    // Procesar los resultados para construir el objeto Venta
    const ventasProcesadas: Venta[] = ventas.map(venta => {
      const detalles = venta.detalles ? venta.detalles.split(',').map((detalle: string) => {
        const [productoIdStr, cantidadStr, precioUnitarioStr, gananciaStr] = detalle.split(',');
        return {
          productoId: parseInt(productoIdStr),
          cantidad: parseInt(cantidadStr),
          precioUnitario: parseFloat(precioUnitarioStr),
          ganancia: parseFloat(gananciaStr),
        };
      }) : [];

      return {
        id: venta.id,
        fecha: venta.fecha,
        totalProductos: venta.totalProductos,
        precioTotal: venta.precioTotal,
        ganancia: venta.ganancia,
        productos: detalles
      };
    });

    console.log('💰 Ventas obtenidas:', ventasProcesadas);
    callback(ventasProcesadas);
  } catch (error) {
    console.error('❌ Error al obtener ventas de DB:', error);
    callback([]);
  }
};

export const obtenerEstadisticas = async (): Promise<{
  gananciaHoy: number;
  ventasHoy: number;
  ventasTotales: number;
  gananciaTotal: number;
  productosVendidos: number;
  productosMasVendidos: { nombre: string; cantidad: number }[];
  stockTotal: number;
  productosStockCritico: number;
  gananciaMesActual: number;
  productoMasRentable: { nombre: string; rentabilidad: number } | null;
  ganancias: {
    dia: number;
    mes: number;
    anio: number;
  };
}> => {
  try {
    const dbInstance = getDb();
    const hoy = new Date().toISOString().split('T')[0];
    const mesActual = hoy.slice(0, 7); // YYYY-MM
    const anioActual = hoy.slice(0, 4); // YYYY

    const [ganDia, ganMes, ganAnio, ventasHoyResult] = await Promise.all([
      dbInstance.getFirstAsync<{ total: number }>(`SELECT SUM(ganancia) FROM ventas WHERE substr(fecha, 1, 10) = ?`, [hoy]),
      dbInstance.getFirstAsync<{ total: number }>(`SELECT SUM(ganancia) as total FROM ventas WHERE substr(fecha, 1, 7) = ?`, [mesActual]),
      dbInstance.getFirstAsync<{ total: number }>(`SELECT SUM(ganancia) as total FROM ventas WHERE substr(fecha, 1, 4) = ?`, [anioActual]),
      dbInstance.getFirstAsync<{ total: number }>(`SELECT SUM(precioTotal) as total FROM ventas WHERE substr(fecha, 1, 10) = ?`, [hoy]),
    ]);
    // Ventas y ganancias
    const res1 = await dbInstance.getFirstAsync<{
      ventasTotales: number;
      gananciaTotal: number;
      productosVendidos: number;
    }>(`
      SELECT 
        SUM(precioTotal) as ventasTotales,
        SUM(ganancia) as gananciaTotal,
        SUM(totalProductos) as productosVendidos
      FROM ventas;
    `);

    // Productos más vendidos (top 5)
    const masVendidos = await dbInstance.getAllAsync<{ nombre: string; cantidad: number }>(`
      SELECT p.nombre, SUM(vd.cantidad) as cantidad
      FROM ventas_detalle vd
      JOIN productos p ON p.id = vd.productoId
      GROUP BY vd.productoId
      ORDER BY cantidad DESC
      LIMIT 5;
    `);

    // Stock total
    const stockData = await dbInstance.getFirstAsync<{ stockTotal: number }>(`SELECT SUM(stock) as stockTotal FROM productos;`);

    // Productos con stock crítico
    const stockCriticoData = await dbInstance.getFirstAsync<{ productosStockCritico: number }>(`SELECT COUNT(*) as productosStockCritico FROM productos WHERE stock <= 5;`);

    // Ganancia del mes actual
    const gananciaMes = await dbInstance.getFirstAsync<{ gananciaMesActual: number }>(`
      SELECT SUM(ganancia) as gananciaMesActual
      FROM ventas
      WHERE substr(fecha, 1, 7) = ?;
    `, [mesActual]);

    // Producto más rentable (ganancia acumulada / cantidad)
    const rentable = await dbInstance.getFirstAsync<{ nombre: string; rentabilidad: number }>(`
      SELECT p.nombre, SUM(vd.ganancia)*1.0 / SUM(vd.cantidad) as rentabilidad
      FROM ventas_detalle vd
      JOIN productos p ON p.id = vd.productoId
      GROUP BY vd.productoId
      ORDER BY rentabilidad DESC
      LIMIT 1;
    `);

    return {
      gananciaHoy: ganDia?.total || 0,
      ventasHoy: ventasHoyResult?.total || 0,
      ventasTotales: res1?.ventasTotales || 0,
      gananciaTotal: res1?.gananciaTotal || 0,
      productosVendidos: res1?.productosVendidos || 0,
      productosMasVendidos: masVendidos || [],
      stockTotal: stockData?.stockTotal || 0,
      productosStockCritico: stockCriticoData?.productosStockCritico || 0,
      gananciaMesActual: gananciaMes?.gananciaMesActual || 0,
      productoMasRentable: rentable?.nombre
        ? { nombre: rentable.nombre, rentabilidad: rentable.rentabilidad }
        : null,
       ganancias: {
      dia: ganDia?.total || 0,
      mes: ganMes?.total || 0,
      anio: ganAnio?.total || 0,
    },
    };
  } catch (error) {
    console.error('❌ Error al obtener estadísticas extendidas:', error);
    throw error;
  }
};

export const obtenerVentasPorMes = async (): Promise<{ mes: string; total: number }[]> => {
  try {
    const dbInstance = getDb();
    const resultados = await dbInstance.getAllAsync(`
      SELECT substr(fecha, 1, 7) as mes, SUM(precioTotal) as total
      FROM ventas
      GROUP BY mes
      ORDER BY mes ASC
    `);

    return resultados.map((r: any) => ({
      mes: r.mes, // "2025-01"
      total: r.total || 0,
    }));
  } catch (error) {
    console.error('❌ Error al obtener ventas por mes:', error);
    return [];
  }
};


// Funciones para manejar materiales
export const insertarMaterial = async (material: Material, callback?: () => void) => {
  const { nombre, precioCosto, unidad, stock } = material;
  try {
    const dbInstance = getDb();
    const result = await dbInstance.runAsync(
      'INSERT INTO materiales (nombre, precioCosto, unidad, stock) VALUES (?, ?, ?, ?)',
      [nombre, precioCosto, unidad, stock]
    );
    console.log('✅ Material insertado en DB exitosamente. ID:', result.lastInsertRowId);
    callback?.();
  } catch (error) {
    console.error('❌ Error al insertar material en DB:', error);
    throw error;
  }
};

export const obtenerMateriales = async (callback: (materiales: Material[]) => void) => {
  try {
    console.log('🔍 obtenerMateriales - Iniciando consulta a la base de datos');
    const dbInstance = getDb();
    const materiales = await dbInstance.getAllAsync<Material>('SELECT * FROM materiales;');
    console.log('🔍 obtenerMateriales - Resultado de la consulta:', materiales);
    console.log('🔍 obtenerMateriales - Cantidad de materiales:', materiales.length);
    console.log('🔍 obtenerMateriales - Estructura del primer material:', materiales[0]);
    callback(materiales);
  } catch (error) {
    console.error('❌ Error al obtener materiales de DB:', error);
    callback([]);
  }
};

export const actualizarMaterial = async (material: Material, callback?: () => void) => {
  const { id, nombre, precioCosto, unidad, stock } = material;
  console.log('📝 Actualizando material en DB:', material);
  try {
    if (id === undefined || id === null) {
      throw new Error('ID del material no puede ser nulo para actualizar.');
    }
    const dbInstance = getDb();
    const result = await dbInstance.runAsync(
      'UPDATE materiales SET nombre = ?, precioCosto = ?, unidad = ?, stock = ? WHERE id = ?',
      [nombre, precioCosto, unidad, stock, id]
    );
    console.log('✅ Material actualizado en DB exitosamente. Filas afectadas:', result.changes);
    if (callback) callback();
  } catch (error) {
    console.error('❌ Error al actualizar material en DB:', error);
    throw error;
  }
};

export const eliminarMaterial = async (id: number, callback?: () => void) => {
  console.log('🗑️ Eliminando material de DB con ID:', id);
  try {
    const dbInstance = getDb();
    const result = await dbInstance.runAsync(
      'DELETE FROM materiales WHERE id = ?',
      [id]
    );
    console.log('✅ Material eliminado de DB exitosamente. Filas afectadas:', result.changes);
    if (callback) callback();
  } catch (error) {
    console.error('❌ Error al eliminar material de DB:', error);
    throw error;
  }
};

// Funciones para manejar componentes de productos
export const insertarComponenteProducto = async (componente: ComponenteProducto, callback?: () => void) => {
  const { productoId, materialId, cantidad } = componente;
  try {
    const dbInstance = getDb();
    const result = await dbInstance.runAsync(
      'INSERT INTO componentes_producto (productoId, materialId, cantidad) VALUES (?, ?, ?)',
      [productoId, materialId, cantidad]
    );
    console.log('✅ Componente insertado en DB exitosamente. ID:', result.lastInsertRowId);
    
    // Actualizar el costo del producto
    await actualizarCostoProducto(productoId);
    
    callback?.();
  } catch (error) {
    console.error('❌ Error al insertar componente en DB:', error);
    throw error;
  }
};

export const obtenerComponentesProducto = async (productoId: number, callback: (componentes: ComponenteProducto[]) => void) => {
  try {
    const dbInstance = getDb();
    const componentes = await dbInstance.getAllAsync<ComponenteProducto>(
      'SELECT * FROM componentes_producto WHERE productoId = ?',
      [productoId]
    );
    console.log('📦 Componentes obtenidos:', componentes);
    callback(componentes);
  } catch (error) {
    console.error('❌ Error al obtener componentes de DB:', error);
    callback([]);
  }
};

// Función para actualizar el costo de un producto basado en sus componentes
const actualizarCostoProducto = async (productoId: number) => {
  try {
    const dbInstance = getDb();
    const costoTotal = await dbInstance.getFirstAsync<{ costoTotal: number }>(
      `
      SELECT SUM(cp.cantidad * m.precioCosto) as costoTotal
      FROM componentes_producto cp
      JOIN materiales m ON cp.materialId = m.id
      WHERE cp.productoId = ?
    `,
      [productoId]
    );

    await dbInstance.runAsync(
      'UPDATE productos SET precioCosto = ? WHERE id = ?',
      [costoTotal?.costoTotal || 0, productoId]
    );
  } catch (error) {
    console.error('❌ Error al actualizar costo del producto:', error);
    throw error;
  }
};

// Función para actualizar los costos de todos los productos
const actualizarCostosProductos = async () => {
  try {
    const dbInstance = getDb();
    const productos = await dbInstance.getAllAsync<{ id: number }>('SELECT id FROM productos');
    for (const producto of productos) {
      await actualizarCostoProducto(producto.id);
    }
  } catch (error) {
    console.error('❌ Error al actualizar costos de productos:', error);
    throw error;
  }
};

export const insertarVariante = async (variante: VarianteProducto, callback?: () => void) => {
  const { productoId, nombre, stock, codigoBarras } = variante;
  try {
    const dbInstance = getDb();
    const result = await dbInstance.runAsync(
  'INSERT INTO variantes_producto (productoId, nombre, stock, codigoBarras) VALUES (?, ?, ?, ?)',
  [productoId, nombre, stock, codigoBarras || null]
);
    console.log('✅ Variante insertada en DB exitosamente. ID:', result.lastInsertRowId);
    callback?.();
  } catch (error) {
    console.error('❌ Error al insertar variante en DB:', error);
    throw error;
  }
};

export const actualizarVariante = async (variante: VarianteProducto, callback?: () => void) => {
  const { id, nombre, stock, codigoBarras } = variante;
  try {
    const dbInstance = getDb();
    if (id === undefined || id === null) {
      console.error('❌ Error: El ID de la variante es indefinido o nulo al intentar actualizar.');
      throw new Error('ID de la variante no puede ser nulo para actualizar.');
    }
    await dbInstance.runAsync(
      'UPDATE variantes_producto SET nombre = ?, stock = ?, codigoBarras = ? WHERE id = ?',
      [nombre, stock, codigoBarras || null, id]
    );
    console.log('✅ Variante actualizada en DB exitosamente');
    callback?.();
  } catch (error) {
    console.error('❌ Error al actualizar variante en DB:', error);
    throw error;
  }
};

export const eliminarVariante = async (id: number, callback?: () => void) => {
  try {
    const dbInstance = getDb();
    await dbInstance.runAsync('DELETE FROM variantes_producto WHERE id = ?', [id]);
    console.log('✅ Variante eliminada de DB exitosamente');
    callback?.();
  } catch (error) {
    console.error('❌ Error al eliminar variante de DB:', error);
    throw error;
  }
};

export const eliminarComponenteProducto = async (componenteId: number, callback?: () => void): Promise<void> => {
  console.log('🗑️ Eliminando componente de producto:', componenteId);
  try {
    const dbInstance = getDb();
    // Paso 1: obtener el productoId del componente
    const result = await dbInstance.getFirstAsync<{ productoId: number }>(
      'SELECT productoId FROM componentes_producto WHERE id = ?',
      [componenteId]
    );

    if (!result || !result.productoId) {
      console.warn('⚠️ No se encontró el componente con ID:', componenteId);
      return;
    }

    const productoId = result.productoId;

    // Paso 2: eliminar el componente
    const deleteResult = await dbInstance.runAsync(
      'DELETE FROM componentes_producto WHERE id = ?',
      [componenteId]
    );
    console.log('✅ Componente eliminado. Filas afectadas:', deleteResult.changes);

    // Paso 3: actualizar el costo del producto
    await actualizarCostoProducto(productoId);

    callback?.();
  } catch (error) {
    console.error('❌ Error al eliminar componente de DB:', error);
    throw error;
  }
};

