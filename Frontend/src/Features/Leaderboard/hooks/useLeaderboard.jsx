import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, updateLeaderboard } from '../services/leaderboard.api';
import { 
    setLeaderboard, 
    setLoading, 
    setError 
} from '../leaderboard.slice';

export const useLeaderboard = () => {
    const dispatch = useDispatch();
    const { leaderboard, loading, error } = useSelector(state => state.leaderboard);

    const getLeaderboard = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await fetchLeaderboard();
            if (response.success && response.leaderboard) {
                dispatch(setLeaderboard(response.leaderboard));
            } else {
                dispatch(setError(response.message || 'Failed to fetch leaderboard'));
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

    const addScoreToLeaderboard = async (score) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await updateLeaderboard(score);
            if (response.success) {
                await getLeaderboard();
            } else {
                dispatch(setError(response.message || 'Failed to update leaderboard'));
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
        leaderboard,
        loading,
        error,
        getLeaderboard,
        addScoreToLeaderboard
    };
};
