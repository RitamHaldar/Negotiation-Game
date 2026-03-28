import axios from "axios";

const api = axios.create({
    baseURL: "https://negotiation-game.onrender.com",
    withCredentials: true,
});

export async function fetchUserStats() {
    const response = await api.get("/api/leaderboard/user-stats");
    return response.data;
}

export async function fetchTopRankings() {
    const response = await api.get("/api/leaderboard");
    return response.data;
}

