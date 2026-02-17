
import { useAuthStore } from '../../../core/store/authStore';
import { authService } from '../services/authService';

export const useAuth = () => {
    const { login, logout, user, isAuthenticated } = useAuthStore();

    const signIn = async (email: string, password: string) => {
        try {
            const data = await authService.login(email, password);
            login(data.user, data.token);
        } catch (error) {
            console.error(error);
        }
    };

    const signOut = async () => {
        await authService.logout();
        logout();
    };

    return {
        signIn,
        signOut,
        user,
        isAuthenticated,
    };
};
