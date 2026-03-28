import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, logoutUser, getMe } from '../services/auth.api';
import {
    setUser,
    setLoading,
    setError
} from '../auth.slice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(state => state.auth);

    const handleLogin = async (credentials) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await loginUser(credentials);
            if (response.success && response.user) {
                dispatch(setUser(response.user));
            } else {
                dispatch(setError(response.message || 'Login failed'));
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

    const handleRegister = async (userData) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await registerUser(userData);
            if (response.success && response.user) {
                dispatch(setUser(response.user));
            } else {
                dispatch(setError(response.message || 'Registration failed'));
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

    const handleLogout = async () => {
        dispatch(setLoading(true));
        try {
            const response = await logoutUser();
            if (response.success) {
                dispatch(setUser(null));
            }
            return response;
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchMe = async () => {
        dispatch(setLoading(true));
        try {
            const response = await getMe();
            if (response.success && response.user) {
                const formattedUser = {
                    ...response.user,
                    user: response.user.username
                };
                dispatch(setUser(formattedUser));
            }
            return response;
        } catch (err) {
            console.error("Fetch me failed:", err);
            dispatch(setUser(null));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        user,
        loading,
        error,
        handleLogin,
        handleRegister,
        handleLogout,
        fetchMe
    };
};
