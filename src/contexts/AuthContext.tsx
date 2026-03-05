import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    sendSignInLinkToEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    isSignInWithEmailLink,
    signInWithEmailLink,
    type User,
} from "firebase/auth";
import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    sendVerificationEmail: () => Promise<void>;
    sendSignInLink: (email: string) => Promise<void>;
    completeSignInWithLink: (email: string, link: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Complete email link sign-in if user arrives via a magic link
    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            const email = window.localStorage.getItem("emailForSignIn");
            if (email) {
                signInWithEmailLink(auth, email, window.location.href)
                    .then(() => {
                        window.localStorage.removeItem("emailForSignIn");
                    })
                    .catch((error) => {
                        console.error("Email link sign-in error:", error);
                    });
            }
        }
    }, []);

    const signUpWithEmail = async (email: string, password: string) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        // Send email verification after signup
        await sendEmailVerification(credential.user);
    };

    const signInWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider);
    };

    const sendVerificationEmail = async () => {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
        }
    };

    const sendSignInLink = async (email: string) => {
        const actionCodeSettings = {
            url: window.location.origin + "/auth",
            handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem("emailForSignIn", email);
    };

    const completeSignInWithLink = async (email: string, link: string) => {
        await signInWithEmailLink(auth, email, link);
        window.localStorage.removeItem("emailForSignIn");
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signUpWithEmail,
                signInWithEmail,
                signInWithGoogle,
                sendVerificationEmail,
                sendSignInLink,
                completeSignInWithLink,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
