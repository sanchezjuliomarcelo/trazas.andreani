// URL de la API fija
const API_URL = "https://apis.andreani.com";

// Función para obtener el valor de los campos de usuario y contraseña
function getCredentials() {
    const user = document.getElementById('apiUser').value;
    const password = document.getElementById('apiPassword').value;
    return { user, password };
}

// Función para generar el token
async function getToken() {
    const { user, password } = getCredentials();

    // Verifica si las credenciales existen
    if (!user || !password) {
        console.error("Las credenciales de acceso no están configuradas.");
        return;
    }

    const credentials = btoa(`${user}:${password}`);
    const apiUrl = `${API_URL}/login`;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${credentials}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error(`Error al obtener el token: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        localStorage.setItem('authToken', result.token); // Almacena el token
        console.log('Token generado:', result.token); // Imprime el token
    } catch (error) {
        console.error('Error al obtener el token:', error);
        // Puedes mostrar un mensaje de error al usuario
        alert("Error al autenticarse con la API de Andreani. Verifica tus credenciales.");
    }
}

// Función para buscar los datos de traza
async function fetchTrackingData(trackingNumber) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("No se ha obtenido el token. Inicie sesión primero.");
        return;
    }

    const apiUrl = `${API_URL}/envios/${trackingNumber}/trazas`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        const contentType = response.headers.get("content-type");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            displayTrackingData(result);
        } else {
            const text = await response.text();
            throw new Error(`Respuesta inesperada: ${text}`);
        }
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

// Función para validar los campos de usuario y contraseña
function validateFields() {
    const user = document.getElementById('apiUser').value;
    const password = document.getElementById('apiPassword').value;
    const searchButton = document.getElementById('searchButton');
    
    // Habilita o deshabilita el botón de búsqueda
    searchButton.disabled = !user || !password;
}

// Event listeners para validar campos
document.getElementById('apiUser').addEventListener('input', validateFields);
document.getElementById('apiPassword').addEventListener('input', validateFields);

// Función para manejar el formulario de búsqueda
document.getElementById("numeroAndreaniForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const trackingNumber = document.getElementById("numeroAndreani").value;
    if (trackingNumber) {
        await getToken(); // Asegúrate de obtener el token antes de buscar la traza
        await fetchTrackingData(trackingNumber);
    } else {
        alert("Por favor, ingrese un número de seguimiento.");
    }
});

// Ejecuta la función para obtener el token cuando se cargue la página
window.addEventListener('load', getToken);

