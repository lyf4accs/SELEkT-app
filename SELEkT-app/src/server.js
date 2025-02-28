// Importamos las bibliotecas necesarias
const express = require("express"); // Framework web para Node.js
const http = require("http"); // Módulo nativo de Node.js para crear servidores HTTP
const socketIo = require("socket.io"); // Biblioteca para habilitar la comunicación en tiempo real

// Inicializamos la aplicación Express, ayuda a crear aplicaciones web y gestionar rutas
const app = express();
// Creamos un servidor HTTP utilizando la aplicación Express
const server = http.createServer(app);
// Inicializamos Socket.IO con el servidor HTTP para manejar la comunicación en tiempo real
const io = socketIo(server);

// Definimos el puerto en el que el servidor escuchará las solicitudes
const port = 3000;

// Inicializamos un array para almacenar la lista de dispositivos conectados
let devices = []; // Este array contendrá los IDs de los sockets de los dispositivos conectados

// Middleware para servir archivos estáticos (ej. HTML, CSS, JS) desde la carpeta "public"
app.use(express.static("public"));

// Configuración de la conexión WebSocket
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado"); // Mensaje en la consola al establecer una conexión

  // Añadimos el ID del nuevo dispositivo a la lista de dispositivos conectados
  devices.push(socket.id);
  console.log("Dispositivos conectados:", devices); // Imprimimos la lista actualizada de dispositivos conectados

  // Emitimos la lista de dispositivos disponibles a todos los clientes conectados
  io.emit("update-devices", devices);

  // Configuramos un listener para recibir archivos de un dispositivo
  socket.on("send-file", (fileData) => {
    console.log("Recibiendo archivo..."); // Mensaje en consola indicando que se está recibiendo un archivo
    // Emitimos el archivo recibido a todos los demás clientes conectados
    io.emit("receive-file", fileData);
  });

  // Configuramos un listener para detectar cuando un dispositivo se desconecta
  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado"); // Mensaje en consola al desconectar un cliente
    // Filtramos la lista de dispositivos para eliminar el que se ha desconectado
    devices = devices.filter((id) => id !== socket.id);
    // Emitimos la lista de dispositivos actualizada a todos los clientes
    io.emit("update-devices", devices);
  });
});

// Iniciamos el servidor en el puerto especificado y en todas las interfaces de red
server.listen(port, "0.0.0.0", () => {
  console.log(`Servidor escuchando en el puerto ${port}`); // Mensaje en consola indicando que el servidor está funcionando
});
