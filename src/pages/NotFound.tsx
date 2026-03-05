import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation";
import { useTheme } from "next-themes";

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background text-foreground">
      <LiquidEffectAnimation theme={theme as "light" | "dark"} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 text-center space-y-8 p-12 glass-mist max-w-lg rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl"
      >
        <div className="space-y-4">
          <motion.h1
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-9xl font-black tracking-tighter text-primary/20 absolute -top-16 left-1/2 -translate-x-1/2 select-none"
          >
            404
          </motion.h1>
          <h2 className="text-4xl font-display font-bold text-foreground">Lost in Logic?</h2>
          <p className="text-lg text-muted-foreground max-w-xs mx-auto">
            The algorithm you're looking for doesn't exist in our current dataset. Let's get you back.
          </p>
        </div>

        <Link to="/">
          <Button className="neumorphic-button text-primary font-bold px-8 py-6 rounded-2xl group border-0 bg-transparent hover:bg-transparent transition-all">
            <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Back to Reality
          </Button>
        </Link>
      </motion.div>

      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
    </div>
  );
}
