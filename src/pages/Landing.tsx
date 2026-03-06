import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { LogoDropdown } from "@/components/LogoDropdown";
import { ArrowRight, BarChart3, Search, Network } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleVisualizerClick = () => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else {
      navigate("/algorithms/bubble-sort");
    }
  };

  // Parallax transforms
  const heroTextY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroButtonsY = useTransform(scrollY, [0, 500], [0, -50]);
  const backgroundShape1Y = useTransform(scrollY, [0, 1000], [0, 300]);
  const backgroundShape2Y = useTransform(scrollY, [0, 1000], [0, -200]);

  // Navbar animation logic
  const navWidth = useSpring(useTransform(scrollY, [0, 50], ["100%", "70%"]), { stiffness: 400, damping: 30 });
  const navTop = useSpring(useTransform(scrollY, [0, 50], ["0px", "16px"]), { stiffness: 400, damping: 30 });
  const navRadius = useSpring(useTransform(scrollY, [0, 50], ["0px", "50px"]), { stiffness: 400, damping: 30 });
  const navBorder = useTransform(scrollY, [0, 50], ["transparent", "rgba(255, 255, 255, 0.3)"]);
  const howItWorksCardY = useTransform(scrollY, [0, 1500], [0, 100]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden transition-colors duration-500">
      <LiquidEffectAnimation theme={theme as "light" | "dark"} />

      {/* Parallax Background Shapes */}
      <motion.div
        style={{ y: backgroundShape1Y, opacity: 0.15 }}
        className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl -z-10"
      />
      <motion.div
        style={{ y: backgroundShape2Y, opacity: 0.15 }}
        className="absolute top-96 right-10 w-96 h-96 bg-primary rounded-full blur-3xl -z-10"
      />

      {/* Animated Navbar */}
      <motion.header
        style={{
          width: navWidth,
          top: navTop,
          borderRadius: navRadius,
          borderColor: navBorder,
        }}
        className="fixed left-1/2 -translate-x-1/2 z-50 border glass-mist max-w-6xl shadow-sm overflow-hidden"
      >
        <div className="container flex h-16 items-center justify-between px-3 md:px-8 mx-auto">
          <div className="flex items-center font-bold">
            <span className="font-display tracking-tight text-primary text-lg md:text-2xl">
              <span className="hidden sm:inline">Open Algorithms</span>
              <span className="sm:inline hidden absolute text-transparent">OA</span> {/* Accessible hide */}
              <span className="sm:hidden" aria-hidden="true">OA</span>
            </span>
          </div>

          <nav className="flex items-center gap-3 sm:gap-8 text-xs sm:text-base font-medium">
            <Link to="/algorithms/bubble-sort" className="text-primary/80 hover:text-primary transition-colors">Sorting</Link>
            <Link to="/algorithms/binary-search" className="text-primary/80 hover:text-primary transition-colors">Searching</Link>
            <Link to="/algorithms/bfs" className="text-primary/80 hover:text-primary transition-colors">Graphs</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {!isAuthenticated && (
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="neumorphic-button border-0 hover:bg-transparent rounded-full px-4 text-primary font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
            )}
            {isAuthenticated && user && (
              <span className="hidden sm:block text-xs font-medium text-muted-foreground">
                Hi, {user.displayName?.split(" ")[0] ?? "there"} 👋
              </span>
            )}
            <LogoDropdown />
          </div>
        </div>
      </motion.header>

      <main className="flex-1 pt-24 md:pt-16">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 md:px-8 text-center space-y-8 max-w-5xl mx-auto relative z-10">
          <motion.div
            style={{ y: heroTextY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.1] text-primary">
              Watch Code <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-mist italic font-display">
                Come Alive
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
              Transform abstract concepts into crystal-clear visual journeys. Dive into the mechanics of algorithms with interactive, real-time control. Master logic, one visual step at a time.
            </p>
          </motion.div>

          <motion.div
            style={{ y: heroButtonsY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-lg btn-primary-slate cursor-pointer"
              onClick={handleVisualizerClick}
            >
              {isAuthenticated ? "Launch Visualizer" : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-32 relative z-20"
        >
          <div className="container px-4 md:px-8 mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">Unleash Core Concepts</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Equip yourself with the fundamental building blocks of modern software. Explore our curated interactive playgrounds designed for rapid technical mastery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8 text-primary" />}
                title="Sorting"
                description="Watch chaos turn into order. Dissect the inner workings of Bubble, Merge, and Quick sort through high-fidelity animations."
                link="/algorithms/bubble-sort"
                delay={0.2}
              />
              <FeatureCard
                icon={<Search className="h-8 w-8 text-primary" />}
                title="Searching"
                description="Navigate the noise. Experience how intelligent algorithms relentlessly hunt down targets using optimal search methodologies."
                link="/algorithms/linear-search"
                delay={0.3}
              />
              <FeatureCard
                icon={<Network className="h-8 w-8 text-primary" />}
                title="Graph Traversal"
                description="Map the unknown. Witness nodes connect and networks unfold in real-time as you command deep and broad traversal engines."
                link="/algorithms/bfs"
                delay={0.4}
              />
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-32 container px-4 md:px-8 mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-primary">Your Path to Mastery</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We engineered an environment that strips away complexity. You aren't just a spectator; you dictate the pace, manipulate the inputs, and directly observe the mechanical elegance of computation.
              </p>

              <div className="space-y-6">
                <StepItem
                  number="01"
                  title="Isolate the Mechanism"
                  description="Handpick from an elite arsenal of industry-standard sorting, searching, and graph-traversal architectures."
                />
                <StepItem
                  number="02"
                  title="Inject the Payload"
                  description="Deploy curated datasets or inject your own extreme edge cases to push the algorithm's boundaries to the absolute limit."
                />
                <StepItem
                  number="03"
                  title="Take Command"
                  description="Dictate the timeline. Play, pause, micro-step, and accelerate execution speed to forge profound neurological connections."
                />
              </div>
            </div>
            <div className="flex-1 relative w-full mt-12 md:mt-0">
              <motion.div
                style={{ y: howItWorksCardY }}
                className="neumorphic-card p-8 w-full max-w-md mx-auto aspect-square flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-8 w-3/4 neumorphic-inset rounded-full" />
                  <div className="h-32 neumorphic-inset rounded-2xl" />
                  <div className="flex gap-4">
                    <div className="h-10 w-24 neumorphic-inset rounded-full" />
                    <div className="h-10 w-10 neumorphic-inset rounded-full" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-32 container px-4 md:px-8 mx-auto text-center"
        >
          <div className="max-w-3xl mx-auto space-y-8 neumorphic-card p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Ready to Think Like a Machine?</h2>
            <p className="text-xl text-muted-foreground">
              Join the elite tier of developers leveraging Open Algorithms to dissect, understand, and dominate intricate computational paradigms.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-14 px-10 text-lg btn-primary-slate cursor-pointer"
                onClick={handleVisualizerClick}
              >
                {isAuthenticated ? "Initialize System" : "Sign In to Start"}
              </Button>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="py-12 border-t border-border bg-background">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-display font-bold text-xl text-primary">Open Algorithms</span>
            <p className="text-sm text-muted-foreground">
              © 2025 Open Algorithms. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, link, delay }: { icon: React.ReactNode, title: string, description: string, link: string, delay: number }) {
  return (
    <Link to={link} className="group block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="neumorphic-card p-8 h-full flex flex-col hover:scale-[1.02] active:scale-95"
      >
        <div className="mb-6 p-4 neumorphic-inset rounded-full w-fit">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 font-display text-primary">{title}</h3>
        <p className="text-muted-foreground leading-relaxed flex-1 font-body">
          {description}
        </p>
        <div className="mt-6 flex items-center text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
          Explore <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </motion.div>
    </Link>
  );
}

function StepItem({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="neumorphic-inset w-16 h-16 rounded-full flex items-center justify-center shrink-0">
        <span className="font-display text-xl font-bold text-primary">{number}</span>
      </div>
      <div className="pt-2">
        <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
        <p className="text-muted-foreground font-body">{description}</p>
      </div>
    </div>
  );
}