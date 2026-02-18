import { Server, Socket } from "socket.io";

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);

      socket.on(
        "offer",
        (offer: RTCSessionDescriptionInit, targetId: string) => {
          io.to(targetId).emit("offer", offer, socket.id);
        }
      );

      socket.on(
        "answer",
        (answer: RTCSessionDescriptionInit, targetId: string) => {
          io.to(targetId).emit("answer", answer, socket.id);
        }
      );

      socket.on(
        "ice-candidate",
        (candidate: RTCIceCandidateInit, targetId: string) => {
          io.to(targetId).emit("ice-candidate", candidate, socket.id);
        }
      );
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
