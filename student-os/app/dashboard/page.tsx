"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionWrapper } from "@/components/dashboard/SectionWrapper";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompiledSemesterPlan, Task } from "@/types/compiler-ir";

export default function DashboardPage() {
	const [plan, setPlan] = useState<CompiledSemesterPlan | null>(null);
	const [meta, setMeta] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedPlan = sessionStorage.getItem("student-os-plan");
			const storedMeta = sessionStorage.getItem("student-os-meta");

			if (!storedPlan) {
				router.replace("/");
				return;
			}
			try {
				setPlan(JSON.parse(storedPlan));
				if (storedMeta) setMeta(JSON.parse(storedMeta));
			} catch (e) {
				router.replace("/");
			}
		}
	}, [router]);

	if (!plan) return null;

	// Analysis Logic
	// Sort tasks by date
	const sortedTasks = [...plan.tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

	// Categorization
	const highRisk = sortedTasks.filter(t => t.priority === "High" && t.status !== "DONE");
	const focusNow = sortedTasks.filter(t => t.priority !== "High" && t.status !== "DONE").slice(0, 5);
	const upcoming = sortedTasks.filter(t => t.status !== "DONE").slice(5, 10); // Simple pagination simulation

	// Derived Stats
	const workloadLevel = plan.totalCredits > 15 ? "High" : plan.totalCredits > 12 ? "Medium" : "Optimized";
	const riskScore = highRisk.length * 10;

	return (
		<div className="min-h-screen bg-background p-6 lg:p-10 animate-in fade-in duration-700">

			{/* 1. Summary Card */}
			<div className="max-w-6xl mx-auto mb-10">
				<Card className="bg-gradient-to-br from-secondary/40 to-background border-secondary/50">
					<CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
						<div>
							<h1 className="text-2xl font-bold tracking-tight mb-2">Semester at a Glance</h1>
							<div className="flex gap-4 text-sm text-muted-foreground">
								<span className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-blue-400" /> {plan.courses.length} Courses
								</span>
								<span className="flex items-center gap-2">
									<span className={`w-2 h-2 rounded-full ${riskScore > 30 ? 'bg-red-500' : 'bg-green-500'}`} /> Risk Score: {riskScore}
								</span>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="text-center px-6 py-3 bg-background/50 rounded-lg border border-white/5">
								<div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Workload</div>
								<div className="font-semibold">{workloadLevel}</div>
							</div>
							<div className="text-center px-6 py-3 bg-background/50 rounded-lg border border-white/5">
								<div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Focus</div>
								<div className="font-semibold">{meta?.priority || "General"}</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<main className="max-w-6xl mx-auto space-y-10">

				{/* 2. Risk Zone */}
				{highRisk.length > 0 && (
					<SectionWrapper
						title="⚠️ Risk Zone"
						description="Critical items requiring immediate intervention."
					>
						{highRisk.map(t => <TaskCard key={t.id} task={t} />)}
					</SectionWrapper>
				)}

				{/* 3. Focus Now */}
				<SectionWrapper
					title="🔥 Focus Now"
					description="Your immediate execution queue for this cycle."
				>
					{focusNow.length > 0 ? focusNow.map(t => <TaskCard key={t.id} task={t} />) : (
						<div className="col-span-full py-8 text-center text-muted-foreground italic border border-dashed border-white/5 rounded-lg">
							Clear skies. No tasks pending in queue.
						</div>
					)}
				</SectionWrapper>

				{/* 4. Upcoming */}
				<SectionWrapper
					title="⏳ Upcoming"
					description="On the horizon. Prepare, but don't stress yet."
				>
					{upcoming.map(t => <TaskCard key={t.id} task={t} />)}
				</SectionWrapper>

			</main>
		</div>
	);
}
