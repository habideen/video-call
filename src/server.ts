import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import { Server } from "socket.io";
import os from "os";
import { registerSocketHandlers } from "./socket";

const app = express();
app.use(cors());
app.use(express.json());

const options = {
  key: fs.readFileSync("./192.168.1.110+1-key.pem"),
  cert: fs.readFileSync("./192.168.1.110+1.pem"),
};

const server = https.createServer(options, app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("public"));

registerSocketHandlers(io);

const PORT = 3000;

server.listen(PORT, () => {
  const interfaces = os.networkInterfaces();
  let networkAddress: string | null = null;

  for (const iface of Object.values(interfaces)) {
    if (!iface) {
      continue;
    }

    for (const addr of iface) {
      if (addr.family === "IPv4" && !addr.internal) {
        networkAddress = addr.address;
        break;
      }
    }

    if (networkAddress) {
      break;
    }
  }

  console.log(`Server running on https://localhost:${PORT}`);
  if (networkAddress) {
    console.log(`Network access: https://${networkAddress}:${PORT}`);
  }
});
