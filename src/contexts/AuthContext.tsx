import { createContext, useEffect, useState, ReactNode } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut as firebaseSignOut,
    updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    // Start as true — we won't show the app until we've checked both
    // the redirect result AND the auth state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let authUnsubscribe: (() => void) | null = null;

        // Step 1: Check if we're coming back from a Google redirect
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    // User just signed in via Google redirect — set them immediately
                    setUser(result.user);
                }
            })
            .catch((err) => {
                console.error("getRedirectResult error:", err);
            })
            .finally(() => {
                // Step 2: After redirect result is resolved (or failed),
                // NOW set up the auth state listener and finish loading
                authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                    setUser(firebaseUser);
                    setIsLoading(false);
                });
            });

        return () => {
            if (authUnsubscribe) authUnsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string, name: string) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
            await updateProfile(credential.user, { displayName: name });
        }
    };

    const signInWithGoogle = async () => {
        try {
            // Try popup first — instant sign-in, no page redirect
            await signInWithPopup(auth, googleProvider);
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            // If popup was blocked or closed, fall back to redirect
            if (
                code === "auth/popup-blocked" ||
                code === "auth/popup-closed-by-user" ||
                code === "auth/cancelled-popup-request"
            ) {
                await signInWithRedirect(auth, googleProvider);
            } else {
                throw err;
            }
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                signIn,
                signUp,
                signInWithGoogle,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
