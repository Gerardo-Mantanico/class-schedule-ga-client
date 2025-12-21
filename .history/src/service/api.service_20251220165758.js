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
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text().catch(() => '');
      }

      // Construir un mensaje legible a partir de distintas formas de respuesta
      let message = response.statusText || `Error ${response.status}`;
      if (errorData) {
        if (typeof errorData === 'string') {
          message = errorData;
        } else if (errorData.message) {
          message = errorData.message;
        } else if (errorData.error) {
          message = errorData.error;
        } else if (Array.isArray(errorData) && errorData.length > 0) {
          try {
            // Intentar obtener mensajes individuales si vienen en un array
            const mapped = errorData.map((it) => (it && (it.message || it.defaultMessage || JSON.stringify(it))) ).join(' | ');
            message = mapped || JSON.stringify(errorData);
          } catch {
            message = JSON.stringify(errorData);
          }
        } else {
          message = JSON.stringify(errorData);
        }
      }

      // Log detallado del error
      console.error('Error API completo:', {
        status: response.status,
        statusText: response.statusText,
        endpoint: url,
        errorData,
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