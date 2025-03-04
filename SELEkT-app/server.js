// Importamos las bibliotecas necesarias
const express = require("express"); // Framework web para Node.js
const http = require("http"); // Para crear el servidor HTTP
const path = require("path");
const socketIo = require("socket.io");

// Inicializamos la aplicación Express
const app = express();
app.use(express.json()); // Para parsear JSON en el body

// Servir archivos estáticos de "public" (si los hay)
app.use(express.static("public"));

// Servir los archivos estáticos generados por Angular (asegúrate de que el outputPath coincida con el de angular.json)
app.use(express.static(path.join(__dirname, "dist", "SELEkT-app")));

// Creamos un servidor HTTP utilizando la aplicación Express
const server = http.createServer(app);

// Inicializamos Socket.IO para la señalización
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Definimos el puerto dinámico asignado por Render
const PORT = process.env.PORT || 10000;

// Manejo de conexión de clientes para señalización WebRTC
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);

  // Notifica a los demás de la llegada de un nuevo peer
  socket.broadcast.emit("new-peer", { socketId: socket.id });

  // Escucha la oferta (SDP) y la reenvía al destinatario
  socket.on("offer", (data) => {
    console.log("Oferta recibida de", socket.id);
    io.to(data.target).emit("offer", { sdp: data.sdp, socketId: socket.id });
  });

  // Escucha la respuesta y la reenvía al emisor de la oferta
  socket.on("answer", (data) => {
    console.log("Respuesta recibida de", socket.id);
    io.to(data.target).emit("answer", { sdp: data.sdp, socketId: socket.id });
  });

  // Escucha candidatos ICE y los reenvía
  socket.on("ice-candidate", (data) => {
    console.log("Candidato ICE recibido de", socket.id);
    io.to(data.target).emit("ice-candidate", {
      candidate: data.candidate,
      socketId: socket.id,
    });
  });

  // Cuando un cliente se desconecta, se notifica a los demás
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
    socket.broadcast.emit("peer-disconnected", { socketId: socket.id });
  });
});

// Ruta genérica para servir el index.html de Angular (para el enrutamiento de SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "SELEkT-app", "index.html"));
});

// (Opcional) Ping para mantener el servidor activo
setInterval(() => {
  // Utilizamos la URL interna HTTP ya que Render gestiona la salida
  fetch("http://selekt-app.onrender.com")
    .then((res) => console.log("Ping enviado para mantener el servidor activo"))
    .catch((err) => console.error("Error en el ping:", err));
}, 300000);

// Iniciamos el servidor en el puerto asignado
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
