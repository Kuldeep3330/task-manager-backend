import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  const server = http.createServer(app);

  // Optional real-time notifications via Socket.IO
  // NOTE: integrate emit logic where needed (e.g., after creating/updating tasks)
  import("socket.io").then(({ Server }) => {
    const io = new Server(server, { cors: { origin: "*" } });
    io.on("connection", socket => {
      console.log("Socket connected:", socket.id);
      socket.on("join", room => socket.join(room));
      socket.on("leave", room => socket.leave(room));
      socket.on("disconnect", () => {});
    });
    // attach io to app for controllers to use
    app.set("io", io);
  });

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(err => {
  console.error("Failed to start:", err);
  process.exit(1);
});
