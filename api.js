/**
 * api.js
 * Integración con Google Sheets mediante Google Apps Script
 * - Envío de datos
 * - Manejo de errores
 * - Respuestas del servidor
 */

import { CONFIG } from './config.js';

/**
 * Enviar datos a Google Apps Script
 */
export async function sendWorkoutData(data) {
    try {
        validateApiUrl();
        
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`Error servidor: ${response.status}`);
        }
        
        const result = await response.json();
        return {
            success: true,
            data: result
        };
        
    } catch (error) {
        console.error('Error al enviar datos:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Validar que la URL de API esté configurada correctamente
 */
function validateApiUrl() {
    const isPlaceholder = CONFIG.API_URL === 'https://script.google.com/macros/s/AKfycby9S9rDaPQ6NvggJzy1MU3aIWKrxlvsoPYFyqMYZLGwvgBd6TzZBOEBFBgtiL941elY/exec';
    const isEmpty = !CONFIG.API_URL || CONFIG.API_URL.trim() === '';
    const isValid = CONFIG.API_URL.includes('script.googleapis.com') || CONFIG.API_URL.includes('script.google.com');
    
    if (isPlaceholder || isEmpty) {
        throw new Error(
            'URL de Google Apps Script no configurada. ' +
            'Actualiza CONFIG.API_URL en config.js'
        );
    }
    
    if (!isValid) {
        throw new Error(
            'URL de Google Apps Script invalida. ' +
            'Debe contener script.googleapis.com o script.google.com'
        );
    }
}
