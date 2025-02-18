const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

let devices = []; // Lista de dispositivos conectados

// Sirve archivos estáticos (si los necesitas para front-end)
app.use(express.static("public"));

// Configuración del WebSocket
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  // Añadir dispositivo a la lista de dispositivos conectados
  devices.push(socket.id);

  // Enviar la lista de dispositivos disponibles a todos los clientes
  io.emit("update-devices", devices);

  // Recibir archivo de un dispositivo y enviarlo a los demás
  socket.on("send-file", (fileData) => {
    console.log("Recibiendo archivo...");
    io.emit("receive-file", fileData); // Reenviar el archivo a otros clientes
  });

  // Eliminar dispositivo de la lista cuando se desconecta
  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado");
    devices = devices.filter((id) => id !== socket.id); // Eliminar el dispositivo desconectado
    io.emit("update-devices", devices); // Actualizar la lista de dispositivos
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
