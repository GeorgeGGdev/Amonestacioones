// Importar funciones de Firebase
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Variables globales
let db;
let amonestaciones = [];
let amonestacionesFiltradas = [];

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
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Remover automáticamente después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
}

// Función para formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return 'Fecha no disponible';
    
    const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para cargar amonestaciones desde Firebase
async function cargarAmonestaciones() {
    try {
        const amonestacionesRef = collection(db, 'amonestaciones');
        const q = query(amonestacionesRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        amonestaciones = [];
        querySnapshot.forEach((doc) => {
            amonestaciones.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('Amonestaciones cargadas:', amonestaciones.length);
        return amonestaciones;
    } catch (error) {
        console.error('Error al cargar amonestaciones:', error);
        throw new Error('Error al cargar las amonestaciones');
    }
}

// Función para renderizar amonestaciones
function renderizarAmonestaciones(amonestacionesParaRenderizar) {
    const listaContainer = document.getElementById('amonestacionesList');
    const noAmonestaciones = document.getElementById('noAmonestaciones');
    
    if (amonestacionesParaRenderizar.length === 0) {
        listaContainer.style.display = 'none';
        noAmonestaciones.style.display = 'block';
        return;
    }
    
    listaContainer.style.display = 'block';
    noAmonestaciones.style.display = 'none';
    
    listaContainer.innerHTML = amonestacionesParaRenderizar.map((amonestacion, index) => `
        <div class="amonestacion-card" style="animation-delay: ${index * 0.1}s">
            <div class="amonestacion-header">
                <div class="amonestacion-info">
                    <div class="amonestacion-estudiante">${amonestacion.estudianteNombre}</div>
                    <div class="amonestacion-details">
                        <div class="amonestacion-detail">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span>${amonestacion.profesorNombre}</span>
                        </div>
                        <div class="amonestacion-detail">
                            <i class="fas fa-graduation-cap"></i>
                            <span>${amonestacion.estudianteGrado}</span>
                        </div>
                        <div class="amonestacion-detail">
                            <i class="fas fa-id-card"></i>
                            <span>${amonestacion.estudianteCedula}</span>
                        </div>
                    </div>
                </div>
                <div class="amonestacion-status ${amonestacion.estado || 'activa'}">
                    ${amonestacion.estado || 'activa'}
                </div>
            </div>
            
            <div class="amonestacion-content">
                <div class="amonestacion-infraccion">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${amonestacion.infraccion}
                </div>
                ${amonestacion.comentarios ? `
                    <div class="amonestacion-comentarios">
                        <i class="fas fa-comment"></i>
                        ${amonestacion.comentarios}
                    </div>
                ` : ''}
            </div>
            
            <div class="amonestacion-footer">
                <div class="amonestacion-fecha">
                    <i class="fas fa-calendar"></i>
                    ${formatearFecha(amonestacion.fechaCreacion)}
                </div>
                <div class="amonestacion-fecha">
                    <i class="fas fa-calendar"></i>
                    ${formatearFecha(amonestacion.fechaCreacion)}
                </div>
            </div>
        </div>
    `).join('');
}

// Función para buscar amonestaciones
function buscarAmonestaciones(termino) {
    if (!termino.trim()) {
        amonestacionesFiltradas = [...amonestaciones];
    } else {
        const terminoLower = termino.toLowerCase();
        amonestacionesFiltradas = amonestaciones.filter(amonestacion => 
            amonestacion.estudianteNombre.toLowerCase().includes(terminoLower) ||
            amonestacion.profesorNombre.toLowerCase().includes(terminoLower) ||
            amonestacion.estudianteCedula.includes(termino) ||
            amonestacion.infraccion.toLowerCase().includes(terminoLower)
        );
    }
    
    renderizarAmonestaciones(amonestacionesFiltradas);
    actualizarEstadisticas();
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    const totalElement = document.getElementById('totalAmonestaciones');
    const mostradasElement = document.getElementById('amonestacionesMostradas');
    
    totalElement.textContent = `Total: ${amonestaciones.length} amonestaciones`;
    mostradasElement.textContent = `Mostrando: ${amonestacionesFiltradas.length}`;
}

// Función para limpiar búsqueda
function limpiarBusqueda() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    buscarAmonestaciones('');
}



// Función para actualizar la última actualización
function actualizarUltimaActualizacion() {
    const ahora = new Date();
    const ultimaActualizacion = document.getElementById('ultimaActualizacion');
    ultimaActualizacion.textContent = ahora.toLocaleString('es-ES');
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Inicializar Firebase
        await inicializarFirebase();
        
        // Cargar amonestaciones
        await cargarAmonestaciones();
        amonestacionesFiltradas = [...amonestaciones];
        
        // Renderizar amonestaciones
        renderizarAmonestaciones(amonestacionesFiltradas);
        actualizarEstadisticas();
        actualizarUltimaActualizacion();
        
        // Event listener para el buscador
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            buscarAmonestaciones(e.target.value);
        });
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            mostrarNotificacion(`Cargadas ${amonestaciones.length} amonestaciones`, 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Error al inicializar:', error);
        mostrarNotificacion('Error al cargar las amonestaciones', 'error');
        
        // Mostrar mensaje de error en la lista
        const listaContainer = document.getElementById('amonestacionesList');
        listaContainer.innerHTML = `
            <div class="no-amonestaciones">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar datos</h3>
                <p>No se pudieron cargar las amonestaciones. Verifica tu conexión a internet.</p>
                <button class="btn-primary" onclick="location.reload()">
                    <i class="fas fa-redo"></i>
                    Reintentar
                </button>
            </div>
        `;
    }
});

// Hacer funciones disponibles globalmente
window.limpiarBusqueda = limpiarBusqueda; 