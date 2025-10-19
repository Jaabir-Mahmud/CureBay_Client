import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get the base URL for API calls based on the environment
 * @returns {string} The API base URL
 */
export function getApiBaseUrl() {
  // In production, use the VITE_API_URL environment variable
  // In development, use relative paths with proxy
  return import.meta.env.MODE === 'production' 
    ? import.meta.env.VITE_API_URL || 'https://curebay-backend.onrender.com'
    : '';
}

/**
 * Create a full API URL
 * @param {string} path - The API endpoint path (e.g., '/api/users')
 * @returns {string} The full URL
 */
export function createApiUrl(path) {
  const baseUrl = getApiBaseUrl();
  // In development, we want relative paths that start with /
  // In production, we want the full URL
  if (baseUrl) {
    // Production: return full URL
    return baseUrl + path;
  } else {
    // Development: ensure path starts with /
    return path.startsWith('/') ? path : `/${path}`;
  }
}