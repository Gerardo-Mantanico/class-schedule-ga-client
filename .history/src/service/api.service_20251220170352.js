// Configuración base
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api/v1';

// Función interna para hacer requests
const request = async (endpoint, method, data = null, customHeaders = {}) => {
  let url = `${baseURL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Añadir token de autenticación si existe
  if (globalThis.window !== undefined) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    
    // Manejo de respuestas no exitosas
    if (!response.ok) {
      
      // *** INICIO DEL MANEJO DE ERRORES REFORZADO ***
      
      // 1. Leer el cuerpo de la respuesta como texto para evitar problemas de Content-Type.
      const responseText = await response.text();
      let errorData = {};
      let message = response.statusText || `Error ${response.status}`; // Mensaje por defecto

      // 2. Intentar parsear el texto si hay contenido
      if (responseText) {
        try {
          // Si el texto es JSON válido, parseamos
          errorData = JSON.parse(responseText);
        } catch (e) {
          // Si el parseo falla (es texto plano o JSON malformado),
          // usamos el texto completo como data.
          errorData = responseText;
        }
      }

      // 3. Determinar el mensaje final a partir de errorData
      if (typeof errorData === 'string') {
        // Si es una cadena (texto plano), ese es el mensaje.
        message = errorData;
      } else if (typeof errorData === 'object' && errorData !== null) {
        // Si es un objeto (JSON):
        if (errorData.message) {
          message = errorData.message;
        } else if (errorData.error) {
          message = errorData.error;
        } else if (Array.isArray(errorData) && errorData.length > 0) {
          // Lógica para arrays de errores
          try {
            const mapped = errorData.map((it) => (it && (it.message || it.defaultMessage || JSON.stringify(it))) ).join(' | ');
            message = mapped || JSON.stringify(errorData);
          } catch {
            message = JSON.stringify(errorData);
          }
        } else if (responseText) {
            // Último recurso: si es un objeto sin campos 'message'/'error',
            // usamos el texto original si existe.
            message = responseText;
        }
      }
      
      // *** FIN DEL MANEJO DE ERRORES REFORZADO ***


      // Log detallado del error
      console.error('Error API completo:', {
        status: response.status,
        statusText: response.statusText,
        endpoint: url,
        errorData: errorData, 
        fullError: message,
      });

      // Adjuntar el body original al Error para que el código superior pueda inspeccionarlo
      const err = new Error(message);
      try {
        err.data = errorData; // attach extra info
      } catch {
        // ignore if attachment fails
      }
      throw err;
    }

    // Retornar datos parseados para respuestas exitosas
    // Manejar 204 No Content
    if (response.status === 204) {
      return null;
    }

    // Verificar si hay contenido en la respuesta
    const contentLength = response.headers.get('content-length');
    
    // Si no hay contenido, retornar null
    if (contentLength === '0' || !response.text) {
      return null;
    }

    try {
      const responseData = await response.json();
      return responseData;
    } catch {
      // Si no puede parsear JSON pero es 200, retornar null
      return null;
    }

  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
};

// Objeto API con métodos helper
const api = {
  get: (endpoint, options = {}) => {
    let url = endpoint;
    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return request(url, 'GET', null, options.headers);
  },
  post: (endpoint, data, options = {}) => request(endpoint, 'POST', data, options.headers),
  put: (endpoint, data, options = {}) => request(endpoint, 'PUT', data, options.headers),
  delete: (endpoint, options = {}) => request(endpoint, 'DELETE', null, options.headers),
};

export default api;