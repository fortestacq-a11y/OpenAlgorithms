
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Search,
  Home,
  ChevronDown,
  ChevronRight,
  Network,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { algorithms } from "@/lib/data";

function SidebarSection({
  label,
  icon,
  category,
  defaultOpen = false,
}: {
  label: string;
  icon: React.ReactNode;
  category: string;
  defaultOpen?: boolean;
}) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const algos = algorithms.filter((a) => a.category === category);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between font-serif font-bold text-sm hover:bg-sidebar-accent/50 rounded-lg px-3 text-foreground/80 hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            {icon}
            {label}
          </span>
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 pl-2 pt-0.5">
        {algos.map((algo) => (
          <Link key={algo.slug} to={`/algorithms/${algo.slug}`}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-8 text-xs font-medium rounded-md pl-8 transition-all duration-200",
                location.pathname === `/algorithms/${algo.slug}`
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {algo.name}
            </Button>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AppSidebar() {
  return (
    <div className="w-72 border-r border-border bg-sidebar/50 backdrop-blur-xl h-screen flex flex-col sticky top-0 text-sidebar-foreground transition-colors duration-300 z-40">
      <div className="p-6 border-b border-border/50">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://harmless-tapir-303.convex.cloud/api/storage/bcd7fca8-acbb-499c-8dac-8531f807a2bf"
            alt="OA Logo"
            className="w-8 h-8 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300 object-cover"
          />
          <span className="font-serif font-bold text-lg tracking-tight group-hover:opacity-80 transition-opacity">
            Open Algorithms
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-5">

          {/* ── Classic DSA ── */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
              Classic DSA
            </p>
            <SidebarSection label="Sorting" icon={<BarChart3 className="h-4 w-4 opacity-70" />} category="sorting" defaultOpen={true} />
            <SidebarSection label="Searching" icon={<Search className="h-4 w-4 opacity-70" />} category="searching" defaultOpen={true} />
            <SidebarSection label="Graph" icon={<Network className="h-4 w-4 opacity-70" />} category="graph" defaultOpen={true} />
          </div>



        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50 bg-sidebar/50 backdrop-blur-sm">
        <Link to="/">
          <Button
            variant="outline"
            className="w-full justify-start h-10 text-sm font-medium rounded-lg border-border/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all shadow-sm"
          >
            <Home className="mr-3 h-4 w-4 opacity-70" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}