import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowRight, BarChart3, Search, Network, Moon, Sun, Brain } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation";
import { useState, useEffect } from "react";

export default function Landing() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });
  const { scrollY } = useScroll();

  // Parallax transforms
  const heroTextY = useTransform(scrollY, [0, 500], [0, 150]); // Move text down slower
  const heroButtonsY = useTransform(scrollY, [0, 500], [0, -50]); // Move buttons up slightly to separate
  const backgroundShape1Y = useTransform(scrollY, [0, 1000], [0, 300]); // Background shape parallax
  const backgroundShape2Y = useTransform(scrollY, [0, 1000], [0, -200]); // Background shape parallax

  // Navbar animation logic - Made faster by reducing scroll range from 100 to 50
  const navWidth = useSpring(useTransform(scrollY, [0, 50], ["100%", "80%"]), { stiffness: 100, damping: 20 });
  const navTop = useSpring(useTransform(scrollY, [0, 50], ["0px", "20px"]), { stiffness: 100, damping: 20 });
  const navRadius = useSpring(useTransform(scrollY, [0, 50], ["0px", "100px"]), { stiffness: 100, damping: 20 });
  const navBorder = useTransform(scrollY, [0, 50], ["rgba(0,0,0,0)", "var(--border)"]);
  const navBackdrop = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const navBackground = useTransform(scrollY, [0, 50], ["rgba(0,0,0,0)", "var(--background)"]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden transition-colors duration-500">
      <LiquidEffectAnimation theme={theme} />

      {/* Parallax Background Shapes */}
      <motion.div
        style={{ y: backgroundShape1Y, opacity: 0.1 }}
        className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl -z-10"
      />
      <motion.div
        style={{ y: backgroundShape2Y, opacity: 0.1 }}
        className="absolute top-96 right-10 w-96 h-96 bg-accent rounded-full blur-3xl -z-10"
      />

      {/* Animated Navbar */}
      <motion.header
        style={{
          width: navWidth,
          top: navTop,
          borderRadius: navRadius,
          borderColor: navBorder,
          backdropFilter: navBackdrop,
          backgroundColor: navBackground
        }}
        className="fixed left-1/2 -translate-x-1/2 z-50 border border-transparent transition-all duration-300"
      >
        <div className="container flex h-16 items-center justify-between px-6 md:px-8 mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl">
            <img src="https://harmless-tapir-303.convex.cloud/api/storage/bcd7fca8-acbb-499c-8dac-8531f807a2bf" alt="OA Logo" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-serif tracking-tight hidden sm:inline-block">Open Algorithms</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-base font-medium">
            <Link to="/algorithms/bubble-sort" className="relative group py-1">
              <span>Sorting</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/algorithms/binary-search" className="relative group py-1">
              <span>Searching</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/algorithms/bfs" className="relative group py-1">
              <span>Graphs</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/algorithms/linear-regression" className="relative group py-1">
              <span>ML / AI</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 md:px-8 text-center space-y-8 max-w-5xl mx-auto relative z-10">
          <motion.div
            style={{ y: heroTextY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.1]">
              Visualize the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic font-serif">
                Invisible Logic
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Master data structures and algorithms through interactive, step-by-step visualizations. Designed for clarity. Built for understanding.
            </p>
          </motion.div>

          <motion.div
            style={{ y: heroButtonsY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/algorithms/bubble-sort">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90">
                Start Visualizing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-32 bg-secondary/30 border-y border-border/50 backdrop-blur-sm relative z-20"
        >
          <div className="container px-4 md:px-8 mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Explore Categories</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Dive deep into the core concepts of computer science with our comprehensive suite of visualizers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8" />}
                title="Sorting"
                description="Visualize Bubble, Merge, Quick sort and more. Understand how data is organized step-by-step."
                link="/algorithms/bubble-sort"
                delay={0.2}
              />
              <FeatureCard
                icon={<Search className="h-8 w-8" />}
                title="Searching"
                description="See how Linear and Binary search traverse data structures to find what you need efficiently."
                link="/algorithms/linear-search"
                delay={0.3}
              />
              <FeatureCard
                icon={<Network className="h-8 w-8" />}
                title="Graph Traversal"
                description="Explore BFS and DFS traversals on interactive graphs. Watch nodes connect and explore."
                link="/algorithms/bfs"
                delay={0.4}
              />
              <FeatureCard
                icon={<Brain className="h-8 w-8" />}
                title="Machine Learning"
                description="Explore 60+ ML algorithms across Supervised, Unsupervised, Reinforcement, and Deep Learning."
                link="/algorithms/linear-regression"
                delay={0.5}
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
              <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform breaks down complex algorithms into digestible steps. You don't just watch; you interact, control, and understand the underlying logic.
              </p>

              <div className="space-y-6">
                <StepItem
                  number="01"
                  title="Select an Algorithm"
                  description="Choose from our extensive library of sorting, searching, and graph algorithms."
                />
                <StepItem
                  number="02"
                  title="Input Your Data"
                  description="Use default datasets or input your own custom values to see how the algorithm handles edge cases."
                />
                <StepItem
                  number="03"
                  title="Control the Flow"
                  description="Play, pause, step forward, and adjust speed to learn at your own pace."
                />
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-3xl blur-3xl -z-10" />
              <motion.div
                style={{ y: useTransform(scrollY, [0, 1500], [0, 100]) }}
                className="bg-card border border-border rounded-3xl p-8 shadow-2xl"
              >
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-secondary rounded animate-pulse" />
                  <div className="h-32 bg-secondary/50 rounded animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-10 w-24 bg-primary/20 rounded animate-pulse" />
                    <div className="h-10 w-10 bg-secondary rounded animate-pulse" />
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
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">Ready to Master Algorithms?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of developers who use Open Algorithms to visualize and understand complex logic.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/algorithms/bubble-sort">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="py-12 border-t border-border bg-background">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl">
                <img src="https://harmless-tapir-303.convex.cloud/api/storage/bcd7fca8-acbb-499c-8dac-8531f807a2bf" alt="OA Logo" className="h-8 w-8 rounded-lg object-cover" />
                <span className="font-serif">Open Algorithms</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Visualizing the invisible logic of computer science.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/algorithms/bubble-sort" className="hover:text-foreground transition-colors">Sorting</Link></li>
                <li><Link to="/algorithms/binary-search" className="hover:text-foreground transition-colors">Searching</Link></li>
                <li><Link to="/algorithms/bfs" className="hover:text-foreground transition-colors">Graphs</Link></li>
                <li><Link to="/algorithms/linear-regression" className="hover:text-foreground transition-colors">ML / AI</Link></li>
                <li><Link to="/algorithms/ann" className="hover:text-foreground transition-colors">Deep Learning</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">API</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
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
        className="bg-card border border-border p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:border-primary/20 h-full flex flex-col"
      >
        <div className="mb-6 p-4 bg-secondary rounded-2xl w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 font-serif">{title}</h3>
        <p className="text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>
        <div className="mt-6 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
          Explore <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </motion.div>
    </Link>
  );
}

function StepItem({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-6">
      <div className="font-serif text-4xl font-bold text-primary/20">{number}</div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}