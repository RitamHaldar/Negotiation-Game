import axios from "axios";

const api = axios.create({
    baseURL: "https://negotiation-game.onrender.com",
    withCredentials: true,
});

export async function startGame(productName, difficulty) {
    const response = await api.post("/api/game/start", { productName, difficulty });
    return response.data;
}

export async function makeOffer(gameId, offerPrice, message) {
    const response = await api.post("/api/game/offer", { gameId, offerPrice, message });
    return response.data;
}

export async function endGame(gameId, finalPrice) {
    const response = await api.post("/api/game/end", { gameId, finalPrice });
    return response.data;
}

export async function getSuggestion(gameId) {
    const response = await api.post("/api/game/suggestion", { gameId });
    return response.data;
}