import cors from "cors";

export const corsMiddleware = () =>
  cors({
    origin: '*',
    // origin: [
    //   'http://host.docker.internal',
    //   `http://${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}`,
    //   `https://${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}`,
    //   `http://localhost:5173`
    // ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  });
