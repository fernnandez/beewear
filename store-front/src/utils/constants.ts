export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'BeeWear Store',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
}; 

export const DARK_COLOR = "#212529";

export const DARK_BORDER_COLOR = "#212529";