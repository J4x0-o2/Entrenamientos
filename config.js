/**
 * config.js
 * Configuración centralizada de la aplicación
 * - URLs de APIs
 * - Definición de rutinas
 * - Constantes globales
 */

export const CONFIG = {
    API_URL: 'PEGA_AQUI_TU_URL_DE_GOOGLE_APPS_SCRIPT',
    LOCAL_STORAGE_KEY_DAY: 'currentDay',
    TOTAL_DAYS: 4,
    DEFAULT_UNIT: 'kg',
    UNITS: ['kg', 'lbs']
};

/**
 * Definición completa de la rutina de 4 días
 * Cada día especifica los ejercicios con su cantidad de series
 */
export const ROUTINE = {
    day1: {
        dayNumber: 1,
        exercises: [
            { name: 'French Press', sets: 2 },
            { name: 'Incline Curl', sets: 2 },
            { name: 'Cuadri Extencion', sets: 2 },
            { name: 'Incline smith Press', sets: 2 },
            { name: 'Bulgara', sets: 2 },
            { name: 'Laterar Raises', sets: 3 },
            { name: 'Tricep Ext', sets: 2 },
            { name: 'Incline Curl', sets: 2 },
            { name: 'Pulldown', sets: 2 },
            { name: 'PullOver', sets: 2 },
            { name: 'Dear Delt', sets: 3 }
        ]
    },
    day2: {
        dayNumber: 2,
        exercises: [
            { name: 'Calves', sets: 3 },
            { name: 'Hammer Curl', sets: 2 },
            { name: 'Katana Press', sets: 2 },
            { name: 'Isquio Ext', sets: 3 },
            { name: 'Press Machine', sets: 2 },
            { name: 'Prensa', sets: 2 },
            { name: 'Lateral Raises', sets: 3 },
            { name: 'Abductores', sets: 2 },
            { name: 'Pec deck', sets: 1 },
            { name: 'Gironda Uni', sets: 2 },
            { name: 'Pullover', sets: 1 }
        ]
    },
    day3: {
        dayNumber: 3,
        exercises: [
            { name: 'Calves', sets: 3 },
            { name: 'French Press', sets: 2 },
            { name: 'Incline Curl', sets: 2 },
            { name: 'Prensa', sets: 2 },
            { name: 'Press machine', sets: 2 },
            { name: 'Pulldown', sets: 2 },
            { name: 'Cuadri Ext', sets: 2 },
            { name: 'Pec Deck', sets: 1 },
            { name: 'Abductores', sets: 2 },
            { name: 'Pullover', sets: 2 },
            { name: 'Military Press', sets: 2 }
        ]
    },
    day4: {
        dayNumber: 4,
        exercises: [
            { name: 'Calves', sets: 3 },
            { name: 'Incline Press', sets: 2 },
            { name: 'Predicador curl', sets: 2 },
            { name: 'Katana Press', sets: 2 },
            { name: 'Isquio Ext', sets: 2 },
            { name: 'Pec Deck', sets: 2 },
            { name: 'Hip Trust', sets: 3 },
            { name: 'Lateral Raises', sets: 3 },
            { name: 'Gironda Uni', sets: 2 },
            { name: 'Cuadri Ext', sets: 1 },
            { name: 'Pullover', sets: 2 },
            { name: 'Dear Delt', sets: 2 }
        ]
    }
};
