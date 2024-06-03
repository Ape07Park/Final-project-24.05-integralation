// useNavigation.js
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../context/AuthContext";

const useNavigation = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();

    // ============== 페이지 이동 관련 =================

    const handleLogin = () => {
        navigate('/signIn');
    };

    const handleLogout = () => {
        logout();
        navigate('/signIn');
    };

    const handleSignUp = () => {
        navigate('/signUp');
    };

    const handleUserInfo = () => {
        navigate('/userInfo');
    };

    const handleToCart = () => {
        if (!user || !user.email) {
            window.location.href = '/signIn';
            return;
        }
        navigate('/cart');
    };

    const handleWish = () => {
        if (!user || !user.email) {
            window.location.href = '/signIn';
            return;
        }
        navigate('/wish/list');
    };

    const handleToOrderHistory = () => {
        if (!user || !user.email) {
            window.location.href = '/signIn';
            if (window.confirm('비회원 조회를 원하시나요?')) {
                window.location.href = '/nonMemberOrderHistory';
            }
            return;
        }
        navigate('/OrderHistoryList');
    };

    return {
        handleLogin,
        handleLogout,
        handleSignUp,
        handleUserInfo,
        handleToCart,
        handleWish,
        handleToOrderHistory,
    };
};

export default useNavigation;
