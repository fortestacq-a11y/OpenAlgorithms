import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router";

/**
 * Wraps a route so only authenticated users can access it.
 * Unauthenticated users are redirected to /auth with a return URL.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        // Redirect to auth page, preserving the intended destination
        return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return <>{children}</>;
}
