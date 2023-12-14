document.addEventListener('DOMContentLoaded', async function () {
 
  await cargarPlatos();

 
  const addPlatoForm = document.getElementById('addPlatoForm');
  addPlatoForm.addEventListener('submit', agregarPlato);

 
  const consultPlatoForm = document.getElementById('consultPlatoForm');
  consultPlatoForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe
    consultarPlato();
  });
});




async function cargarPlatos() {
  try {
    const response = await fetch('/platos');
    const data = await response.json();
    const platoList = document.getElementById('plato-list');

  
    platoList.innerHTML = '';

    data.data.forEach(plato => {
      const listItem = document.createElement('li');
      listItem.textContent = `ID: ${plato._id}, Nombre: ${plato.nombre}, Calorías: ${plato.calorias}`;
      platoList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error al cargar los platos:', error);
  }
}

async function agregarPlato(event) {
  event.preventDefault(); 

  const nombre = document.getElementById('nombre').value;
  const calorias = document.getElementById('calorias').value;

  try {
    const response = await fetch('/platos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, calorias }),
    });

    const data = await response.json();
    if (data.state) {
      alert('Plato agregado exitosamente.');
      await cargarPlatos();
    } else {
      alert(`Error al agregar el plato: ${data.error}`);
    }
  } catch (error) {
    console.error('Error al agregar el plato:', error);
  }
}

async function consultarPlato() {
  const consultId = document.getElementById('consultId').value;

  try {
    const response = await fetch(`/platos/${consultId}`);
    const data = await response.json();

    if (data.state) {
      alert(`ID: ${data.data._id}, Nombre: ${data.data.nombre}, Calorías: ${data.data.calorias}`);
    } else {
      alert(`Error al consultar el plato: ${data.error}`);
    }
  } catch (error) {
    console.error('Error al consultar el plato:', error);
  }
}

async function eliminarPlato() {
  const consultId = document.getElementById('consultId').value;

  try {
    const response = await fetch(`/platos/${consultId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    if (data.state) {
      alert('Plato eliminado exitosamente.');
      await cargarPlatos(); 
    } else {
      alert(`Error al eliminar el plato: ${data.error}`);
    }
  } catch (error) {
    console.error('Error al eliminar el plato:', error);
  }
}
