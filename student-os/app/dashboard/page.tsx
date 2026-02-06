"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionWrapper } from "@/components/dashboard/SectionWrapper";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { CompiledSemesterPlan, Task } from "@/types/compiler-ir";

export default function DashboardPage() {
	const [plan, setPlan] = useState<CompiledSemesterPlan | null>(null);
	const router = useRouter();

	useEffect(() => {
		// Hydrate from session storage
		if (typeof window !== 'undefined') {
			const stored = sessionStorage.getItem("student-os-plan");
			if (!stored) {
				router.replace("/");
				return;
			}
			try {
				setPlan(JSON.parse(stored));
			} catch (e) {
				console.error("Failed to parse plan", e);
				router.replace("/");
			}
		}
	}, [router]);

	if (!plan) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground animate-pulse">
				Loading Workspace...
			</div>
		)
	}

	// Views Logic (Simple frontend filter)
	const now = new Date();

	// "This Week" (Mock logic: tasks in week 1 since we have relative weeks, or roughly upcoming)
	// For v1 compiler, tasks have 'dueWeek'. Let's show week 1-2 as current focus context? 
	// Or just sort by date.
	const allTasks = [...plan.tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

	const thisWeekTasks = allTasks.slice(0, 3); // Simple "focus" slice 
	const atRiskTasks = allTasks.filter(t => t.priority === "High");
	const upcomingTasks = allTasks.slice(3, 9);

	return (
		<div className="min-h-screen bg-background p-6 sm:p-12 animate-in fade-in duration-500">
			<header className="flex items-center justify-between mb-12">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground text-sm">
						{plan.courses.length} Active Courses • {plan.totalCredits} Credits
					</p>
				</div>
				<div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
					System Online
				</div>
			</header>

			<main className="max-w-6xl mx-auto">
				<SectionWrapper
					title="Focus Queue"
					description="Immediate priority tasks for the current cycle."
				>
					{thisWeekTasks.length > 0 ? (
						thisWeekTasks.map(t => <TaskCard key={t.id} task={t} />)
					) : (
						<div className="col-span-full h-24 flex items-center justify-center border border-dashed border-secondary rounded-lg text-muted-foreground text-sm">
							No immediate tasks pending.
						</div>
					)}
				</SectionWrapper>

				{atRiskTasks.length > 0 && (
					<SectionWrapper
						title="At Risk"
						description="High priority items requiring immediate attention."
					>
						{atRiskTasks.map(t => <TaskCard key={t.id} task={t} />)}
					</SectionWrapper>
				)}

				<SectionWrapper
					title="Upcoming"
					description="Future timeline events."
				>
					{upcomingTasks.map(t => <TaskCard key={t.id} task={t} />)}
				</SectionWrapper>
			</main>
		</div>
	);
}
