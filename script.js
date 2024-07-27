// script.js

document.getElementById('numeroAndreaniForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const trackingNumber = document.getElementById('numeroAndreani').value;
    const loader = document.getElementById('loader');
    const cargando = document.getElementById('cargando');
    const infonumeroAndreani = document.getElementById('infonumeroAndreani');

    // Mostrar loader y mensaje de búsqueda
    loader.style.display = 'block';
    cargando.style.display = 'block';

    try {
        const response = await fetch(`/api/v2/envios/${trackingNumber}/trazas`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${btoa(`${import.meta.env.VITE_API_USER}:${import.meta.env.VITE_API_PASSWORD}`)}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud de la API');
        }

        const data = await response.json();

        // Limpiar el contenido anterior
        infonumeroAndreani.innerHTML = '';

        // Ocultar loader y mensaje de búsqueda
        loader.style.display = 'none';
        cargando.style.display = 'none';

        if (data.eventos.length === 0) {
            infonumeroAndreani.innerHTML = '<div class="alert alert-warning" role="alert">No se encontraron eventos para el número de seguimiento proporcionado.</div>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-striped';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Traducción</th>
                <th>Sucursal</th>
                <th>Ciclo</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.eventos.forEach(evento => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(evento.Fecha).toLocaleString()}</td>
                <td>${evento.Estado}</td>
                <td>${evento.Traduccion || ''}</td>
                <td>${evento.Sucursal}</td>
                <td>${evento.Ciclo}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        infonumeroAndreani.appendChild(table);

    } catch (error) {
        console.error('Error al obtener la traza:', error);
        loader.style.display = 'none';
        cargando.style.display = 'none';
        infonumeroAndreani.innerHTML = '<div class="alert alert-danger" role="alert">Error al obtener la traza. Por favor, intenta nuevamente.</div>';
    }
});
