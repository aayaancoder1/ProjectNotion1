"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface Course {
  id: string;
  name: string;
  credits: number;
}

export default function PlannerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Goal, 2 = Courses, 3 = Config

  // Form State
  const [goal, setGoal] = useState("");
  const [courses, setCourses] = useState<Course[]>([{ id: '1', name: '', credits: 3 }]);
  const [hours, setHours] = useState(20);
  const [priority, setPriority] = useState<"GPA" | "Skill" | "Balance">("Balance");

  // Format Helper
  const serializeInput = () => {
    const courseList = courses.map(c => `- ${c.name} (${c.credits} credits)`).join("\n");
    return `
SEMESTER GOAL: ${goal}
WEEKLY AVAILABLE HOURS: ${hours}
PRIORITY MODE: ${priority}

COURSES:
${courseList}

Generate a strict plan based on this.
    `.trim();
  };

  const handleGenerate = async () => {
    // Basic Validation
    if (!goal.trim()) { alert("Please set a semester goal."); return; }
    if (courses.some(c => !c.name)) { alert("Please complete course names."); return; }

    setIsLoading(true);

    try {
      const compiledInput = serializeInput();
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: compiledInput }),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("student-os-plan", JSON.stringify(data.data));
          // Also store metadata for dashboard summary
          sessionStorage.setItem("student-os-meta", JSON.stringify({ goal, priority, hours }));
        }
        router.push("/dashboard");
      } else {
        alert("Planning failed: " + data.error);
        setIsLoading(false);
      }
    } catch (e: any) {
      alert("System error: " + e.message);
      setIsLoading(false);
    }
  };

  // UI Helpers
  const addCourse = () => setCourses([...courses, { id: Math.random().toString(), name: '', credits: 3 }]);
  const updateCourse = (id: string, field: keyof Course, val: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: val } : c));
  };
  const removeCourse = (id: string) => {
    if (courses.length > 1) setCourses(courses.filter(c => c.id !== id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background selection:bg-primary/20">
      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">

        <header className="mb-10 text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Setup Semester
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure your academic engine.
          </p>
        </header>

        <Card className="border-secondary/30 bg-secondary/5 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">

            {/* 1. GOAL */}
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Primary Objective</Label>
              <Input
                placeholder="e.g. Maintain 4.0 GPA while looking for internships"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="bg-background/50 border-white/10 focus:border-white/20 h-11"
              />
            </div>

            {/* 2. COURSES */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Active Courses</Label>
                <button onClick={addCourse} className="text-xs text-primary hover:underline text-blue-400">+ Add Course</button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {courses.map((course, idx) => (
                  <div key={course.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                    <Input
                      placeholder="Course Name"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      className="flex-1 bg-background/50 border-white/10"
                    />
                    <Input
                      type="number"
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
                      className="w-20 bg-background/50 border-white/10 text-center"
                      min={0} max={6}
                    />
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="text-muted-foreground hover:text-red-400 p-2"
                      tabIndex={-1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. CONFIG */}
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Weekly Bandwidth (Hrs)</Label>
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Optimization Mode</Label>
                <div className="flex bg-background/50 rounded-md p-1 border border-white/10">
                  {(["GPA", "Skill", "Balance"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPriority(m)}
                      className={`flex-1 text-xs py-2 rounded-sm transition-all ${priority === m ? 'bg-primary/20 text-white font-medium shadow-sm' : 'text-muted-foreground hover:text-white'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !goal || courses.some(c => !c.name)}
                className="w-full h-12 text-md font-semibold bg-white text-black hover:bg-white/90"
              >
                {isLoading ? "Optimizing..." : "Generate Semester Plan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
