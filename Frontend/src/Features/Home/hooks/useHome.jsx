import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStats, fetchTopRankings } from '../services/home.api';
import {
    setUserStats,
    setTopRankings,
    setLoading,
    setError
} from '../home.slice';

export const useHome = () => {
    const dispatch = useDispatch();
    const { userStats, topRankings, liveFeed, loading, error } = useSelector(state => state.home);

    const getUserStats = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await fetchUserStats();
            if (response.success && response.userStats) {
                const stats = Array.isArray(response.userStats) ? response.userStats[0] : response.userStats;
                dispatch(setUserStats(stats));
            } else {
                dispatch(setError(response.message || 'Failed to fetch user stats'));
            }
            return response;
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message;
            dispatch(setError(errMsg));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getTopRankings = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await fetchTopRankings();
            if (response.success && response.leaderboard) {
                dispatch(setTopRankings(response.leaderboard));
            } else {
                dispatch(setError(response.message || 'Failed to fetch rankings'));
            }
            return response;
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message;
            dispatch(setError(errMsg));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        userStats,
        topRankings,
        liveFeed,
        loading,
        error,
        getUserStats,
        getTopRankings,
    };
};
