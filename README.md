# Sistema de Amonestaciones Escolares

Un sistema moderno y completo para la gestión de amonestaciones escolares, desarrollado con HTML, CSS, JavaScript y Firebase.

## 🚀 Características

- **Página de bienvenida** con diseño moderno y animaciones
- **Dashboard principal** con botones de crear y ver amonestaciones
- **Formulario simplificado** con campos de texto libre
- **Lista de amonestaciones** con buscador (solo lectura)
- **Integración con Firebase** para almacenamiento de datos
- **Validación en tiempo real** de formularios
- **Diseño responsive** para todos los dispositivos
- **Animaciones suaves** y efectos visuales atractivos
- **Sistema de notificaciones** para feedback del usuario
- **Proyecto optimizado** con un solo archivo CSS

## 📋 Campos del Formulario

- **Nombre del Profesor** (requerido) - Campo de texto libre
- **Nombre del Estudiante** (requerido) - Campo de texto libre
- **Grado** (requerido) - Campo de texto libre (ej: "10mo grado")
- **Cédula del Estudiante** (requerido) - Solo números
- **Tipo de Infracción** (requerido) - Campo de texto libre
- **Comentarios Adicionales** (opcional) - Área de texto

## 🛠️ Configuración

### 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Firestore Database
4. Ve a Configuración del proyecto > General
5. Copia la configuración de tu proyecto

### 2. Verificar Configuración

El archivo `firebase-config.js` ya está configurado con tu proyecto Firebase. Si necesitas cambiar la configuración, edita los valores:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyCVO_Aixzb0R-mdhBBQ3m0WZimH4dCP5Bc",
    authDomain: "amonestaciones-5c481.firebaseapp.com",
    projectId: "amonestaciones-5c481",
    storageBucket: "amonestaciones-5c481.firebasestorage.app",
    messagingSenderId: "747399562651",
    appId: "1:747399562651:web:a2ef0c850fd39e52dacd3e",
    measurementId: "G-268ZC3LC3T"
};
```

### 3. Configurar Reglas de Firestore

1. Ve a Firestore Database > Reglas
2. Reemplaza las reglas existentes con el contenido del archivo `firestore.rules`
3. Publica las reglas

### 4. Configurar Autenticación (Opcional)

Si quieres usar autenticación:

1. Ve a Authentication > Sign-in method
2. Habilita los métodos de autenticación que desees
3. Actualiza las reglas de Firestore según tus necesidades

## 📁 Estructura de Archivos

```
Amonestacioones/
├── index.html              # Página de bienvenida
├── main.html               # Dashboard principal
├── crear-amonestacion.html # Formulario de amonestación
├── ver-amonestaciones.html # Lista de amonestaciones
├── styles.css              # Estilos unificados (todas las páginas)
├── form-script.js          # Lógica del formulario
├── amonestaciones-script.js # Lógica de la lista de amonestaciones
├── firebase-config.js      # Configuración de Firebase
├── firestore.rules         # Reglas de seguridad
└── README.md              # Este archivo
```

## 🎨 Diseño

- **Colores principales**: Morado (#667eea, #764ba2) y Verde (#4ade80, #22c55e)
- **Tipografía**: Poppins (Google Fonts)
- **Iconos**: Font Awesome 6.0
- **Animaciones**: CSS3 con keyframes personalizados
- **Efectos**: Glassmorphism, sombras y gradientes

## 🔧 Funcionalidades

### Página de Bienvenida (`index.html`)
- Diseño atractivo con gradientes
- Animaciones de entrada
- Botón "Empezar" que redirige al dashboard

### Dashboard Principal (`main.html`)
- Botón prominente para crear amonestación
- Diseño limpio y enfocado
- Navegación simple

### Formulario de Amonestación (`crear-amonestacion.html`)
- Validación en tiempo real
- Campos organizados por secciones
- Botones de acción (Guardar y Limpiar)
- Notificaciones de estado
- Integración completa con Firebase

## 📊 Estructura de Datos en Firebase

### Colección: `amonestaciones`

```javascript
{
  profesorNombre: "string",
  estudianteNombre: "string",
  estudianteGrado: "string",
  estudianteCedula: "string",
  infraccion: "string",
  comentarios: "string",
  fechaCreacion: "timestamp",
  estado: "string", // 'activa', 'inactiva', 'resuelta'
  timestamp: "serverTimestamp"
}
```

## 🔒 Seguridad

Las reglas de Firestore incluyen:

- **Lectura**: Solo usuarios autenticados
- **Escritura**: Solo usuarios autenticados con validación de datos
- **Eliminación**: Solo administradores
- **Validación**: Verificación de tipos y campos requeridos

## 🚀 Uso

1. Abre `index.html` en tu navegador
2. Haz clic en "Empezar"
3. En el dashboard, tienes dos opciones:
   - **Crear Amonestación**: Para registrar una nueva amonestación
   - **Ver Amonestaciones**: Para consultar y gestionar las existentes
4. En el formulario, completa todos los campos requeridos
5. Haz clic en "Guardar Amonestación"
6. En la lista de amonestaciones, puedes:
   - Buscar por nombre de estudiante, profesor, cédula o infracción
   - Ver todos los detalles de cada amonestación
   - Ver estadísticas en tiempo real

## 📱 Responsive

El sistema es completamente responsive y funciona en:
- 📱 Móviles
- 📱 Tablets
- 💻 Computadoras de escritorio

## 🎯 Validaciones

- Campos requeridos
- Formato de cédula (solo números)
- Validación en tiempo real
- Feedback visual inmediato

## 🔧 Personalización

### Cambiar Colores
Edita las variables CSS en los archivos de estilos:

```css
/* Colores principales */
--primary-purple: #667eea;
--secondary-purple: #764ba2;
--primary-green: #4ade80;
--secondary-green: #22c55e;
```

### Agregar Nuevos Tipos de Infracción
Edita el select en `crear-amonestacion.html`:

```html
<option value="Nueva Infracción">Descripción de la nueva infracción</option>
```

### Modificar Validaciones
Edita la función `validarFormulario()` en `form-script.js`

## 🐛 Solución de Problemas

### Error de Conexión con Firebase
1. Verifica que la configuración en `firebase-config.js` sea correcta
2. Asegúrate de que Firestore esté habilitado
3. Verifica las reglas de seguridad

### Formulario No Se Envía
1. Abre la consola del navegador (F12)
2. Verifica si hay errores de JavaScript
3. Asegúrate de que todos los campos requeridos estén completos

### Problemas de Estilo
1. Verifica que todos los archivos CSS estén cargados
2. Limpia la caché del navegador
3. Verifica que las fuentes de Google Fonts estén disponibles

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la consola del navegador para errores
2. Verifica la configuración de Firebase
3. Asegúrate de que todos los archivos estén en la misma carpeta

## 🔄 Actualizaciones Futuras

- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración
- [ ] Reportes y estadísticas
- [ ] Exportación de datos
- [ ] Notificaciones por email
- [ ] Historial de amonestaciones por estudiante

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ para la gestión escolar eficiente**