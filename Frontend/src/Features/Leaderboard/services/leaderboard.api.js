import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export async function fetchLeaderboard() {
    const response = await api.get("/api/leaderboard");
    return response.data;
}

export async function updateLeaderboard(score) {
    const response = await api.post("/api/leaderboard/update", { score });
    return response.data;
}