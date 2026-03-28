import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export async function loginUser(credentials) {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
}

export async function registerUser(userData) {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
}

export async function logoutUser() {
    const response = await api.post("/api/auth/logout");
    return response.data;
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me");
    return response.data;
}
