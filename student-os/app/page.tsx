"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PlannerPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (data.success) {
        // Persist to session/local storage for the dashboard to pick up
        // In a real app, this would route to a persistent ID or DB
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("student-os-plan", JSON.stringify(data.data));
        }
        router.push("/dashboard");
      } else {
        alert("Planning failed: " + data.error);
      }
    } catch (e: any) {
      alert("System error: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-background selection:bg-primary/20">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50">
            Student OS
          </h1>
          <p className="text-muted-foreground text-lg">
            Describe your semester. Connect your intelligence.
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Example: I'm taking Algorithms (CS301), Linear Algebra, and a Design Seminar. Midterms are mostly late March..."
            className="min-h-[200px] text-lg p-6 bg-secondary/10 border-white/5 focus:border-white/10 transition-all font-light"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />

          <Button
            onClick={handleGenerate}
            className="w-full h-12 text-md font-semibold tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
                Architecting Semester...
              </span>
            ) : (
              "Generate Plan"
            )}
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground/30 font-mono">
          v1.0 • System Secure
        </div>
      </div>
    </main>
  );
}
