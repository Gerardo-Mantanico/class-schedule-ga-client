import { getStoredToken } from './auth-storage';

// Configuración base
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const parseErrorBody = async (response) => {
  try {
    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  if (globalThis.window === undefined) {
    return {};
  }

  const token = getStoredToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const buildErrorMessage = (response, errorData) => {
  let message = response.statusText || `Error ${response.status}`;

  if (errorData != null) {
    if (typeof errorData === 'string') {
      message = errorData.trim() || message;
    } else if (errorData.message) {
      message = errorData.message;
    } else if (errorData.error) {
      message = errorData.error;
    } else if (Array.isArray(errorData) && errorData.length > 0) {
      try {
        const mapped = errorData
          .map((it) => (it && (it.message || it.defaultMessage || JSON.stringify(it))))
          .join(' | ');
        message = mapped || JSON.stringify(errorData);
      } catch {
        message = JSON.stringify(errorData);
      }
    } else {
      message = JSON.stringify(errorData);
    }
  }

  if (!message || message === '{}') {
    const statusSuffix = response.statusText ? ` - ${response.statusText}` : '';
    return `Error ${response.status}${statusSuffix}`;
  }

  return message;
};

const createApiError = (message, response, endpoint, errorData) => {
  const err = new Error(message);
  try {
    err.status = response.status;
    err.statusText = response.statusText;
    err.endpoint = endpoint;
    err.data = errorData;
  } catch {
    // ignore if attachment fails
  }

  return err;
};

const parseSuccessBody = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || !response.text) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};


// Función interna para hacer requests
const request = async (endpoint, method, data = null, customHeaders = {}) => {
  const url = `${baseURL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...customHeaders,
  };

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await parseErrorBody(response.clone());
      const message = buildErrorMessage(response, errorData);

      console.error('Error API completo:', {
        status: response.status,
        statusText: response.statusText,
        endpoint: url,
        errorData,
        fullError: message,
      });

      throw createApiError(message, response, url, errorData);
    }

    return parseSuccessBody(response);

  } catch (error) {
    if (!(error instanceof Error) || typeof error.status !== 'number') {
      console.error('Error en la solicitud:', error);
    }
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
  patch: (endpoint, data, options = {}) => request(endpoint, 'PATCH', data, options.headers),
  delete: (endpoint, options = {}) => request(endpoint, 'DELETE', null, options.headers),
};

export default api;
