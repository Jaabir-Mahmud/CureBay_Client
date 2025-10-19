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
  // In production, use the Render backend URL
  // In development, use relative paths with proxy
  return import.meta.env.MODE === 'production' 
    ? 'https://curebay-backend.onrender.com'
    : '';
}

/**
 * Create a full API URL
 * @param {string} path - The API endpoint path (e.g., '/api/users')
 * @returns {string} The full URL
 */
export function createApiUrl(path) {
  const baseUrl = getApiBaseUrl();
  // Remove leading slash from path if baseUrl is empty (development)
  const normalizedPath = baseUrl ? path : path.startsWith('/') ? path : `/${path}`;
  return baseUrl + normalizedPath;
}