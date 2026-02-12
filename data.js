/**
 * data.js
 * Gestión del estado de la aplicación
 * - Control del día actual
 * - Almacenamiento local
 * - Datos del entrenamiento
 */

import { CONFIG, ROUTINE } from './config.js';

/**
 * Estado interno de la aplicación
 */
let state = {
    currentDay: 1,
    workoutData: {}
};

/**
 * Obtener el día actual desde memoria
 */
export function getCurrentDay() {
    return state.currentDay;
}

/**
 * Establecer el día actual en memoria (sin guardar en localStorage)
 */
export function setCurrentDay(day) {
    if (day < 1 || day > CONFIG.TOTAL_DAYS) {
        console.warn(`Dia invalido: ${day}. Usando dia 1.`);
        day = 1;
    }
    state.currentDay = day;
}

/**
 * Guardar el día actual en localStorage
 */
export function saveCurrentDay(day) {
    if (day < 1 || day > CONFIG.TOTAL_DAYS) {
        console.warn(`Dia invalido: ${day}. Usando dia 1.`);
        day = 1;
    }
    state.currentDay = day;
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY_DAY, day);
}

/**
 * Limpiar datos de entrenamiento actual (sin cambiar dia)
 */
export function resetWorkoutData() {
    clearWorkoutData();
}

/**
 * Obtener la rutina del día especificado
 */
export function getDayRoutine(day) {
    const key = `day${day}`;
    return ROUTINE[key] || ROUTINE.day1;
}

/**
 * Inicializar datos de entrenamiento para el día actual
 */
export function initializeWorkoutData() {
    const dayRoutine = getDayRoutine(state.currentDay);
    
    state.workoutData = {};
    
    dayRoutine.exercises.forEach((exercise, exerciseIndex) => {
        const exerciseKey = `exercise${exerciseIndex}`;
        state.workoutData[exerciseKey] = {};
        
        for (let setNum = 1; setNum <= exercise.sets; setNum++) {
            const setKey = `set${setNum}`;
            state.workoutData[exerciseKey][setKey] = {
                weight: '',
                unit: CONFIG.DEFAULT_UNIT,
                completed: false
            };
        }
    });
}

/**
 * Obtener datos de entrenamiento actual
 */
export function getWorkoutData() {
    return state.workoutData;
}

/**
 * Actualizar peso para una serie específica
 */
export function updateSetWeight(exerciseIndex, setIndex, weight) {
    const exerciseKey = `exercise${exerciseIndex}`;
    const setKey = `set${setIndex}`;
    
    if (state.workoutData[exerciseKey] && state.workoutData[exerciseKey][setKey]) {
        state.workoutData[exerciseKey][setKey].weight = weight;
    }
}

/**
 * Actualizar unidad para una serie específica
 */
export function updateSetUnit(exerciseIndex, setIndex, unit) {
    const exerciseKey = `exercise${exerciseIndex}`;
    const setKey = `set${setIndex}`;
    
    if (state.workoutData[exerciseKey] && state.workoutData[exerciseKey][setKey]) {
        state.workoutData[exerciseKey][setKey].unit = unit;
    }
}

/**
 * Marcar una serie como completada o no
 */
export function toggleSetCompleted(exerciseIndex, setIndex) {
    const exerciseKey = `exercise${exerciseIndex}`;
    const setKey = `set${setIndex}`;
    
    if (state.workoutData[exerciseKey] && state.workoutData[exerciseKey][setKey]) {
        state.workoutData[exerciseKey][setKey].completed = 
            !state.workoutData[exerciseKey][setKey].completed;
        return state.workoutData[exerciseKey][setKey].completed;
    }
}

/**
 * Obtener total de series para el día actual
 */
export function getTotalSets() {
    const dayRoutine = getDayRoutine(state.currentDay);
    return dayRoutine.exercises.reduce((total, exercise) => total + exercise.sets, 0);
}

/**
 * Obtener cantidad de series completadas
 */
export function getCompletedSets() {
    let completed = 0;
    
    Object.keys(state.workoutData).forEach(exerciseKey => {
        const exercise = state.workoutData[exerciseKey];
        Object.keys(exercise).forEach(setKey => {
            if (exercise[setKey].completed) {
                completed++;
            }
        });
    });
    
    return completed;
}

/**
 * Obtener porcentaje de progreso (0-100)
 */
export function getProgressPercentage() {
    const total = getTotalSets();
    if (total === 0) return 0;
    
    const completed = getCompletedSets();
    return Math.round((completed / total) * 100);
}

/**
 * Preparar datos para enviar a Google Sheets
 */
export function prepareSheetData() {
    const dayRoutine = getDayRoutine(state.currentDay);
    const fecha = new Date().toISOString().split('T')[0];
    const ejercicios = [];
    
    dayRoutine.exercises.forEach((exercise, exerciseIndex) => {
        const exerciseKey = `exercise${exerciseIndex}`;
        
        for (let setNum = 1; setNum <= exercise.sets; setNum++) {
            const setKey = `set${setNum}`;
            const setData = state.workoutData[exerciseKey][setKey];
            
            ejercicios.push({
                nombre: exercise.name,
                serie: setNum,
                peso: setData.weight || 0,
                unidad: setData.unit,
                completado: setData.completed ? 'Si' : 'No'
            });
        }
    });
    
    return {
        fecha: fecha,
        dia: state.currentDay,
        ejercicios: ejercicios
    };
}

/**
 * Limpiar datos de entrenamiento
 */
export function clearWorkoutData() {
    state.workoutData = {};
}
