import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 5000;

// Connect Database
await connectDB();

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

// Initialize Socket.IO
initSocket(server);