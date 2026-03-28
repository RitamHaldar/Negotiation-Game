import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userStats: {
        score: 0,
        rank: null,
        totalGames: 0,
        winRate: "0%",
        totalProfit: 0,
    },

    topRankings: [],
    liveFeed: [],

    loading: false,
    error: null,
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUserStats: (state, action) => {
            state.userStats = { ...state.userStats, ...action.payload };
        },
        setTopRankings: (state, action) => {
            state.topRankings = action.payload;
        },
        setLiveFeed: (state, action) => {
            state.liveFeed = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetHome: () => initialState,
    },
});

export const { setUserStats, setTopRankings, setLiveFeed, setLoading, setError, resetHome } = homeSlice.actions;
export default homeSlice.reducer;