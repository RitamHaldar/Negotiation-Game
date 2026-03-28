import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "../Features/Home/home.slice.js";
import leaderboardReducer from "../Features/Leaderboard/leaderboard.slice.js";
import chatReducer from "../Features/Chat/chat.slice.js";
import authReducer from "../Features/Auth/auth.slice.js";

export const store = configureStore({
    reducer: {
        home: homeReducer,
        leaderboard: leaderboardReducer,
        chat: chatReducer,
        auth: authReducer,
    },
});
