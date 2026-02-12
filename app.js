/**
 * app.js
 * Punto de entrada principal de la aplicación
 * Orquesta la inicialización y eventos principales
 */

import { 
    getCurrentDay, 
    setCurrentDay,
    initializeWorkoutData, 
    prepareSheetData,
    resetWorkoutData
} from './data.js';

import { 
    initializeDOM, 
    updateDayDisplay, 
    renderExercises, 
    showStatusMessage, 
    clearStatusMessage, 
    setFinishButtonEnabled,
    getFinishButton,
    setupDayButtons
} from './ui.js';

import { sendWorkoutData } from './api.js';

/**
 * Inicializar la aplicación
 */
async function initializeApp() {
    try {
        // Preparar elementos DOM
        if (!initializeDOM()) {
            console.error('No se pudieron inicializar elementos DOM');
            return;
        }
        
        // Cargar día actual (por defecto 1)
        const currentDay = getCurrentDay();
        
        // Inicializar datos de entrenamiento
        initializeWorkoutData();
        
        // Actualizar interfaz
        updateDayDisplay(currentDay);
        renderExercises(currentDay);
        
        // Configurar event listeners
        setupEventListeners();
        setupDaySelectionButtons();
        
        // Mantener datos al rotar pantalla
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const day = getCurrentDay();
                renderExercises(day);
            }, 100);
        });
        
        console.log('Aplicacion inicializada correctamente');
        
    } catch (error) {
        console.error('Error al inicializar aplicacion:', error);
    }
}

/**
 * Configurar event listeners para botones principales
 */
function setupEventListeners() {
    const finishBtn = getFinishButton();
    
    if (finishBtn) {
        finishBtn.addEventListener('click', handleFinishWorkout);
    }
}

/**
 * Configurar event listeners para selección de día
 */
function setupDaySelectionButtons() {
    setupDayButtons((selectedDay) => {
        handleDaySelection(selectedDay);
    });
}

/**
 * Manejar selección de día
 */
function handleDaySelection(day) {
    // Establecer el nuevo día
    setCurrentDay(day);
    
    // Limpiar datos de entrenamiento anterior
    resetWorkoutData();
    
    // Reinicializar datos para nuevo día
    initializeWorkoutData();
    
    // Actualizar interfaz
    updateDayDisplay(day);
    renderExercises(day);
    
    // Limpiar mensajes
    clearStatusMessage();
    setFinishButtonEnabled(true);
}

/**
 * Manejar envío de entrenamiento completado
 */
async function handleFinishWorkout() {
    try {
        // Preparar datos
        const workoutData = prepareSheetData();
        
        // Mostrar estado de carga
        showStatusMessage('Enviando...', 'loading');
        setFinishButtonEnabled(false);
        
        // Enviar a Google Sheets
        const result = await sendWorkoutData(workoutData);
        
        if (result.success) {
            showStatusMessage('Entrenamiento guardado exitosamente', 'success');
            
            // Esperar un poco después de guardar
            setTimeout(() => {
                finishWorkoutSession();
            }, 1500);
        } else {
            showStatusMessage(`Error: ${result.error}`, 'error');
            setFinishButtonEnabled(true);
        }
        
    } catch (error) {
        console.error('Error al procesar entrenamiento:', error);
        showStatusMessage('Error inesperado', 'error');
        setFinishButtonEnabled(true);
    }
}

/**
 * Finalizar sesión de entrenamiento
 */
function finishWorkoutSession() {
    // Limpiar datos de entrenamiento
    resetWorkoutData();
    
    // Reinicializar para el mismo día (usuario elige si quiere otro día)
    initializeWorkoutData();
    
    // Actualizar interfaz
    const currentDay = getCurrentDay();
    renderExercises(currentDay);
    clearStatusMessage();
    setFinishButtonEnabled(true);
}

/**
 * Punto de entrada - Esperar carga del DOM
 */
document.addEventListener('DOMContentLoaded', initializeApp);
