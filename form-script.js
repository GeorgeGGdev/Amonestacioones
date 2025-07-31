// Importar funciones de Firebase
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Variables globales
let isSubmitting = false;
let db;

// Función para inicializar Firebase
async function inicializarFirebase() {
    try {
        // Esperar a que Firebase se cargue
        await new Promise(resolve => {
            const checkFirebase = () => {
                if (window.db) {
                    db = window.db;
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
        console.log('Firebase inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar Firebase:', error);
        throw error;
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    const form = document.getElementById('amonestacionForm');
    form.reset();
    
    // Limpiar clases de validación
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    
    // Mostrar mensaje de confirmación
    mostrarNotificacion('Formulario limpiado correctamente', 'success');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${mensaje}</span>
        </div>
        <button class="notificacion-cerrar" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Agregar estilos CSS dinámicamente si no existen
    if (!document.getElementById('notificacion-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notificacion-styles';
        styles.textContent = `
            .notificacion {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                padding: 1rem 1.5rem;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 1rem;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
            }
            
            .notificacion-success {
                border-left: 4px solid #4ade80;
            }
            
            .notificacion-error {
                border-left: 4px solid #ef4444;
            }
            
            .notificacion-info {
                border-left: 4px solid #3b82f6;
            }
            
            .notificacion-contenido {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                flex: 1;
            }
            
            .notificacion-contenido i {
                font-size: 1.2rem;
            }
            
            .notificacion-success .notificacion-contenido i {
                color: #4ade80;
            }
            
            .notificacion-error .notificacion-contenido i {
                color: #ef4444;
            }
            
            .notificacion-info .notificacion-contenido i {
                color: #3b82f6;
            }
            
            .notificacion-cerrar {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 0.2rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .notificacion-cerrar:hover {
                background: rgba(0,0,0,0.1);
                color: #333;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Remover automáticamente después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
}

// Función para validar el formulario
function validarFormulario(formData) {
    const errores = [];
    
    // Validar campos requeridos
    if (!formData.profesorNombre.trim()) {
        errores.push('El nombre del profesor es requerido');
    }
    
    if (!formData.estudianteNombre.trim()) {
        errores.push('El nombre del estudiante es requerido');
    }
    
    if (!formData.estudianteGrado) {
        errores.push('El grado del estudiante es requerido');
    }
    
    if (!formData.estudianteCedula.trim()) {
        errores.push('La cédula del estudiante es requerida');
    }
    
    if (!formData.infraccion) {
        errores.push('El tipo de infracción es requerido');
    }
    
    // Validar formato de cédula (permite números, guiones y slashes)
    if (formData.estudianteCedula.trim() && !/^[0-9\-/]+$/.test(formData.estudianteCedula.trim())) {
        errores.push('La cédula debe contener solo números, guiones (-) y barras (/)');
    }
    
    return errores;
}

// Función para obtener los datos del formulario
function obtenerDatosFormulario() {
    const form = document.getElementById('amonestacionForm');
    const formData = new FormData(form);
    
    return {
        profesorNombre: formData.get('profesorNombre'),
        estudianteNombre: formData.get('estudianteNombre'),
        estudianteGrado: formData.get('estudianteGrado'),
        estudianteCedula: formData.get('estudianteCedula'),
        infraccion: formData.get('infraccion'),
        comentarios: formData.get('comentarios') || '',
        fechaCreacion: new Date(),
        estado: 'activa'
    };
}

// Función para guardar amonestación en Firebase
async function guardarAmonestacion(datos) {
    try {
        console.log('Guardando amonestación:', datos);
        
        // Crear referencia a la colección amonestaciones
        const amonestacionesRef = collection(db, 'amonestaciones');
        
        // Agregar documento con timestamp del servidor
        const docRef = await addDoc(amonestacionesRef, {
            ...datos,
            timestamp: serverTimestamp()
        });
        
        console.log('Amonestación guardada con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error al guardar la amonestación:', error);
        throw new Error('Error al guardar la amonestación en la base de datos: ' + error.message);
    }
}

// Función para manejar el envío del formulario
async function manejarEnvioFormulario(event) {
    event.preventDefault();
    
    if (isSubmitting) {
        return; // Evitar envíos múltiples
    }
    
    isSubmitting = true;
    
    // Cambiar estado del botón
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    submitButton.disabled = true;
    
    try {
        // Obtener datos del formulario
        const datos = obtenerDatosFormulario();
        console.log('Datos del formulario:', datos);
        
        // Validar datos
        const errores = validarFormulario(datos);
        
        if (errores.length > 0) {
            throw new Error(errores.join('\n'));
        }
        
        // Guardar en Firebase
        const amonestacionId = await guardarAmonestacion(datos);
        
        // Mostrar mensaje de éxito
        mostrarNotificacion(`Amonestación guardada correctamente. ID: ${amonestacionId}`, 'success');
        
        // Limpiar formulario
        setTimeout(() => {
            limpiarFormulario();
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message, 'error');
    } finally {
        // Restaurar estado del botón
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        isSubmitting = false;
    }
}

// Función para validar campos en tiempo real
function validarCampo(campo) {
    const valor = campo.value.trim();
    const esRequerido = campo.hasAttribute('required');
    
    // Remover clases anteriores
    campo.classList.remove('valid', 'invalid');
    
    if (esRequerido && !valor) {
        campo.classList.add('invalid');
        return false;
    }
    
    // Validaciones específicas
    if (campo.name === 'estudianteCedula' && valor) {
        if (!/^[0-9\-/]+$/.test(valor)) {
            campo.classList.add('invalid');
            return false;
        }
    }
    
    if (valor) {
        campo.classList.add('valid');
    }
    
    return true;
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Inicializar Firebase
        await inicializarFirebase();
        
        const form = document.getElementById('amonestacionForm');
        
        // Event listener para el envío del formulario
        form.addEventListener('submit', manejarEnvioFormulario);
        
        // Event listeners para validación en tiempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validarCampo(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validarCampo(input);
                }
            });
        });
        
        // Configurar placeholder del textarea de comentarios
        const comentariosField = document.getElementById('comentarios');
        comentariosField.placeholder = 'Describa los detalles de la infracción...';
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            mostrarNotificacion('Formulario listo para crear amonestaciones', 'info');
        }, 1000);
        
    } catch (error) {
        console.error('Error al inicializar:', error);
        mostrarNotificacion('Error al inicializar el sistema', 'error');
    }
});

// Función para verificar conexión con Firebase
async function verificarConexionFirebase() {
    try {
        const testRef = collection(db, 'test');
        await addDoc(testRef, {
            test: true,
            timestamp: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error de conexión con Firebase:', error);
        throw error;
    }
}

// Verificar conexión al cargar la página
window.addEventListener('load', async function() {
    try {
        await verificarConexionFirebase();
        console.log('Conexión con Firebase establecida correctamente');
    } catch (error) {
        console.error('Error de conexión con Firebase:', error);
        mostrarNotificacion('Error de conexión con la base de datos', 'error');
    }
}); 