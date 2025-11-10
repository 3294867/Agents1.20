import { ReactNode, useEffect, useMemo, useState } from "react";
import AuthContext, { AuthContextValue } from "./AuthContext";
import express from "src/routes/express";

interface Props {
    children: ReactNode;
}

const Provider = ({ children }: Props) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        express.auth
            .getCurrentUser()
            .then(({ userId }) => {
                if (mounted) setUserId(userId);
            })
            .catch(() => {
                /* ignore */
            })
            .finally(() => setIsLoading(false));
        return () => {
            mounted = false;
        };
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            userId,
            isLoading,
            error,
            login: async (name: string, password: string) => {
                setError(null);
                const { userId } = await express.auth.login({ name, password });
                setUserId(userId);
            },
            signUp: async (name: string, password: string, apiKey: string) => {
                setError(null);
                const { userId } = await express.auth.signUp({
                    name,
                    password,
                    apiKey,
                });
                setUserId(userId);
            },
            logout: async () => {
                setError(null);
                await express.auth.logout();
                setUserId(null);
            },
        }),
        [userId, isLoading, error],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default Provider;
