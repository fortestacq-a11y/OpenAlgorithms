import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { Home, LogOut, Moon, Sun, User } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function LogoDropdown() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 relative rounded-full neumorphic-button hover:bg-transparent transition-transform hover:scale-105 ml-2 border-0">
          {user ? (
            <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
              {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
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
        {user && (
          <>
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{user.displayName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/30 my-1" />
          </>
        )}

        <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer focus:bg-secondary rounded-xl py-3 px-3">
          <Home className="mr-3 h-4 w-4 text-primary" />
          <span className="font-medium">Landing Page</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer focus:bg-secondary rounded-xl py-3 px-3">
          {theme === "light" ? <Moon className="mr-3 h-4 w-4 text-primary" /> : <Sun className="mr-3 h-4 w-4 text-primary" />}
          <span className="font-medium">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </DropdownMenuItem>

        {user && (
          <>
            <DropdownMenuSeparator className="bg-border/30 my-1" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-xl py-3 px-3"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}