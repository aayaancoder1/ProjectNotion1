"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Course {
  id: string;
  name: string;
  credits: number;
}

export default function PlannerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [goal, setGoal] = useState("");
  const [courses, setCourses] = useState<Course[]>([{ id: '1', name: '', credits: 3 }]);
  const [hours, setHours] = useState(20);
  const [priority, setPriority] = useState<"GPA" | "Skill" | "Balance">("Balance");

  const serializeInput = () => {
    const courseList = courses.filter(c => c.name).map(c => `- ${c.name} (${c.credits} credits)`).join("\n");
    return `GOAL: ${goal}\nHOURS: ${hours}\nMODE: ${priority}\nCOURSES:\n${courseList}\n\nPlan this.`;
  };

  const handleGenerate = async () => {
    if (!goal.trim() || courses.some(c => !c.name)) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: serializeInput() }),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("student-os-plan", JSON.stringify(data.data));
          sessionStorage.setItem("student-os-meta", JSON.stringify({ goal, priority, hours }));
        }
        router.push("/dashboard");
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const addCourse = () => setCourses([...courses, { id: Math.random().toString(), name: '', credits: 3 }]);
  const updateCourse = (id: string, field: keyof Course, val: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: val } : c));
  };
  const removeCourse = (id: string) => {
    if (courses.length > 1) setCourses(courses.filter(c => c.id !== id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      <div className="w-full max-w-lg space-y-8 animate-in fade-in zoom-in-95 duration-700">

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Student OS
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            Architect your academic performance.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-8">
          {/* GOAL */}
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold px-1">Objective</div>
            <Input
              placeholder="What do you want to achieve this semester?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="h-12 text-md bg-slate-950/50 border-white/5 focus:border-blue-500/50 placeholder:text-slate-600"
            />
          </div>

          {/* COURSES */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Curriculum</div>
              <button onClick={addCourse} className="text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors">
                + Add Course
              </button>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="group flex gap-3 items-center">
                  <Input
                    placeholder="Course Name"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    className="flex-1 bg-slate-950/50 border-white/5 h-10"
                  />
                  <div className="relative w-20">
                    <Input
                      type="number"
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
                      className="bg-slate-950/50 border-white/5 text-center h-10 pr-2 pl-2"
                    />
                    <span className="absolute right-2 top-2.5 text-[10px] text-slate-600 font-mono pointer-events-none">pts</span>
                  </div>
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SETTINGS */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold px-1">Bandwidth</div>
              <div className="relative">
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="bg-slate-950/50 border-white/5 pl-4"
                />
                <span className="absolute right-4 top-3 text-xs text-slate-600 pointer-events-none">hrs/wk</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold px-1">Strategy</div>
              <div className="flex bg-slate-950/50 rounded-lg p-1 border border-white/5 h-11">
                {(["GPA", "Skill", "Balance"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPriority(m)}
                    className={`flex-1 text-[11px] font-medium rounded-md transition-all ${priority === m ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading || !goal}
            className="w-full h-12 bg-white text-black hover:bg-slate-200 font-semibold text-sm tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            ) : "GENERATE BLUEPRINT"}
          </Button>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Systems Operational
          </div>
        </div>
      </div>
    </main>
  );
}
