import axios from "axios";

const userApiUrl = import.meta.env.VITE_USER_API_URL;

if (!userApiUrl) {
  throw new Error("Missing VITE_USER_API_URL");
}

const userApiClient = axios.create({
  baseURL: userApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default userApiClient;
