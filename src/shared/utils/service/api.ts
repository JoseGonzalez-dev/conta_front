import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const BASE_URL =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    process.env.REACT_APP_API_URL ||
    'http://localhost:8000';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true, // Enviar cookies automáticamente con cada petición
});

// Las cookies se envían automáticamente con withCredentials: true
// No es necesario agregar el token manualmente al header
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Las cookies se manejan automáticamente por el navegador
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: centralized response handling (errors, logging)
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        // Handle 401 Unauthorized errors (cookie expired or invalid)
        if (error?.response?.status === 401) {
            console.warn('⚠️ Unauthorized request - session may have expired');

            // Get current path to avoid infinite redirect loops
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath.startsWith('/auth');

            // Only redirect if not already on auth page
            if (!isAuthPage) {
                console.log('🔒 Cookie expired - redirecting to login');

                // Clear user data from localStorage
                try {
                    localStorage.removeItem('user');
                } catch (e) {
                    console.error('Error clearing localStorage:', e);
                }

                // Redirect to login page
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Set or clear auth token manually (deprecated - cookies are used now)
 * Kept for backward compatibility but does nothing
 */
export function setAuthToken(_token: string | null) {
    // Las cookies se manejan automáticamente
    // Esta función se mantiene por compatibilidad pero no hace nada
    console.debug('setAuthToken is deprecated - cookies are used automatically');
}

/**
 * Convenience wrappers with generic return types
 */
export async function get<T>(url: string, params?: AxiosRequestConfig['params']): Promise<T> {
    const res = await api.get<T>(url, { params });
    return res.data;
}

export async function post<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.post<T>(url, data, config);
    return res.data;
}

export async function put<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.put<T>(url, data, config);
    return res.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.delete<T>(url, config);
    return res.data;
}

export default api;