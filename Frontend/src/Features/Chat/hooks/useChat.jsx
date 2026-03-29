import { useDispatch, useSelector } from 'react-redux';
import { startGame, makeOffer, endGame, getSuggestion } from '../services/chat.api';
import {
    setGame,
    addMessage,
    updateGameProgress,
    setPatience,
    setThinking,
    setLoading,
    setError
} from '../chat.slice';

export const useChat = () => {
    const dispatch = useDispatch();
    const { gameId, round, currentPrice } = useSelector(state => state.chat);

    const handleStartGame = async (productName, difficulty) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await startGame(productName, difficulty);
            if (response.success && response.game) {
                dispatch(setGame(response.game));
                dispatch(addMessage({
                    role: 'seller',
                    message: `MY initial valuation for ${response.game.product} is set at ₹${response.game.startingPrice.toLocaleString()}. What is your opening counter-proposal?`,
                    offerPrice: response.game.startingPrice
                }));
            } else {
                dispatch(setError(response.message || 'Failed to start game'));
            }
            return response;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            dispatch(setError(errMsg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleMakeOffer = async (offerPrice, message) => {
        if (!gameId) return;

        dispatch(addMessage({ role: 'user', message, offerPrice }));
        dispatch(setThinking(true));
        dispatch(setError(null));

        try {
            const response = await makeOffer(gameId, offerPrice, message);
            if (response.success) {
                const { aiOffer, decision, patience } = response;
                dispatch(setPatience(patience));
                dispatch(addMessage({
                    role: 'seller',
                    message: aiOffer.message,
                    offerPrice: aiOffer.offerPrice
                }));

                const newStatus = decision === 'accept' ? 'accepted' : (decision === 'reject' ? 'rejected' : 'active');

                let finalScore = null;
                let actualFinalPrice = null;

                if (newStatus === 'accepted' || newStatus === 'rejected') {
                    const settlementPrice = newStatus === 'accepted' ? aiOffer.offerPrice : 0;
                    try {
                        const endResponse = await endGame(gameId, settlementPrice);
                        if (endResponse.success) {
                            finalScore = endResponse.score;
                            actualFinalPrice = endResponse.finalPrice;
                        }
                    } catch (err) {
                        console.error("Auto endGame trigger failed during offer handling:", err);
                    }
                }

                dispatch(updateGameProgress({
                    currentPrice: aiOffer.offerPrice,
                    round: round + 1,
                    status: newStatus,
                    ...(finalScore !== null && { score: finalScore }),
                    ...(actualFinalPrice !== null && { finalPrice: actualFinalPrice })
                }));

                return response;
            } else {
                dispatch(setError(response.message || 'Failed to make offer'));
            }
        } catch (error) {
            console.error("Make offer error:", error);
            const errMsg = error.response?.data?.message || error.message;
            dispatch(setError(errMsg));
            throw error;
        } finally {
            dispatch(setThinking(false));
        }
    };

    const handleEndGame = async (finalPrice = currentPrice) => {
        if (!gameId) return;
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await endGame(gameId, finalPrice);
            if (response.success) {
                dispatch(updateGameProgress({
                    score: response.score,
                    finalPrice: response.finalPrice,
                    status: 'completed'
                }));
            } else {
                dispatch(setError(response.message || 'Failed to end game'));
            }
            return response;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            dispatch(setError(errMsg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchSuggestion = async () => {
        if (!gameId) return;
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await getSuggestion(gameId);
            return response.suggestion;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            dispatch(setError(errMsg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        handleStartGame,
        handleMakeOffer,
        handleEndGame,
        fetchSuggestion
    };
};
