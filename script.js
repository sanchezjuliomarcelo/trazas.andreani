// unified.js

// Obtiene las variables de entorno desde Vite
const API_USER = import.meta.env.VITE_API_USER;
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD;
const API_URL = import.meta.env.VITE_API_URL;

// Imprime las variables de entorno para verificar
console.log("API_USER:", API_USER);
console.log("API_PASSWORD:", API_PASSWORD);
console.log("API_URL:", API_URL);


// Función para generar el token
async function getToken() {
    if (!API_USER || !API_PASSWORD) {
        console.error("Las credenciales de acceso no están configuradas.");
        return;
    }

    // Codifica las credenciales en base64 para la autenticación básica
    const credentials = btoa(`${API_USER}:${API_PASSWORD}`);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${credentials}`);
    myHeaders.append("Cookie", "3c8ffdab67adef53a700e68f6019dc1d=46c0da942d265b8e7bb263570371139b");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const apiUrl = `${API_URL}/login`;

    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        console.log('Token generado:', result.token);
        // Guarda el token para usar en la siguiente solicitud
        localStorage.setItem('authToken', result.token);
    } catch (error) {
        console.error('Error al obtener el token:', error);
    }
}

// Función para buscar los datos de traza
async function fetchTrackingData(trackingNumber) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("No se ha obtenido el token. Inicie sesión primero.");
        return;
    }

    // Usa el endpoint correcto (con proxy si está configurado)
    const apiUrl = `/api/v2/envios/${trackingNumber}/trazas`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const result = await response.json();
        displayTrackingData(result);
    } catch (error) {
        console.error('Error al obtener la traza:', error);
    }
}

// Función para mostrar los datos de traza
function displayTrackingData(data) {
    const infoContainer = document.getElementById("infonumeroAndreani");
    infoContainer.innerHTML = ""; // Limpia el contenedor

    if (data && data.eventos && data.eventos.length > 0) {
        data.eventos.forEach(evento => {
            const eventElement = document.createElement("div");
            eventElement.className = "alert alert-info";
            eventElement.innerHTML = `
                <h4 class="alert-heading">${evento.Fecha}</h4>
                <p><strong>Estado:</strong> ${evento.Estado || 'N/A'}</p>
                <p><strong>Traducción:</strong> ${evento.Traduccion || 'N/A'}</p>
                <p><strong>Sucursal:</strong> ${evento.Sucursal || 'N/A'}</p>
                <p><strong>Ciclo:</strong> ${evento.Ciclo || 'N/A'}</p>
                <p><strong>Comentario:</strong> ${evento.Comentario || 'N/A'}</p>
            `;
            infoContainer.appendChild(eventElement);
        });
    } else {
        infoContainer.innerHTML = "<p>No se encontraron eventos.</p>";
    }
}

// Función para manejar el formulario de búsqueda
document.getElementById("numeroAndreaniForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const trackingNumber = document.getElementById("numeroAndreani").value;
    if (trackingNumber) {
        await fetchTrackingData(trackingNumber);
    } else {
        alert("Por favor, ingrese un número de seguimiento.");
    }
});

// Ejecuta la función para obtener el token cuando se cargue la página
window.addEventListener('load', getToken);
