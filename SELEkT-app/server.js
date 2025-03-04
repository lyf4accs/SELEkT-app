// Importamos las bibliotecas necesarias
const express = require("express"); // Framework web para Node.js
const http = require("http"); // Módulo nativo para crear servidores HTTP
const path = require("path");
const socketIo = require("socket.io"); // Librería para WebSockets

// Inicializamos la aplicación Express
const app = express();

// Middleware para parsear JSON en el body
app.use(express.json());

// Creamos un servidor HTTP utilizando la aplicación Express
const server = http.createServer(app);

// Configuramos Socket.IO para habilitar WebSockets
const io = socketIo(server);

// Definimos el puerto dinámico asignado por Render
const PORT = process.env.PORT || 10000;

// Variable para simular la lista de dispositivos conectados
let devices = [];

// Middleware para servir archivos estáticos (archivos en "public")
app.use(express.static("public"));

// Servir los archivos estáticos generados por Angular desde la carpeta `dist`
app.use(express.static(path.join(__dirname, "dist/selek-t-app")));

// -----------------------------
// Endpoints HTTP para reemplazar la lógica de WebSocket
// -----------------------------

// Obtener la lista de dispositivos (simulación)
app.get("/devices", (req, res) => {
  res.json({ devices });
});

// Endpoint para "conectar" un dispositivo
app.post("/connect-device", (req, res) => {
  const { deviceId } = req.body;
  if (deviceId) {
    devices.push(deviceId);
    console.log("Dispositivos conectados:", devices);
    res.json({ message: "Dispositivo conectado", devices });
  } else {
    res.status(400).json({ message: "No se recibió deviceId" });
  }
});

// Endpoint para "desconectar" un dispositivo
app.post("/disconnect-device", (req, res) => {
  const { deviceId } = req.body;
  if (deviceId) {
    devices = devices.filter((id) => id !== deviceId);
    console.log("Dispositivos conectados:", devices);
    res.json({ message: "Dispositivo desconectado", devices });
  } else {
    res.status(400).json({ message: "No se recibió deviceId" });
  }
});

// Endpoint para enviar archivo
app.post("/send-file", (req, res) => {
  const fileData = req.body;
  console.log("Recibiendo archivo...", fileData);
  // Aquí puedes procesar o almacenar el archivo según necesites
  res.json({ message: "Archivo recibido", fileData });
});

// Ruta genérica para servir el index.html de Angular (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/selek-t-app", "index.html"));
});

// ------------------------------
// Manejo de WebSockets
// ------------------------------
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");
  devices.push(socket.id); // Añade el dispositivo a la lista de dispositivos conectados
  io.emit("update-devices", devices); // Notifica a todos los dispositivos conectados sobre los nuevos dispositivos

  // Recibir archivos
  socket.on("send-file", (fileData) => {
    console.log("Recibiendo archivo...");
    io.emit("receive-file", fileData); // Enviar el archivo a todos los dispositivos
  });

  // Manejo de desconexión
  socket.on("disconnect", () => {
    devices = devices.filter((id) => id !== socket.id); // Eliminar el dispositivo desconectado de la lista
    io.emit("update-devices", devices); // Actualizar la lista de dispositivos conectados
  });
});

// Ping para mantener el servidor activo (opcional)
setInterval(() => {
  fetch("http://selekt-app.onrender.com")
    .then((res) => console.log("Ping enviado para mantener el servidor activo"))
    .catch((err) => console.error("Error en el ping:", err));
}, 300000);

// Iniciamos el servidor en el puerto asignado
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
