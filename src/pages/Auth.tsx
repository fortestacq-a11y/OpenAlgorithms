import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
    Mail,
    Lock,
    Link2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Auth() {
    const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, sendSignInLink } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Read redirect from query params (set by ProtectedRoute)
    const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/";

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Magic link state
    const [showMagicLink, setShowMagicLink] = useState(false);
    const [magicLinkEmail, setMagicLinkEmail] = useState("");
    const [magicLinkSent, setMagicLinkSent] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate(redirectTo);
        }
    }, [loading, user, navigate, redirectTo]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmail(email, password);
            toast.success("Welcome back!");
            navigate(redirectTo);
        } catch (error: any) {
            const msg = error?.code === "auth/invalid-credential"
                ? "Invalid email or password"
                : error?.code === "auth/user-not-found"
                    ? "No account found with this email"
                    : error?.code === "auth/too-many-requests"
                        ? "Too many attempts. Please try again later"
                        : "Sign in failed. Please try again.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setIsLoading(true);
        try {
            await signUpWithEmail(email, password);
            toast.success("Account created! Check your email for verification.");
            navigate(redirectTo);
        } catch (error: any) {
            const msg = error?.code === "auth/email-already-in-use"
                ? "An account with this email already exists"
                : error?.code === "auth/weak-password"
                    ? "Password is too weak"
                    : "Sign up failed. Please try again.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            toast.success("Signed in with Google!");
            navigate(redirectTo);
        } catch (error: any) {
            if (error?.code !== "auth/popup-closed-by-user") {
                toast.error("Google sign-in failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };


    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await sendSignInLink(magicLinkEmail);
            setMagicLinkSent(true);
            toast.success("Magic link sent! Check your email.");
        } catch (error: any) {
            toast.error("Failed to send magic link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background relative overflow-hidden font-body">
            {/* Background design */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Back button */}
            <div className="p-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                    className="gap-2 text-muted-foreground hover:text-foreground neumorphic-button bg-transparent border-0 hover:bg-transparent"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Button>
            </div>

            {/* Auth Card */}
            <div className="flex-1 flex items-center justify-center px-4 pb-16">
                <div className="w-full max-w-md">
                    {showMagicLink ? (
                        /* Magic Link Flow */
                        <Card className="border-none neumorphic-card p-2 sm:p-4">
                            <CardHeader className="text-center space-y-3 pb-2">
                                <div className="mx-auto w-14 h-14 rounded-full neumorphic-inset flex items-center justify-center mb-2">
                                    <Link2 className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-display font-bold text-primary">
                                    {magicLinkSent ? "Check Your Email" : "Magic Link Sign In"}
                                </CardTitle>
                                <CardDescription className="font-body text-base">
                                    {magicLinkSent
                                        ? `We sent a sign-in link to ${magicLinkEmail}`
                                        : "Enter your email and we'll send you a sign-in link"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {magicLinkSent ? (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl neumorphic-inset text-center border border-green-500/30">
                                            <p className="text-sm text-green-600 dark:text-green-400 font-bold">
                                                ✓ Link sent! Click the link in your email to sign in.
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full neumorphic-button hover:bg-transparent border-0 font-bold text-primary"
                                            onClick={() => {
                                                setMagicLinkSent(false);
                                                setMagicLinkEmail("");
                                            }}
                                        >
                                            Send to different email
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleMagicLink} className="space-y-4 border-none">
                                        <div className="space-y-2">
                                            <Label htmlFor="magic-email" className="font-bold text-primary ml-1">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="magic-email"
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    value={magicLinkEmail}
                                                    onChange={(e) => setMagicLinkEmail(e.target.value)}
                                                    className="pl-12 h-12 neumorphic-inset border-transparent focus:border-primary/30 transition-all font-mono shadow-none"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full h-12 btn-primary-slate text-base mt-2" disabled={isLoading}>
                                            {isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            ) : (
                                                <Mail className="h-5 w-5 mr-2" />
                                            )}
                                            Send Magic Link
                                        </Button>
                                    </form>
                                )}
                                <Button
                                    variant="ghost"
                                    className="w-full mt-4 text-muted-foreground hover:text-primary neumorphic-button hover:bg-transparent border-0"
                                    onClick={() => {
                                        setShowMagicLink(false);
                                        setMagicLinkSent(false);
                                    }}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to sign in
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Main Auth Card */
                        <Card className="border-none neumorphic-card p-2 sm:p-4">
                            <CardHeader className="text-center space-y-3 pb-2 pt-6">
                                <div className="flex justify-center mb-2">
                                    <div className="neumorphic-inset rounded-2xl p-2 cursor-pointer hover:scale-[1.03] transition-transform active:scale-95" onClick={() => navigate("/")}>
                                        <img
                                            src="https://harmless-tapir-303.convex.cloud/api/storage/bcd7fca8-acbb-499c-8dac-8531f807a2bf"
                                            alt="Open Algorithms"
                                            className="h-12 w-12 rounded-xl object-cover"
                                        />
                                    </div>
                                </div>
                                <CardTitle className="text-3xl font-display font-bold text-primary">Welcome</CardTitle>
                                <CardDescription className="text-base font-body">
                                    Sign in parameters required for interaction
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {/* OAuth Buttons */}
                                <div className="space-y-3 mb-6">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-sm font-bold gap-3 neumorphic-button bg-transparent border border-white/40 hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                                        onClick={handleGoogleSignIn}
                                        disabled={isLoading}
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Continue with Google
                                    </Button>

                                </div>

                                {/* Divider */}
                                <div className="relative mb-6">
                                    <Separator className="bg-border/40" />
                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-3 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                        or continue with email
                                    </span>
                                </div>

                                {/* Email/Password Tabs */}
                                <Tabs defaultValue="signin" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6 h-12 neumorphic-inset rounded-full p-1 border border-border/10">
                                        <TabsTrigger value="signin" className="rounded-full data-[state=active]:neumorphic-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold transition-all">Sign In</TabsTrigger>
                                        <TabsTrigger value="signup" className="rounded-full data-[state=active]:neumorphic-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold transition-all">Sign Up</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="signin">
                                        <form onSubmit={handleSignIn} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="signin-email" className="font-bold text-primary ml-1">Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        id="signin-email"
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="pl-12 h-12 neumorphic-inset border-transparent focus:border-primary/30 transition-all shadow-none"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="signin-password" className="font-bold text-primary ml-1">Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        id="signin-password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="pl-12 h-12 neumorphic-inset border-transparent focus:border-primary/30 transition-all font-mono shadow-none"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full h-12 btn-primary-slate text-base mt-2" disabled={isLoading}>
                                                {isLoading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                ) : (
                                                    <ArrowRight className="h-5 w-5 mr-2" />
                                                )}
                                                Sign In
                                            </Button>
                                        </form>
                                    </TabsContent>

                                    <TabsContent value="signup">
                                        <form onSubmit={handleSignUp} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="signup-email" className="font-bold text-primary ml-1">Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        id="signup-email"
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="pl-12 h-12 neumorphic-inset border-transparent focus:border-primary/30 transition-all shadow-none"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="signup-password" className="font-bold text-primary ml-1">Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        id="signup-password"
                                                        type="password"
                                                        placeholder="Min 6 characters"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="pl-12 h-12 neumorphic-inset border-transparent focus:border-primary/30 transition-all font-mono shadow-none"
                                                        required
                                                        minLength={6}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="signup-confirm" className="font-bold text-primary ml-1">Confirm Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        id="signup-confirm"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="pl-12 h-12 neumorphic-inset border-transparent focus:border-primary/30 transition-all font-mono shadow-none"
                                                        required
                                                        minLength={6}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full h-12 btn-primary-slate text-base mt-2" disabled={isLoading}>
                                                {isLoading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                ) : (
                                                    <ArrowRight className="h-5 w-5 mr-2" />
                                                )}
                                                Create Account
                                            </Button>
                                        </form>
                                    </TabsContent>
                                </Tabs>

                                {/* Magic Link Option */}
                                <div className="mt-8 text-center bg-transparent">
                                    <Button
                                        variant="link"
                                        className="text-sm font-semibold text-muted-foreground hover:text-primary neumorphic-button hover:bg-transparent border-0 h-10 px-6 rounded-full"
                                        onClick={() => setShowMagicLink(true)}
                                    >
                                        <Link2 className="h-4 w-4 mr-2" />
                                        Sign in with magic link
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Footer */}
                    <p className="text-center text-xs text-muted-foreground mt-8 opacity-60">
                        By signing in, you agree to our{" "}
                        <a href="#" className="underline hover:text-foreground transition-colors font-semibold">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline hover:text-foreground transition-colors font-semibold">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
