/**
 * ui.js
 * Renderizado y manipulación de la interfaz de usuario
 * - Actualización de elementos DOM
 * - Eventos de entrada
 * - Barra de progreso
 */

import { 
    getDayRoutine, 
    updateSetWeight, 
    updateSetUnit, 
    toggleSetCompleted,
    getCompletedSets,
    getTotalSets,
    getProgressPercentage
} from './data.js';

/**
 * Cache de elementos DOM para mejor rendimiento
 */
const DOM = {
    currentDay: null,
    exercisesContainer: null,
    completedSets: null,
    totalSets: null,
    progressFill: null,
    statusMessage: null,
    finishBtn: null,
    dayButtons: []
};

/**
 * Inicializar referencias a elementos DOM
 */
export function initializeDOM() {
    DOM.currentDay = document.getElementById('currentDay');
    DOM.exercisesContainer = document.getElementById('exercisesContainer');
    DOM.completedSets = document.getElementById('completedSets');
    DOM.totalSets = document.getElementById('totalSets');
    DOM.progressFill = document.getElementById('progressFill');
    DOM.statusMessage = document.getElementById('statusMessage');
    DOM.finishBtn = document.getElementById('finishBtn');
    
    // Botones de selección de día
    DOM.dayButtons = [
        document.getElementById('btnDay1'),
        document.getElementById('btnDay2'),
        document.getElementById('btnDay3'),
        document.getElementById('btnDay4')
    ];
    
    if (!DOM.currentDay || !DOM.exercisesContainer) {
        console.error('Elementos DOM requeridos no encontrados');
        return false;
    }
    
    return true;
}

/**
 * Actualizar el día mostrado con formato "Dia X"
 */
export function updateDayDisplay(day) {
    if (DOM.currentDay) {
        DOM.currentDay.textContent = `Dia ${day}`;
    }
    setActiveDayButton(day);
}

/**
 * Establecer el botón activo para el día seleccionado
 */
function setActiveDayButton(day) {
    DOM.dayButtons.forEach((btn, index) => {
        if (btn) {
            if (index + 1 === day) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
}

/**
 * Renderizar todos los ejercicios del día actual
 */
export function renderExercises(currentDay) {
    const dayRoutine = getDayRoutine(currentDay);
    DOM.exercisesContainer.innerHTML = '';
    
    dayRoutine.exercises.forEach((exercise, exerciseIdx) => {
        const exerciseElement = createExerciseElement(exercise, exerciseIdx);
        DOM.exercisesContainer.appendChild(exerciseElement);
    });
    
    updateProgressBar();
}

/**
 * Crear elemento DOM para un ejercicio
 */
function createExerciseElement(exercise, exerciseIndex) {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exercise';
    
    const title = document.createElement('div');
    title.className = 'exercise-title';
    title.textContent = exercise.name;
    exerciseDiv.appendChild(title);
    
    const setsContainer = document.createElement('div');
    setsContainer.className = 'sets-container';
    
    for (let setNum = 1; setNum <= exercise.sets; setNum++) {
        const setElement = createSetElement(exerciseIndex, setNum);
        setsContainer.appendChild(setElement);
    }
    
    exerciseDiv.appendChild(setsContainer);
    return exerciseDiv;
}

/**
 * Crear elemento DOM para una serie individual
 */
function createSetElement(exerciseIndex, setNum) {
    const setDiv = document.createElement('div');
    setDiv.className = 'set';
    setDiv.id = `set-${exerciseIndex}-${setNum}`;
    
    const setNumber = document.createElement('div');
    setNumber.className = 'set-number';
    setNumber.textContent = `S${setNum}`;
    setDiv.appendChild(setNumber);
    
    const inputsDiv = document.createElement('div');
    inputsDiv.className = 'set-inputs';
    
    // Input de peso
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.step = '0.5';
    weightInput.placeholder = 'Peso';
    weightInput.className = 'weight-input';
    weightInput.addEventListener('change', (e) => {
        updateSetWeight(exerciseIndex, setNum, e.target.value);
    });
    inputsDiv.appendChild(weightInput);
    
    // Selector de unidad
    const unitSelect = document.createElement('select');
    unitSelect.className = 'unit-select';
    unitSelect.innerHTML = '<option value="kg">kg</option><option value="lbs">lbs</option>';
    unitSelect.addEventListener('change', (e) => {
        updateSetUnit(exerciseIndex, setNum, e.target.value);
    });
    inputsDiv.appendChild(unitSelect);
    
    // Checkbox de completado
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'set-checkbox';
    checkbox.addEventListener('change', (e) => {
        const isCompleted = toggleSetCompleted(exerciseIndex, setNum);
        
        if (isCompleted) {
            setDiv.classList.add('completed');
        } else {
            setDiv.classList.remove('completed');
        }
        
        updateProgressBar();
    });
    inputsDiv.appendChild(checkbox);
    
    setDiv.appendChild(inputsDiv);
    return setDiv;
}

/**
 * Actualizar barra de progreso
 */
export function updateProgressBar() {
    const completed = getCompletedSets();
    const total = getTotalSets();
    const percentage = getProgressPercentage();
    
    if (DOM.completedSets) DOM.completedSets.textContent = completed;
    if (DOM.totalSets) DOM.totalSets.textContent = total;
    if (DOM.progressFill) DOM.progressFill.style.width = percentage + '%';
}

/**
 * Mostrar mensaje de estado
 */
export function showStatusMessage(message, type = 'info') {
    if (!DOM.statusMessage) return;
    
    DOM.statusMessage.className = `status-message ${type}`;
    
    if (type === 'loading') {
        DOM.statusMessage.innerHTML = '<span class="spinner"></span>' + message;
    } else {
        DOM.statusMessage.textContent = message;
    }
}

/**
 * Limpiar mensaje de estado
 */
export function clearStatusMessage() {
    if (DOM.statusMessage) {
        DOM.statusMessage.textContent = '';
        DOM.statusMessage.className = 'status-message';
    }
}

/**
 * Habilitar/deshabilitar botón de terminar
 */
export function setFinishButtonEnabled(enabled) {
    if (DOM.finishBtn) {
        DOM.finishBtn.disabled = !enabled;
    }
}

/**
 * Obtener referencia al botón de terminar entrenamiento
 */
export function getFinishButton() {
    return DOM.finishBtn;
}

/**
 * Registrar event listeners para botones de día
 */
export function setupDayButtons(callback) {
    DOM.dayButtons.forEach((btn) => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                const day = parseInt(e.target.getAttribute('data-day'));
                callback(day);
            });
        }
    });
}
