import { useParams } from "react-router";
import { AppSidebar, MobileSidebarDrawer } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, StepForward, Info, Moon, Sun, CheckCircle2, XCircle, Lightbulb, Clock, HardDrive, Code2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { sortingAlgorithms, searchingAlgorithms, graphAlgorithms } from "@/lib/algorithms";
import { defaultGraph } from "@/lib/algorithms/graph";
import { motion, AnimatePresence } from "framer-motion";
import { algorithms, type Algorithm } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Check } from "lucide-react";
import { codeSnippets } from "@/lib/codeSnippets";
import { toast } from "sonner";

const ML_CATEGORIES = [
  "regression", "classification", "clustering",
  "dimensionality-reduction", "association-rule",
  "semi-supervised", "reinforcement-learning", "deep-learning"
];

const CATEGORY_LABELS: Record<string, string> = {
  regression: "Supervised · Regression",
  classification: "Supervised · Classification",
  clustering: "Unsupervised · Clustering",
  "dimensionality-reduction": "Unsupervised · Dimensionality Reduction",
  "association-rule": "Unsupervised · Association Rule Learning",
  "semi-supervised": "Semi-Supervised Learning",
  "reinforcement-learning": "Reinforcement Learning",
  "deep-learning": "Deep Learning",
};


export default function AlgorithmPage() {
  const { slug } = useParams();
  const algorithm = algorithms.find(a => a.slug === slug);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  const [isCodeView, setIsCodeView] = useState(false);

  // Lifted State
  const [array, setArray] = useState<number[]>([]);
  const [inputStr, setInputStr] = useState("");
  const [target, setTarget] = useState<number>(0);
  const [graph, setGraph] = useState(defaultGraph);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ── Dynamic SEO per algorithm page ──────────────────────────────────────
  useEffect(() => {
    if (!algorithm) return;
    // Set page title
    document.title = `${algorithm.name} - Open Algorithms`;
    // Set meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `${algorithm.description} Time complexity: ${algorithm.complexity.time}. Space complexity: ${algorithm.complexity.space}. Interactive visualization on Open Algorithms.`;
    return () => {
      // Restore defaults when leaving
      document.title = "Open Algorithms";
    };
  }, [algorithm]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // Helper to reset data based on algorithm type
  const resetData = () => {
    if (!algorithm) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (algorithm.category === "sorting") {
      const newArray = Array.from({ length: isMobile ? 14 : 24 }, () => Math.floor(Math.random() * 90) + 10);
      setArray(newArray);
      setInputStr(newArray.join(", "));
    } else if (algorithm.category === "searching") {
      const newArray = Array.from({ length: isMobile ? 10 : 16 }, () => Math.floor(Math.random() * 99) + 1);
      if (algorithm.slug === "binary-search") {
        newArray.sort((a, b) => a - b);
      }
      setArray(newArray);
      setInputStr(newArray.join(", "));
      setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    } else if (algorithm.category === "graph") {
      setGraph(defaultGraph);
    }
    // ML categories: no data to reset
  };

  // Reset on slug change
  useEffect(() => {
    resetData();
    setIsCodeView(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!algorithm) {
    return (
      <div className="flex h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="font-serif text-xl text-muted-foreground">Loading algorithm...</div>
          </div>
        </div>
      </div>
    );
  }

  // Derived data for CodeView
  const vizData = {
    array,
    target,
    graph,
    visited: [] // This will be populated by the visualizer if we could, but for now we pass basics
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <AppSidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

        {/* ── Header ── */}
        <header className="border-b border-border/40 flex items-center px-4 md:px-8 justify-between bg-background/80 backdrop-blur-md z-10 sticky top-0 min-h-[56px] md:h-20 py-2 md:py-0 gap-3">
          {/* Left: hamburger (mobile) + title */}
          <div className="flex items-center gap-3 min-w-0">
            <MobileSidebarDrawer />
            <div className="min-w-0">
              <h1 className="text-lg md:text-3xl font-serif font-bold tracking-tight text-foreground leading-tight truncate">{algorithm.name}</h1>
              <p className="hidden sm:block text-xs md:text-sm text-muted-foreground max-w-sm md:max-w-xl line-clamp-1">{algorithm.description}</p>
            </div>
          </div>

          {/* Right: complexity (desktop only) + code toggle + theme */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="hidden sm:flex gap-3 md:gap-6 text-sm text-muted-foreground">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-semibold mb-0.5">Time</span>
                <Badge variant="secondary" className="font-mono font-bold text-foreground bg-secondary/50 text-xs">
                  {algorithm.complexity.time}
                </Badge>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-semibold mb-0.5">Space</span>
                <Badge variant="secondary" className="font-mono font-bold text-foreground bg-secondary/50 text-xs">
                  {algorithm.complexity.space}
                </Badge>
              </div>
            </div>
            <div className="hidden sm:block h-6 w-px bg-border/50" />
            {/* Code/Visualize toggle – icon only on mobile */}
            <Button
              variant={isCodeView ? "default" : "outline"}
              size="sm"
              onClick={() => setIsCodeView(!isCodeView)}
              className="rounded-full px-2 sm:px-4"
              aria-label={isCodeView ? "Visualize" : "Code"}
            >
              <Code2 className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5">{isCodeView ? "Visualize" : "Code"}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-8 w-8 md:h-9 md:w-9">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <div className="flex-1 p-3 md:p-8 overflow-hidden flex flex-col">
          <div className="flex-1 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {isCodeView ? (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <CodeView slug={algorithm.slug} data={vizData} />
                </motion.div>
              ) : (
                <motion.div
                  key="visualizer"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  {algorithm.category === "sorting" ? (
                    <SortingVisualizer
                      slug={algorithm.slug}
                      array={array}
                      setArray={setArray}
                      inputStr={inputStr}
                      setInputStr={setInputStr}
                      onReset={resetData}
                    />
                  ) : algorithm.category === "searching" ? (
                    <SearchingVisualizer
                      slug={algorithm.slug}
                      array={array}
                      setArray={setArray}
                      inputStr={inputStr}
                      setInputStr={setInputStr}
                      target={target}
                      setTarget={setTarget}
                      onReset={resetData}
                    />
                  ) : algorithm.category === "graph" ? (
                    <GraphVisualizer
                      slug={algorithm.slug}
                      graph={graph}
                      setGraph={setGraph}
                      onReset={resetData}
                    />
                  ) : (
                    <MLInfoVisualizer algorithm={algorithm} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

// -----------------------------------------------------------------------------------------
// Visualizer Components (Updated to function props)
// -----------------------------------------------------------------------------------------

interface SortingProps {
  slug: string;
  array: number[];
  setArray: (arr: number[]) => void;
  inputStr: string;
  setInputStr: (s: string) => void;
  onReset: () => void;
}

function SortingVisualizer({ slug, array, setArray, inputStr, setInputStr, onReset }: SortingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [stepDescription, setStepDescription] = useState("Ready to start");
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [compareIndices, setCompareIndices] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generatorRef = useRef<Generator<any> | null>(null);
  const timerRef = useRef<number | null>(null);

  // Internal reset for animation state only
  const resetAnimationState = () => {
    setSortedIndices([]);
    setActiveIndices([]);
    setCompareIndices([]);
    setStepDescription("Ready to start");
    setIsPlaying(false);
    generatorRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const fullReset = () => {
    resetAnimationState();
    onReset();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputStr(e.target.value);
    const values = e.target.value.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (values.length > 0) {
      setArray(values);
      resetAnimationState();
      setStepDescription("Custom array loaded");
    }
  };

  // Re-initialize generator if array changes and we are not playing? 
  // actually usually we want to stop if array changes externally
  useEffect(() => {
    // If slug changes, we might want to reset, but parent handles that?
    // Parent calls onReset when slug changes.
  }, [slug]);

  const step = () => {
    if (!generatorRef.current) {
      const algoFunc = sortingAlgorithms[slug as keyof typeof sortingAlgorithms];
      if (algoFunc) {
        generatorRef.current = algoFunc([...array]); // Pass copy to avoid direct mutation issues in generator
      } else {
        return;
      }
    }

    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsPlaying(false);
      setStepDescription("Sorted!");
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (value) {
      if (value.array) setArray(value.array);
      if (value.description) setStepDescription(value.description);

      setActiveIndices([]);
      setCompareIndices([]);

      if (value.type === "compare") {
        setCompareIndices(value.indices);
      } else if (value.type === "swap" || value.type === "overwrite") {
        setActiveIndices(value.indices);
      } else if (value.type === "sorted") {
        setSortedIndices(prev => [...prev, ...value.indices]);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(step, 1000 - (speed * 9));
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed, array]); // Array dependency might cause loops if not careful

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-end justify-center px-3 md:p-8 gap-0.5 md:gap-1.5 relative overflow-hidden">
        <div className="absolute top-3 md:top-6 left-3 md:left-6 flex items-center gap-2">
          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm text-xs">Visualization</Badge>
        </div>
        <AnimatePresence>
          {array.map((value, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: `${Math.max(value, 5)}%`,
                backgroundColor: sortedIndices.includes(idx)
                  ? "var(--primary)"
                  : compareIndices.includes(idx)
                    ? "var(--destructive)"
                    : activeIndices.includes(idx)
                      ? "var(--chart-2)"
                      : "var(--secondary-foreground)",
                opacity: sortedIndices.includes(idx) ? 1 : 0.7
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-[16px] md:max-w-[32px] rounded-t-sm md:rounded-t-md shadow-sm"
            >
              <div className="hidden md:block text-[10px] text-center -mt-5 font-mono font-bold text-background/80 mix-blend-difference">{value}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls panel */}
      <div className="bg-background/50 border-t border-border/50 p-3 md:p-6 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col gap-3 md:gap-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Playback + speed row */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-full border border-border/50">
                <Button variant="ghost" size="icon" onClick={fullReset} className="rounded-full hover:bg-background hover:shadow-sm transition-all h-9 w-9">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md h-10 w-10"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={step} disabled={isPlaying} className="rounded-full hover:bg-background hover:shadow-sm transition-all h-9 w-9">
                  <StepForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
                <div className="flex justify-between text-[10px] md:text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  <span>Speed</span>
                  <span>{speed}%</span>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={(v) => setSpeed(v[0])}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Step description */}
            <div className="flex-1 flex items-center gap-3 bg-secondary/30 p-2.5 md:p-3 rounded-xl border border-border/50 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Info className="h-3.5 w-3.5" />
              </div>
              <div className="font-mono text-xs md:text-sm text-muted-foreground truncate">
                <span className="text-foreground font-bold mr-1.5">{">"}</span>
                {stepDescription}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Input</span>
            <Input
              value={inputStr}
              onChange={handleInputChange}
              placeholder="10, 20, 5, 3..."
              className="font-mono text-xs md:text-sm rounded-lg border-border/50 bg-background/50 focus:bg-background transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SearchingProps {
  slug: string;
  array: number[];
  setArray: (arr: number[]) => void;
  inputStr: string;
  setInputStr: (s: string) => void;
  target: number;
  setTarget: (t: number) => void;
  onReset: () => void;
}

function SearchingVisualizer({ slug, array, setArray, inputStr, setInputStr, target, setTarget, onReset }: SearchingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [stepDescription, setStepDescription] = useState("Ready to start");
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generatorRef = useRef<Generator<any> | null>(null);
  const timerRef = useRef<number | null>(null);

  const resetAnimationState = () => {
    setActiveIndices([]);
    setFoundIndex(null);
    setStepDescription("Ready to start");
    setIsPlaying(false);
    generatorRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const fullReset = () => {
    resetAnimationState();
    onReset();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputStr(e.target.value);
    const values = e.target.value.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (values.length > 0) {
      if (slug === "binary-search") {
        values.sort((a, b) => a - b);
      }
      setArray(values);
      resetAnimationState();
      setStepDescription("Custom array loaded");
    }
  };

  const step = () => {
    if (!generatorRef.current) {
      const algoFunc = searchingAlgorithms[slug as keyof typeof searchingAlgorithms];
      if (algoFunc) {
        generatorRef.current = algoFunc(array, target);
      } else {
        return;
      }
    }

    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (value) {
      if (value.description) setStepDescription(value.description);

      setActiveIndices([]);

      if (value.type === "compare") {
        setActiveIndices(value.indices);
      } else if (value.type === "found") {
        setFoundIndex(value.indices[0]);
        setStepDescription(`Found ${target} at index ${value.indices[0]}!`);
        setIsPlaying(false);
      } else if (value.type === "not-found") {
        setStepDescription(`${target} not found.`);
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(step, 1000 - (speed * 9));
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="absolute top-3 md:top-6 left-3 md:left-6 flex items-center gap-2">
          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm text-xs">Memory View</Badge>
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center gap-6 md:gap-12">
          <div className="flex flex-col items-center gap-2 md:gap-4">
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground">Target Value</div>
            <div className="text-4xl md:text-6xl font-serif font-bold px-5 md:px-8 py-3 md:py-4 rounded-2xl bg-accent/10 border-2 border-accent text-accent animate-in zoom-in duration-500 shadow-lg">
              {target}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
            {array.map((value, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: activeIndices.includes(idx) || foundIndex === idx ? 1.1 : 1,
                  opacity: 1,
                  backgroundColor: foundIndex === idx
                    ? "oklch(0.6 0.15 145)"
                    : activeIndices.includes(idx)
                      ? "oklch(0.5 0.2 250)"
                      : "var(--secondary)",
                  color: foundIndex === idx || activeIndices.includes(idx)
                    ? "oklch(0.99 0.01 240)"
                    : "var(--foreground)",
                  borderColor: activeIndices.includes(idx) ? "oklch(0.5 0.2 250)" : "var(--border)",
                  borderWidth: activeIndices.includes(idx) ? "2px" : "1px"
                }}
                className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center text-sm md:text-lg font-bold font-mono shadow-sm border transition-colors relative group cursor-default"
              >
                {value}
                <div className="absolute -bottom-5 text-[9px] text-muted-foreground font-sans opacity-0 group-hover:opacity-100 transition-opacity">{idx}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-background/50 border-t border-border/50 p-3 md:p-6 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col gap-3 md:gap-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-full border border-border/50">
                <Button variant="ghost" size="icon" onClick={fullReset} className="rounded-full hover:bg-background hover:shadow-sm transition-all h-9 w-9">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md h-10 w-10"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={step} disabled={isPlaying} className="rounded-full hover:bg-background hover:shadow-sm transition-all h-9 w-9">
                  <StepForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
                <div className="flex justify-between text-[10px] md:text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  <span>Speed</span>
                  <span>{speed}%</span>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={(v) => setSpeed(v[0])}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 bg-secondary/30 p-2.5 md:p-3 rounded-xl border border-border/50 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Info className="h-3.5 w-3.5" />
              </div>
              <div className="font-mono text-xs md:text-sm text-muted-foreground truncate">
                <span className="text-foreground font-bold mr-1.5">{">"}</span>
                {stepDescription}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap w-14">Array</span>
              <Input
                value={inputStr}
                onChange={handleInputChange}
                placeholder="10, 20, 5..."
                className="font-mono text-xs md:text-sm rounded-lg border-border/50 bg-background/50 focus:bg-background transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap w-14">Target</span>
              <Input
                type="number"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="font-mono text-xs md:text-sm rounded-lg border-border/50 bg-background/50 focus:bg-background transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GraphProps {
  slug: string;
  graph: number[][];
  setGraph: (g: number[][]) => void;
  onReset: () => void;
}

function GraphVisualizer({ slug, graph, onReset }: GraphProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [graph, setGraph] = useState(defaultGraph); // NOW USING PROP

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [stepDescription, setStepDescription] = useState("Ready to start");
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [queueNodes, setQueueNodes] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generatorRef = useRef<Generator<any> | null>(null);
  const timerRef = useRef<number | null>(null);

  // Fixed positions for 6 nodes in a circle
  const nodePositions = [
    { x: 50, y: 15 },
    { x: 85, y: 35 },
    { x: 85, y: 75 },
    { x: 50, y: 95 },
    { x: 15, y: 75 },
    { x: 15, y: 35 },
  ];

  const resetAnimationState = () => {
    setVisitedNodes([]);
    setActiveNode(null);
    setQueueNodes([]);
    setStepDescription("Ready to start");
    setIsPlaying(false);
    generatorRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const fullReset = () => {
    resetAnimationState();
    onReset();
  };

  useEffect(() => {
    resetAnimationState();
  }, [slug]);

  const step = () => {
    if (!generatorRef.current) {
      const algoFunc = graphAlgorithms[slug as keyof typeof graphAlgorithms];
      if (algoFunc) {
        generatorRef.current = algoFunc(graph, 0); // Start from node 0
      } else {
        return;
      }
    }

    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsPlaying(false);
      setStepDescription("Traversal Complete!");
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (value) {
      if (value.description) setStepDescription(value.description);

      if (value.type === "visit") {
        setActiveNode(value.node);
        setVisitedNodes(prev => [...new Set([...prev, value.node])]);
        setQueueNodes(prev => prev.filter(n => n !== value.node));
      } else if (value.type === "explore") {
        setActiveNode(value.node);
      } else if (value.type === "queue") {
        setQueueNodes(prev => [...new Set([...prev, value.node])]);
      } else if (value.type === "finished") {
        // setActiveNode(null); 
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(step, 1000 - (speed * 9));
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center p-3 md:p-8 relative overflow-hidden">
        <div className="absolute top-3 md:top-6 left-3 md:left-6 flex items-center gap-2">
          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm text-xs">Graph Topology</Badge>
        </div>

        <div className="relative w-full h-full max-w-2xl max-h-[260px] md:max-h-[500px]">
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {graph.map((neighbors, fromNode) =>
              neighbors.map(toNode => (
                <motion.line
                  key={`${fromNode}-${toNode}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1 }}
                  x1={`${nodePositions[fromNode].x}%`}
                  y1={`${nodePositions[fromNode].y}%`}
                  x2={`${nodePositions[toNode].x}%`}
                  y2={`${nodePositions[toNode].y}%`}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-border"
                />
              ))
            )}
          </svg>

          {/* Nodes */}
          {nodePositions.map((pos, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{
                scale: activeNode === idx ? 1.2 : 1,
                backgroundColor: activeNode === idx
                  ? "var(--primary)"
                  : visitedNodes.includes(idx)
                    ? "var(--secondary)"
                    : queueNodes.includes(idx)
                      ? "var(--background)"
                      : "var(--background)",
                color: activeNode === idx
                  ? "var(--primary-foreground)"
                  : visitedNodes.includes(idx)
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                borderColor: activeNode === idx
                  ? "var(--primary)"
                  : visitedNodes.includes(idx)
                    ? "var(--border)"
                    : queueNodes.includes(idx)
                      ? "var(--primary)"
                      : "var(--border)",
                borderStyle: queueNodes.includes(idx) && !visitedNodes.includes(idx) ? "dashed" : "solid"
              }}
              className="absolute w-10 h-10 md:w-16 md:h-16 -ml-5 -mt-5 md:-ml-8 md:-mt-8 rounded-full flex items-center justify-center font-bold border-2 z-10 shadow-lg transition-all duration-300 font-mono text-sm md:text-xl cursor-pointer hover:scale-110"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {idx}
              {activeNode === idx && (
                <motion.div
                  layoutId="active-ring"
                  className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-background/50 border-t border-border/50 p-3 md:p-6 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col gap-3 md:gap-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-full border border-border/50">
                <Button variant="ghost" size="icon" onClick={fullReset} className="rounded-full hover:bg-background hover:shadow-sm transition-all h-9 w-9">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md h-10 w-10"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={step} disabled={isPlaying} className="rounded-full hover:bg-background hover:shadow-sm transition-all h-9 w-9">
                  <StepForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
                <div className="flex justify-between text-[10px] md:text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  <span>Speed</span>
                  <span>{speed}%</span>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={(v) => setSpeed(v[0])}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 bg-secondary/30 p-2.5 md:p-3 rounded-xl border border-border/50 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Info className="h-3.5 w-3.5" />
              </div>
              <div className="font-mono text-xs md:text-sm text-muted-foreground truncate">
                <span className="text-foreground font-bold mr-1.5">{">"}</span>
                {stepDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeView({ slug, data }: { slug: string, data: any }) {
  const snippetGenerator = codeSnippets[slug as keyof typeof codeSnippets];
  const snippets = snippetGenerator ? snippetGenerator(data) : null;
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("c");

  if (!snippets) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground p-6 bg-card/50 backdrop-blur-md rounded-xl border border-border/50">
        Code snippets not available for this algorithm.
      </div>
    );
  }

  const handleCopy = () => {
    const code = snippets[activeTab as keyof typeof snippets];
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!", { className: "font-serif" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-md p-6 overflow-hidden">
      <Tabs defaultValue="c" className="flex flex-col h-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-secondary/50 border border-border/50">
            <TabsTrigger value="c" className="px-4 font-mono font-bold">C</TabsTrigger>
            <TabsTrigger value="java" className="px-4 font-mono font-bold">Java</TabsTrigger>
            <TabsTrigger value="python" className="px-4 font-mono font-bold">Python</TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-secondary/30 hover:bg-secondary/50 border-border/50"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Code"}
          </Button>
        </div>

        <div className="flex-1 bg-card border border-border/50 rounded-xl overflow-hidden relative group">
          <TabsContent value="c" className="h-full m-0 p-0">
            <ScrollAreaCode code={snippets.c} language="c" />
          </TabsContent>
          <TabsContent value="java" className="h-full m-0 p-0">
            <ScrollAreaCode code={snippets.java} language="java" />
          </TabsContent>
          <TabsContent value="python" className="h-full m-0 p-0">
            <ScrollAreaCode code={snippets.python} language="python" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function ScrollAreaCode({ code, language }: { code: string; language: string }) {
  return (
    <div className="h-full overflow-auto custom-scrollbar p-6 font-mono text-sm leading-relaxed">
      <pre className="text-foreground/90">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

// ─── ML Info Visualizer ───────────────────────────────────────────────────────

function MLInfoVisualizer({ algorithm }: { algorithm: Algorithm }) {
  const categoryLabel = CATEGORY_LABELS[algorithm.category] ?? algorithm.category;

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <Badge className="text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15">
            {categoryLabel}
          </Badge>
          <h2 className="text-3xl font-serif font-bold">{algorithm.name}</h2>
          <p className="text-muted-foreground leading-relaxed text-base">{algorithm.description}</p>
        </motion.div>

        {/* Complexity Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-card border border-border/60 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Time Complexity</p>
              <p className="font-mono text-lg font-bold text-foreground">{algorithm.complexity.time}</p>
            </div>
          </div>
          <div className="bg-card border border-border/60 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <HardDrive className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Space Complexity</p>
              <p className="font-mono text-lg font-bold text-foreground">{algorithm.complexity.space}</p>
            </div>
          </div>
        </motion.div>

        {/* Use Cases */}
        {algorithm.useCases && algorithm.useCases.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card border border-border/60 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
              </div>
              <h3 className="font-bold text-base">Common Use Cases</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {algorithm.useCases.map((uc) => (
                <span
                  key={uc}
                  className="px-3 py-1.5 text-sm bg-secondary/60 border border-border/50 rounded-full text-foreground/80 font-medium"
                >
                  {uc}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pros & Cons */}
        {(algorithm.pros || algorithm.cons) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {algorithm.pros && (
              <div className="bg-card border border-green-500/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <h3 className="font-bold text-base text-green-600 dark:text-green-400">Advantages</h3>
                </div>
                <ul className="space-y-2.5">
                  {algorithm.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {algorithm.cons && (
              <div className="bg-card border border-red-500/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                  <h3 className="font-bold text-base text-red-600 dark:text-red-400">Limitations</h3>
                </div>
                <ul className="space-y-2.5">
                  {algorithm.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}