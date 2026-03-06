import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation";
import { useTheme } from "next-themes";

type Tab = "signin" | "signup";

export default function Auth() {
    const { signIn, signUp, signInWithGoogle, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [tab, setTab] = useState<Tab>("signin");
    const [loading, setLoading] = useState(false);

    // Sign In form
    const [siEmail, setSiEmail] = useState("");
    const [siPassword, setSiPassword] = useState("");

    // Sign Up form
    const [suName, setSuName] = useState("");
    const [suEmail, setSuEmail] = useState("");
    const [suPassword, setSuPassword] = useState("");
    const [suConfirm, setSuConfirm] = useState("");

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!siEmail || !siPassword) return toast.error("Please fill in all fields.");
        setLoading(true);
        try {
            await signIn(siEmail, siPassword);
            toast.success("Welcome back!");
            navigate("/");
        } catch {
            toast.error("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!suName || !suEmail || !suPassword || !suConfirm) return toast.error("Please fill in all fields.");
        if (suPassword !== suConfirm) return toast.error("Passwords do not match.");
        if (suPassword.length < 6) return toast.error("Password must be at least 6 characters.");
        setLoading(true);
        try {
            await signUp(suEmail, suPassword, suName);
            toast.success("Account created! Welcome.");
            navigate("/");
        } catch (err: unknown) {
            const msg = (err as { code?: string })?.code;
            if (msg === "auth/email-already-in-use") {
                toast.error("An account with this email already exists.");
            } else {
                toast.error("Sign up failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            toast.success("Signed in with Google!");
            navigate("/");
        } catch {
            toast.error("Google sign-in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
            <LiquidEffectAnimation theme={theme as "light" | "dark"} />

            {/* Background blobs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl opacity-10 -z-10" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl opacity-10 -z-10" />

            {/* Back button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-display text-primary tracking-tight">Open Algorithms</h1>
                    <p className="text-muted-foreground mt-2 font-body">
                        {tab === "signin" ? "Welcome back. Sign in to continue." : "Create an account to get started."}
                    </p>
                </div>

                {/* Card */}
                <div className="neumorphic-card p-8 rounded-3xl">
                    {/* Tab Switcher */}
                    <div className="flex neumorphic-inset rounded-full p-1 mb-8">
                        {(["signin", "signup"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${tab === t
                                        ? "btn-primary-slate text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-primary"
                                    }`}
                            >
                                {t === "signin" ? "Sign In" : "Sign Up"}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {tab === "signin" ? (
                            <motion.form
                                key="signin"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleSignIn}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="si-email" className="text-xs font-bold uppercase tracking-widest text-primary">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="si-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={siEmail}
                                            onChange={(e) => setSiEmail(e.target.value)}
                                            className="pl-10 neumorphic-inset border-transparent focus:border-primary/30 h-11 font-mono"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="si-password" className="text-xs font-bold uppercase tracking-widest text-primary">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="si-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={siPassword}
                                            onChange={(e) => setSiPassword(e.target.value)}
                                            className="pl-10 neumorphic-inset border-transparent focus:border-primary/30 h-11 font-mono"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 btn-primary-slate cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="signup"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleSignUp}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="su-name" className="text-xs font-bold uppercase tracking-widest text-primary">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="su-name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={suName}
                                            onChange={(e) => setSuName(e.target.value)}
                                            className="pl-10 neumorphic-inset border-transparent focus:border-primary/30 h-11"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="su-email" className="text-xs font-bold uppercase tracking-widest text-primary">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="su-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={suEmail}
                                            onChange={(e) => setSuEmail(e.target.value)}
                                            className="pl-10 neumorphic-inset border-transparent focus:border-primary/30 h-11 font-mono"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="su-password" className="text-xs font-bold uppercase tracking-widest text-primary">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="su-password"
                                            type="password"
                                            placeholder="Min. 6 characters"
                                            value={suPassword}
                                            onChange={(e) => setSuPassword(e.target.value)}
                                            className="pl-10 neumorphic-inset border-transparent focus:border-primary/30 h-11 font-mono"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="su-confirm" className="text-xs font-bold uppercase tracking-widest text-primary">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="su-confirm"
                                            type="password"
                                            placeholder="••••••••"
                                            value={suConfirm}
                                            onChange={(e) => setSuConfirm(e.target.value)}
                                            className="pl-10 neumorphic-inset border-transparent focus:border-primary/30 h-11 font-mono"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 btn-primary-slate cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/30" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-3 text-muted-foreground font-semibold tracking-widest">
                                or
                            </span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 neumorphic-button border-0 hover:bg-transparent flex items-center gap-3 cursor-pointer font-semibold"
                        onClick={handleGoogle}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {/* Google SVG Icon */}
                                <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
}
