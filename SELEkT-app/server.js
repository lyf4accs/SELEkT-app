// Importamos las bibliotecas necesarias
const express = require("express"); // Framework web para Node.js
const http = require("http"); // Módulo nativo para crear servidores HTTP
const socketIo = require("socket.io"); // Biblioteca para habilitar la comunicación en tiempo real

// Inicializamos la aplicación Express
const app = express();
// Creamos un servidor HTTP utilizando la aplicación Express
const server = http.createServer(app);
// Inicializamos Socket.IO con el servidor HTTP
const io = socketIo(server, {
  cors: {
    origin: "*", // Permitir acceso desde cualquier origen (ajustar según necesidad)
    methods: ["GET", "POST"],
  },
});

// Definimos el puerto dinámico asignado por Render
const PORT = process.env.PORT || 3000;

// Inicializamos un array para almacenar la lista de dispositivos conectados
let devices = [];

// Middleware para servir archivos estáticos (cambiar la ruta si es necesario)
app.use(express.static("dist/selek-t-app"));

// Configuración de WebSocket con Socket.IO
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  // Añadimos el ID del dispositivo a la lista
  devices.push(socket.id);
  console.log("Dispositivos conectados:", devices);

  // Emitimos la lista actualizada
  io.emit("update-devices", devices);

  // Recibir archivos
  socket.on("send-file", (fileData) => {
    console.log("Recibiendo archivo...");
    io.emit("receive-file", fileData);
  });

  // Manejo de desconexión
  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado");
    devices = devices.filter((id) => id !== socket.id);
    io.emit("update-devices", devices);
  });
});

// Iniciamos el servidor en el puerto asignado
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
