document.querySelector('#numeroAndreaniForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const user = 'tiendasdigitalessrl_gla';  // Reemplaza con tu usuario real
    const password = '[e]Xn1Y80iq9';  // Reemplaza con tu contraseña real
    const credentials = btoa(`${user}:${password}`);
  
    const numeroAndreani = document.querySelector('.numeroAndreani').value;
    const tokenUrl = "https://apis.andreani.com/login";
    const tracingsUrl = `https://apis.andreani.com/v2/envios/${numeroAndreani}/trazas`;
  
    try {
      // Obtener el token
      const tokenResponse = await fetch(tokenUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });
      if (!tokenResponse.ok) throw new Error('Error al obtener el token');
      const tokenData = await tokenResponse.json();
      const token = tokenData.token;
  
      // Mostrar el loader
      document.getElementById("loader").style.display = 'none';
      document.getElementById("cargando").style.display = 'block';
  
      // Obtener los datos del envío
      const tracingResponse = await fetch(tracingsUrl, {
        method: 'GET',
        headers: {
          'x-authorization-token': token,
        },
      });
      if (!tracingResponse.ok) throw new Error('Error al obtener los datos del envío');
      const tracingData = await tracingResponse.json();
  
      // Procesar la respuesta
      let infonumeroAndreani = "";
      if (tracingData.eventos.length === 0) {
        infonumeroAndreani = `
        <div class="alert alert-info alert-dismissible fade show" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          Número de envío inexistente.
        </div>`;
      } else {
        infonumeroAndreani = tracingData.eventos.map(evento => `
        <div class="alert alert-secondary alert-dismissible fade show" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="alert-heading">${evento.Estado}</h4>
          <hr>
          <p class="m-0"><strong>Fecha: </strong>${evento.Fecha}</p>
          <p class="m-0"><strong>Estado: </strong>${evento.Estado}</p>
          <p class="m-0"><strong>Traducción: </strong>${evento.Traduccion}</p>
          <p class="m-0"><strong>Sucursal: </strong>${evento.Sucursal}</p>
          <p class="m-0"><strong>Ciclo: </strong>${evento.Ciclo}</p>
          ${evento.Motivo ? `<p class="m-0"><strong>Motivo: </strong>${evento.Motivo}</p>` : ''}
        </div>
        `).join('');
      }
  
      document.querySelector("#infonumeroAndreani").innerHTML = infonumeroAndreani;
  
    } catch (error) {
      console.error(error);
      alert('Error al realizar la consulta. Por favor, intente de nuevo más tarde.');
    } finally {
      document.getElementById("loader").style.display = 'none';
      document.getElementById("cargando").style.display = 'none';
    }
  });
  