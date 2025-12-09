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
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || response.statusText || `Error ${response.status}`;
      throw new Error(message);
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