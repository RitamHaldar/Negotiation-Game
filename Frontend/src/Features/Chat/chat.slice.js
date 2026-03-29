import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gameId: null,
    product: "",
    startingPrice: 0,
    targetPrice: 0,
    minPrice: 0,
    difficulty: "medium",

    currentPrice: 0,
    userPrice: 0,
    round: 1,
    maxRounds: 10,
    patience: 100,
    status: "idle",

    finalPrice: null,
    score: null,

    messages: [],
    isThinking: false,

    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setGame: (state, action) => {
            const { _id, product, startingPrice, targetPrice, minPrice, difficulty } = action.payload;
            state.gameId = _id;
            state.product = product;
            state.startingPrice = startingPrice;
            state.targetPrice = targetPrice;
            state.minPrice = minPrice;
            state.difficulty = difficulty;
            state.maxRounds = difficulty === "hard" ? 6 : 10;
            state.status = "active";
            state.currentPrice = startingPrice;
            state.userPrice = targetPrice;
            state.messages = [];
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
            if (action.payload.offerPrice) {
                if (action.payload.role === 'user') {
                    state.userPrice = action.payload.offerPrice;
                } else {
                    state.currentPrice = action.payload.offerPrice;
                }
            }
        },
        updateGameProgress: (state, action) => {
            const { round, patience, status, score, finalPrice } = action.payload;
            if (round) state.round = round;
            if (patience) state.patience = patience;
            if (status) state.status = status;
            if (score) state.score = score;
            if (finalPrice) state.finalPrice = finalPrice;
        },
        setPatience: (state, action) => {
            state.patience = action.payload;
        },
        setThinking: (state, action) => {
            state.isThinking = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetChat: () => initialState,
    },
});

export const {
    setGame,
    addMessage,
    updateGameProgress,
    setPatience,
    setThinking,
    setLoading,
    setError,
    resetChat
} = chatSlice.actions;

export default chatSlice.reducer;
