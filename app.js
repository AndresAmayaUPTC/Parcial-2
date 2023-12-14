const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas

app.get('/platos', async (req, res) => {
  try {
    const response = await axios.get('https://api-dishes.vercel.app/');
    const dishes = response.data.state ? response.data.data : [];
    res.json({ state: true, data: dishes });
  } catch (error) {
    console.error('Error al obtener los platos de la API:', error);
    res.status(500).json({ state: false, error: 'Error al obtener los platos de la API' });
  }
});


app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api-dishes.vercel.app/');
    const dishes = response.data.state ? response.data.data : [];
    res.sendFile(__dirname + '/views/index.html', { dishes });
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
    res.status(500).send('Error al obtener los datos de la API');
  }
});

// Endpoint para recuperar un plato por ObjectId
app.get('/platos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api-dishes.vercel.app/${id}`);
    const plato = response.data.state ? response.data.data : null;
    if (plato) {
      res.json({ state: true, data: plato });
    } else {
      res.status(404).json({ state: false, error: 'Plato no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el plato:', error);
    res.status(500).json({ state: false, error: 'Error al obtener el plato' });
  }
});

// Endpoint para crear un nuevo plato
app.post('/platos', async (req, res) => {
  const nuevoPlato = req.body;
  try {
    // Lógica para agregar el nuevo plato a la API
    // ...

    res.status(201).json({ state: true, data: nuevoPlato });
  } catch (error) {
    console.error('Error al crear el plato:', error);
    res.status(500).json({ state: false, error: 'Error al crear el plato' });
  }
});

// Endpoint para eliminar un plato por ObjectId
app.delete('/platos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Lógica para eliminar el plato de la API
    // ...

    res.json({ state: true, data: 'Plato eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el plato:', error);
    res.status(500).json({ state: false, error: 'Error al eliminar el plato' });
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  // Puedes agregar eventos de socket según tus necesidades
});

// Puerto
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
