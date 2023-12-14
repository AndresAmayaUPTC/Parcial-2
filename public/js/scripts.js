document.addEventListener('DOMContentLoaded', async function () {
  // Cargar la lista de platos al cargar la página
  await cargarPlatos();

  // Manejar el formulario para agregar un nuevo plato
  const addPlatoForm = document.getElementById('addPlatoForm');
  addPlatoForm.addEventListener('submit', agregarPlato);

  // Manejar el formulario para consultar o eliminar un plato por ID
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

    // Limpiar la lista existente
    platoList.innerHTML = '';

    // Mostrar cada plato en la lista
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
  event.preventDefault(); // Evitar que el formulario se envíe normalmente

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
      await cargarPlatos(); // Recargar la lista de platos después de agregar uno nuevo
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
      await cargarPlatos(); // Recargar la lista de platos después de eliminar uno
    } else {
      alert(`Error al eliminar el plato: ${data.error}`);
    }
  } catch (error) {
    console.error('Error al eliminar el plato:', error);
  }
}
