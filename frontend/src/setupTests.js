import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';

// Initialize i18next for tests
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation
            }
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

Object.assign(global, { TextDecoder, TextEncoder });

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock global fetch if not available
if (!global.fetch) {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
        })
    );
}

// Suppress act warnings (if needed globally, but we handled it in ProjectContext)
// console.error = jest.fn(); // Optional: uncomment if console noise is too much, but better to fix root cause.
