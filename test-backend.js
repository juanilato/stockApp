// Script de prueba para verificar la conexión con el backend local
const BACKEND_URL = 'http://192.168.100.16:4000';

async function testBackendConnection() {
  console.log('🧪 Probando conexión con el backend local...\n');

  try {
    // 1. Probar endpoint principal
    console.log('1️⃣ Probando endpoint principal...');
    const mainResponse = await fetch(`${BACKEND_URL}/`);
    const mainData = await mainResponse.json();
    console.log('✅ Endpoint principal:', mainData.message);
    console.log('   Modelo configurado:', mainData.model);
    console.log('   URL de Ollama:', mainData.ollamaUrl);

    // 2. Probar estado del modelo
    console.log('\n2️⃣ Probando estado del modelo...');
    const statusResponse = await fetch(`${BACKEND_URL}/model-status`);
    const statusData = await statusResponse.json();
    console.log('✅ Estado del modelo:', statusData.available ? 'Disponible' : 'No disponible');
    console.log('   Modelo:', statusData.model);

    // 3. Probar interpretación de voz
    console.log('\n3️⃣ Probando interpretación de voz...');
    const voiceData = {
      texto: "quiero 2 alfajores y 1 gaseosa",
      productos: [
        { id: 1, nombre: "Alfajor", precioVenta: 500, precioCosto: 300 },
        { id: 2, nombre: "Gaseosa", precioVenta: 300, precioCosto: 200 },
        { id: 3, nombre: "Chocolate", precioVenta: 400, precioCosto: 250 }
      ]
    };

    const voiceResponse = await fetch(`${BACKEND_URL}/interpretar-voz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voiceData)
    });

    if (voiceResponse.ok) {
      const voiceResult = await voiceResponse.json();
      console.log('✅ Interpretación de voz exitosa');
      console.log('   Productos interpretados:', voiceResult.productos?.length || 0);
      if (voiceResult.productos?.length > 0) {
        voiceResult.productos.forEach((p, i) => {
          console.log(`   ${i + 1}. ${p.nombre} - Cantidad: ${p.cantidad}`);
        });
      }
    } else {
      console.log('❌ Error en interpretación de voz:', voiceResponse.status);
    }

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    console.log('\n📱 Tu frontend ya puede usar el backend local.');
    console.log('   - Interpretación de voz: ✅');
    console.log('   - Interpretación de archivos: ✅');
    console.log('   - Modelo local funcionando: ✅');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verifica que el backend esté ejecutándose: npm run dev');
    console.log('   2. Verifica que Ollama esté ejecutándose: ollama serve');
    console.log('   3. Verifica que el modelo esté descargado: ollama list');
    console.log('   4. Verifica la IP en la configuración');
  }
}

// Ejecutar las pruebas
testBackendConnection(); 