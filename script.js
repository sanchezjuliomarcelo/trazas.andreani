document.querySelector('#numeroAndreaniForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const user = import.meta.env.VITE_API_USER;
    const password = import.meta.env.VITE_API_PASSWORD;
    const credentials = btoa(`${user}:${password}`);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });
      const data = await response.json();
      sessionStorage.setItem("x-authorization-token", data.token);
  
      const numeroAndreani = document.querySelector('.numeroAndreani').value;
  
      const $loader = document.getElementById("loader");
      $loader.style.display = 'block';
      const $cargando = document.getElementById("cargando");
      $cargando.style.display = 'block';
      const $infonumeroAndreani = document.getElementById("infonumeroAndreani");
      $infonumeroAndreani.style.display = 'none';
  
      const enviosResponse = await fetch(`${import.meta.env.VITE_API_URL}/v2/envios/${numeroAndreani}/trazas`, {
        method: 'GET',
        headers: {
          'x-authorization-token': sessionStorage.getItem('x-authorization-token'),
        },
      });
      const enviosData = await enviosResponse.json();
      let infonumeroAndreani = "";
  
      if (typeof enviosData.Estado === 'undefined') {
        exibeIcone("remove");
        infonumeroAndreani += `
        <div class="alert alert-info alert-dismissible fade show" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          Número de envío inexistente.
        </div>`;
      } else {
        exibeIcone("check");
        infonumeroAndreani += `
        <div class="alert alert-secondary alert-dismissible fade show" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="alert-heading">${enviosData.Estado}</h4>
          <hr>
          <p class="m-0"><strong>Fecha: </strong>${enviosData.Fecha}</p>
          <p class="m-0"><strong>Código de estado: </strong>${enviosData.EstadoId}</p>
          <p class="m-0"><strong>Traducción: </strong>${enviosData.Traduccion}</p>
          <p class="m-0"><strong>Sucursal: </strong>${enviosData.Sucursal}</p>
          <p class="m-0"><strong>Ciclo: </strong>${enviosData.Ciclo}</p>
        </div>`;
      }
  
      document.querySelector("#infonumeroAndreani").innerHTML = infonumeroAndreani;
    } catch (error) {
      console.error(error);
      alert('Error al realizar la consulta. Por favor, intente de nuevo más tarde.');
    } finally {
      const $loader = document.getElementById("loader");
      $loader.style.display = 'none';
      const $cargando = document.getElementById("cargando");
      $cargando.style.display = 'none';
    }
  });
  