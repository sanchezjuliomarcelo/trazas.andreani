// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#numeroAndreaniForm').addEventListener('submit', async (event) => {
      event.preventDefault();
  
      // Asegúrate de que import.meta.env esté disponible
      if (!import.meta.env || !import.meta.env.VITE_API_USER) {
        console.error('Las variables de entorno no están disponibles.');
        alert('Error de configuración. Las variables de entorno no están disponibles.');
        return;
      }
  
      const user = import.meta.env.VITE_API_USER;
      const password = import.meta.env.VITE_API_PASSWORD;
      const credentials = btoa(`${user}:${password}`);

        console.log('VITE_API_USER:', import.meta.env.VITE_API_USER);
        console.log('VITE_API_PASSWORD:', import.meta.env.VITE_API_PASSWORD);
        console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

  
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error al solicitar el token: ${response.statusText}`);
        }
  
        const data = await response.json();
        sessionStorage.setItem("x-authorization-token", data.token);
  
        const numeroAndreani = document.querySelector('.numeroAndreani').value;
  
        document.getElementById("loader").style.display = 'block';
        document.getElementById("cargando").style.display = 'block';
        document.getElementById("infonumeroAndreani").style.display = 'none';
  
        const enviosResponse = await fetch(`${import.meta.env.VITE_API_URL}/v2/envios/${numeroAndreani}/trazas`, {
          method: 'GET',
          headers: {
            'x-authorization-token': sessionStorage.getItem('x-authorization-token'),
          },
        });
  
        if (!enviosResponse.ok) {
          throw new Error(`Error al obtener la traza: ${enviosResponse.statusText}`);
        }
  
        const enviosData = await enviosResponse.json();
        let infonumeroAndreani = "";
  
        if (!enviosData.Estado) {
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
        document.getElementById("loader").style.display = 'none';
        document.getElementById("cargando").style.display = 'none';
      }
    });
  });
  