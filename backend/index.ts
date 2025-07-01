// Endpoint para interpretar el archivo subido
app.post('/interpretar', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  console.log('[BACKEND] POST /interpretar - Iniciando interpretación de archivo');
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    console.log('[BACKEND][ERROR] No se subió ningún archivo');
    res.status(400).json({ error: 'No se subió ningún archivo' });
    return;
  }
  try {
    console.log('[BACKEND] Extrayendo contenido del archivo:', file.originalname, file.mimetype);
    const content = await extractContent(file.path, file.mimetype);
    // Prompt para la IA
    const prompt = `Esto es un archivo de productos. Quiero que los devuelvas identificando cada uno en un array JSON, con los campos: nombre, precioVenta, precioCosto, stock (si está). La respuesta debe ser SOLO el array JSON, sin explicaciones, sin texto extra, sin bloque markdown, sin etiquetas, solo el array. Si no puedes identificar productos, responde [] (array vacío).

Texto extraído:
"""
${content}
"""`;
    console.log('[BACKEND] Prompt enviado a Groq:', prompt.slice(0, 500), '...');
    const groqResponse = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: 'Eres un sistema de gestión de stock para una app móvil.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 1200,
      }),
    });
    const groqData = await groqResponse.json();
    let responseText = groqData.choices?.[0]?.message?.content || '';
    console.log('[BACKEND] Respuesta cruda de Groq:', responseText);
    responseText = responseText.trim();
    // Limpiar bloque markdown si existe
    const codeBlockMatch = responseText.match(/```json\s*([\s\S]*?)```/i) || responseText.match(/```\s*([\s\S]*?)```/i);
    if (codeBlockMatch) {
      responseText = codeBlockMatch[1].trim();
    }
    // Extraer el primer array u objeto JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('[BACKEND][ERROR] No se pudo interpretar la respuesta de la IA:', responseText);
      res.status(200).json({ error: 'No se pudo interpretar la respuesta de la IA', raw: responseText });
      return;
    }
    const data = JSON.parse(jsonMatch[0]);
    console.log('[BACKEND] Respuesta parseada enviada al frontend:', data);
    res.json(data);
  } catch (error: any) {
    console.error('[BACKEND][ERROR] Error interpretando archivo:', error);
    res.status(500).json({ error: 'Error interpretando archivo', details: error.message });
  }
});

// Endpoint para interpretar voz
app.post('/interpretar-voz', async (req: Request, res: Response): Promise<void> => {
  console.log('[BACKEND] POST /interpretar-voz - Iniciando interpretación de voz');
  try {
    const { texto, productos } = req.body;
    console.log('[BACKEND] Texto recibido:', texto);
    console.log('[BACKEND] Productos recibidos:', productos?.length || 0);
    if (!texto) {
      console.log('[BACKEND][ERROR] Se requiere texto');
      res.status(400).json({ error: 'Se requiere texto' });
      return;
    }
    if (!productos || !Array.isArray(productos)) {
      console.log('[BACKEND][ERROR] Se requiere array de productos');
      res.status(400).json({ error: 'Se requiere array de productos' });
      return;
    }
    const prompt = `Eres un asistente de ventas inteligente. El cliente dijo: "${texto}"

Tienes acceso a esta base de datos de productos disponibles:
${JSON.stringify(productos, null, 2)}

Analiza el texto del cliente e identifica qué productos quiere comprar y en qué cantidad. 

Reglas IMPORTANTES:
1. SOLO devuelve productos que existan EXACTAMENTE en la base de datos proporcionada
2. Busca coincidencias exactas o muy similares en los nombres de productos
3. Extrae las cantidades mencionadas
4. Si no se menciona cantidad, asume 1
5. Si no encuentras productos que coincidan, devuelve array vacío
6. NO inventes productos que no estén en la base de datos

Responde SOLO con un array JSON de objetos con esta estructura:
[
  {
    "id": ID_DEL_PRODUCTO_EN_LA_DB,
    "nombre": "NOMBRE_EXACTO_DEL_PRODUCTO_EN_LA_DB", 
    "cantidad": CANTIDAD_NUMERICA,
    "precioVenta": PRECIO_DE_VENTA_DEL_PRODUCTO,
    "precioCosto": PRECIO_DE_COSTO_DEL_PRODUCTO
  }
]

Ejemplo de respuesta:
[{"id": 25, "nombre": "Cachafaz conitos", "cantidad": 2, "precioVenta": 500, "precioCosto": 300}]

NO incluyas explicaciones, solo el array JSON.`;
    console.log('[BACKEND] Prompt enviado a Groq:', prompt.slice(0, 500), '...');
    const groqResponse = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: 'Eres un asistente de ventas especializado en interpretar pedidos de voz y encontrar productos exactos en una base de datos.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });
    const groqData = await groqResponse.json();
    const responseText = groqData.choices?.[0]?.message?.content || '';
    console.log('[BACKEND] Respuesta cruda de Groq:', responseText);
    // Limpiar y parsear la respuesta
    let cleanResponse = responseText.trim();
    // Remover bloques de código si existen
    const codeBlockMatch = cleanResponse.match(/```json\s*([\s\S]*?)```/i) || cleanResponse.match(/```\s*([\s\S]*?)```/i);
    if (codeBlockMatch) {
      cleanResponse = codeBlockMatch[1].trim();
    }
    // Extraer el array JSON
    const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('[BACKEND][ERROR] No se pudo interpretar la respuesta de la IA:', cleanResponse);
      res.status(200).json({ productos: [] });
      return;
    }
    const productosInterpretados = JSON.parse(jsonMatch[0]);
    console.log('[BACKEND] Respuesta parseada enviada al frontend:', productosInterpretados);
    res.json({ 
      productos: productosInterpretados,
      textoOriginal: texto 
    });
  } catch (error: any) {
    console.error('[BACKEND][ERROR] Error interpretando voz:', error);
    res.status(500).json({ 
      error: 'Error interpretando voz', 
      details: error.message,
      productos: [] 
    });
  }
}); 