import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Home, Moon, Sun, LogIn, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function LogoDropdown() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      navigate("/");
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  // Get initials from name for avatar fallback
  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 relative rounded-full neumorphic-button hover:bg-transparent transition-transform hover:scale-105 ml-2 border-0 overflow-hidden"
        >
          {isAuthenticated && user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? "User"}
              className="rounded-full object-cover w-full h-full"
              referrerPolicy="no-referrer"
            />
          ) : isAuthenticated ? (
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {initials}
            </div>
          ) : (
            <img
              src="https://harmless-tapir-303.convex.cloud/api/storage/bcd7fca8-acbb-499c-8dac-8531f807a2bf"
              alt="Logo"
              className="rounded-full object-cover w-full h-full p-0.5"
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 neumorphic-card border-none mt-4 p-2 z-[100]">
        {isAuthenticated && user && (
          <>
            <div className="px-3 py-3 border-b border-border/20 mb-1">
              <p className="font-semibold text-primary text-sm truncate">
                {user.displayName ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </>
        )}

        <DropdownMenuItem
          onClick={() => navigate("/")}
          className="cursor-pointer focus:bg-secondary rounded-xl py-3 px-3"
        >
          <Home className="mr-3 h-4 w-4 text-primary" />
          <span className="font-medium">Landing Page</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={toggleTheme}
          className="cursor-pointer focus:bg-secondary rounded-xl py-3 px-3"
        >
          {theme === "light" ? (
            <Moon className="mr-3 h-4 w-4 text-primary" />
          ) : (
            <Sun className="mr-3 h-4 w-4 text-primary" />
          )}
          <span className="font-medium">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-border/20" />

        {isAuthenticated ? (
          <DropdownMenuItem
            onClick={handleSignOut}
            className="cursor-pointer focus:bg-destructive/10 rounded-xl py-3 px-3 text-destructive focus:text-destructive"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-medium">Sign Out</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => navigate("/auth")}
            className="cursor-pointer focus:bg-secondary rounded-xl py-3 px-3"
          >
            <LogIn className="mr-3 h-4 w-4 text-primary" />
            <span className="font-medium">Sign In</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Standalone user avatar badge for use in other components
export function UserAvatarBadge() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <button
      onClick={() => navigate("/auth")}
      className="flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity cursor-pointer"
    >
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt="Avatar"
          className="h-7 w-7 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
          {initials}
        </div>
      )}
      <span className="hidden sm:inline">{user?.displayName?.split(" ")[0] ?? "Account"}</span>
      <User className="h-3 w-3 sm:hidden" />
    </button>
  );
}