import axios from "axios";

export const serverInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

await fetch("", {
  method: "POST",
});
