import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useTokens = create(
    persist(
        (set, get) => ({
            access_token: null,
            refresh_token: null,

            setTokens: (data) => {
                set({
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                });
            },

            clearTokens: () => {
                set({
                    access_token: null,
                    refresh_token: null
                })
            },

            getToken: () => {
                const { access_token, isTokenValid } = get();
                return isTokenValid() ? access_token : null;
            },

            isTokenValid: () => {
                const { access_token } = get();
                if (!access_token) return false;

                try {
                    const payload = JSON.parse(atob(access_token.split('.')[1]));
                    const isExpired = payload.exp * 1000 < Date.now();
                    return !isExpired;
                } catch (error) {
                    return false;
                }
            },


        }),
        {
            name: 'tokens-storage',
            partialize: (state) => ({ access_token: state.access_token, refresh_token: state.refresh_token }),
        }
    )
);
