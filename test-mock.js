/**
 * TEST LOCAL - Prueba la app sin Google Sheets
 * 
 * Instrucciones:
 * 1. Descomentar la línea de abajo en app.js (antes de sendToGoogleSheet)
 * 2. O reemplazar temporalmente la URL de API_URL en app.js con:
 *    const API_URL = "./mock-api-response.json";
 * 3. Recarga la página
 * 4. Completa un entrenamiento y presiona "Terminar"
 * 5. Verifica DevTools → Network para ver la respuesta
 */

// Este archivo simula una respuesta exitosa del servidor
export const mockResponse = {
  result: "success",
  message: "Entrenamiento guardado correctamente (Mock)",
  rowsAdded: 11
};

// Para testing en consola:
(() => {
  window.testWorkoutApp = {
    /**
     * Simular envío sin Google Sheets
     */
    mockSend: function() {
      console.log("📋 Datos que se enviarían:");
      
      // Acceder a la función prepareDataForSheet si existe
      if (window.prepareDataForSheet === undefined) {
        console.error("❌ Abra la consola en la app correctamente");
        return;
      }
      
      const data = window.prepareDataForSheet?.();
      if (data) {
        console.table(data.ejercicios);
        console.log("JSON completo:", JSON.stringify(data, null, 2));
      }
    },
    
    /**
     * Limpiar localStorage
     */
    reset: function() {
      localStorage.clear();
      sessionStorage.clear();
      console.log("✅ LocalStorage limpiado");
      console.log("↻ Recarga la página...");
    },
    
    /**
     * Ver estado actual
     */
    status: function() {
      const day = localStorage.getItem('currentDay') || '1';
      console.log(`📅 Día actual: ${day}`);
      console.log(`💾 LocalStorage:`, JSON.parse(JSON.stringify(localStorage)));
    },
    
    /**
     * Cambiar día manualmente
     */
    setDay: function(dayNum) {
      if (dayNum < 1 || dayNum > 4) {
        console.error("❌ El día debe ser entre 1 y 4");
        return;
      }
      localStorage.setItem('currentDay', dayNum);
      console.log(`✅ Día cambiado a ${dayNum}`);
      console.log("↻ Recarga la página...");
    },
    
    /**
     * Llenar formulario automáticamente
     */
    autoFill: function() {
      const weights = [50, 55, 60, 65, 70, 75];
      let index = 0;
      
      document.querySelectorAll('.weight-input').forEach(input => {
        input.value = weights[index % weights.length];
        index++;
      });
      
      document.querySelectorAll('.set-checkbox').forEach((checkbox, i) => {
        if (i % 2 === 0) checkbox.checked = true;
      });
      
      console.log("✅ Formulario completado automáticamente");
    }
  };
  
  // Info en la primera carga
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           4x Full Body PWA - Testing Console               ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Comandos disponibles:                                     ║
║                                                            ║
║  testWorkoutApp.mockSend()    → Ver dato a enviar         ║
║  testWorkoutApp.autoFill()    → Llenar formulario         ║
║  testWorkoutApp.status()      → Ver estado               ║
║  testWorkoutApp.setDay(2)     → Cambiar día              ║
║  testWorkoutApp.reset()       → Limpiar localStorage     ║
║                                                            ║
║  Ejemplos:                                                 ║
║  > testWorkoutApp.autoFill()                              ║
║  > testWorkoutApp.mockSend()                              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
})();

// Para usar en app.js temporalmente:
// Reemplaza la función sendToGoogleSheet con esto para testear offline:
/*
async function sendToGoogleSheetMock(data) {
    const statusElement = document.getElementById('statusMessage');
    const finishBtn = document.getElementById('finishBtn');
    
    try {
        statusElement.textContent = '';
        statusElement.className = 'status-message loading';
        statusElement.innerHTML = '<span class="spinner"></span>Enviando (Mock)...';
        finishBtn.disabled = true;
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log("📊 Datos enviados (Mock):", data);
        
        statusElement.textContent = '✓ Entrenamiento guardado con éxito (Mock)';
        statusElement.className = 'status-message success';
        
        setTimeout(() => {
            advanceToNextDay();
        }, 1500);
        
    } catch (error) {
        console.error('Error Mock:', error);
        statusElement.textContent = `✗ Error: ${error.message}`;
        statusElement.className = 'status-message error';
        finishBtn.disabled = false;
    }
}
*/
