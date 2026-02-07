"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { CompiledSemesterPlan, Course, Task } from "@/types/compiler-ir";

export default function DashboardPage() {
	const [plan, setPlan] = useState<CompiledSemesterPlan | null>(null);
	const [meta, setMeta] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		// Safe Client-Side Hydration
		if (typeof window !== 'undefined') {
			try {
				const storedPlan = sessionStorage.getItem("student-os-plan");
				const storedMeta = sessionStorage.getItem("student-os-meta");

				if (!storedPlan) {
					router.replace("/");
					return;
				}

				const parsedPlan: CompiledSemesterPlan = JSON.parse(storedPlan);
				setPlan(parsedPlan);
				if (storedMeta) setMeta(JSON.parse(storedMeta));
			} catch (e) {
				console.error("Failed to load plan", e);
				router.replace("/");
			}
		}
	}, [router]);

	if (!plan) return null;

	// Enhance Task Data with Course Names
	const getCourseName = (id: string) => plan.courses.find(c => c.id === id)?.name || id;

	// Sorting and Filtering
	const tasks = [...plan.tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

	const riskTasks = tasks.filter(t => t.priority === "High" && t.status !== "DONE");
	const focusTasks = tasks.filter(t => t.priority !== "High" && t.status !== "DONE").slice(0, 6);
	const upcomingTasks = tasks.filter(t => t.status !== "DONE").slice(6, 12);

	// Stats Logic
	const totalCredits = plan.courses.reduce((sum, c) => sum + (c.credits || 0), 0);
	const activeCoursesCount = plan.courses.filter(c => c.status === "Active" || !c.status).length;

	const workloadLevel = totalCredits > 15 ? "High" : totalCredits > 12 ? "Medium" : "Optimized";

	return (
		<div className="min-h-screen bg-background text-foreground p-4 sm:p-8 animate-in fade-in duration-500 selection:bg-primary/20">

			{/* Header */}
			<header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 pb-6 border-b border-white/5 space-y-4 sm:space-y-0">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-white mb-1">Command Center</h1>
					<p className="text-slate-400 text-sm">Overview of your academic quarter.</p>
				</div>
				<div className="flex gap-8">
					<div className="text-right">
						<div className="text-2xl font-semibold text-white tracking-tight">{activeCoursesCount}</div>
						<div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Active Courses</div>
					</div>
					<div className="text-right">
						<div className="text-2xl font-semibold text-white tracking-tight">{totalCredits}</div>
						<div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Total Credits</div>
					</div>
					<div className="text-right">
						<div className="text-2xl font-semibold text-white tracking-tight">{riskTasks.length}</div>
						<div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Critical Tasks</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

				{/* Left Col: Tasks Grid (8 cols) */}
				<div className="lg:col-span-8 space-y-12">

					{/* Risk Section */}
					{riskTasks.length > 0 && (
						<section className="space-y-4">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
									<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
								</div>
								<div>
									<h2 className="text-lg font-semibold text-white tracking-tight leading-none">Requires Attention</h2>
									<p className="text-xs text-slate-500 mt-1">High priority items due soon.</p>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{riskTasks.map(t => <TaskCard key={t.id} task={t} courseName={getCourseName(t.courseId)} />)}
							</div>
						</section>
					)}

					{/* Focus Section */}
					<section className="space-y-4">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
								<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
							</div>
							<div>
								<h2 className="text-lg font-semibold text-white tracking-tight leading-none">Active Workload</h2>
								<p className="text-xs text-slate-500 mt-1">Standard tasks for the current cycle.</p>
							</div>
						</div>
						{focusTasks.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{focusTasks.map(t => <TaskCard key={t.id} task={t} courseName={getCourseName(t.courseId)} />)}
							</div>
						) : (
							<div className="p-8 border border-dashed border-white/5 rounded-xl text-center text-slate-500 text-sm italic">
								No immediate tasks in the active queue.
							</div>
						)}
					</section>

					{/* Upcoming Section */}
					{upcomingTasks.length > 0 && (
						<section className="space-y-4 pt-4 border-t border-white/5">
							<h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest pl-1">Upcoming</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-75 hover:opacity-100 transition-opacity duration-500">
								{upcomingTasks.map(t => <TaskCard key={t.id} task={t} courseName={getCourseName(t.courseId)} />)}
							</div>
						</section>
					)}
				</div>

				{/* Right Col: Sticky Summary (4 cols) */}
				<div className="lg:col-span-4 space-y-6">
					<div className="lg:sticky lg:top-8 space-y-6">

						{/* Semester Summary Card */}
						<div className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-white/5 p-6 space-y-6 shadow-xl relative overflow-hidden">
							<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

							<div>
								<h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
									Semester at a Glance
								</h3>

								<div className="grid grid-cols-2 gap-4 mb-6">
									<div className="p-3 rounded-lg bg-black/20 border border-white/5">
										<div className="text-[10px] text-slate-500 uppercase font-medium mb-1">Status</div>
										<div className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
											<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
											On Track
										</div>
									</div>
									<div className="p-3 rounded-lg bg-black/20 border border-white/5">
										<div className="text-[10px] text-slate-500 uppercase font-medium mb-1">Load</div>
										<div className="text-sm font-medium text-white">{workloadLevel}</div>
									</div>
								</div>

								<div className="space-y-3">
									{plan.courses.map(c => (
										<div key={c.id} className="group flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5 cursor-default">
											<div className="min-w-0 pr-2">
												<div className="text-sm font-medium text-slate-300 group-hover:text-white truncate">{c.name}</div>
												<div className="text-[10px] text-slate-500 uppercase tracking-wide">{c.type || 'Core'}</div>
											</div>
											<div className="text-xs font-mono text-slate-500 bg-black/20 px-2 py-1 rounded shrink-0 border border-white/5 group-hover:border-white/10">
												{c.credits} cr
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Meta Info */}
						{meta && (
							<div className="p-4 rounded-xl border border-white/5 bg-slate-900/20 text-xs text-slate-500 space-y-2">
								<div className="flex justify-between">
									<span>Goal:</span>
									<span className="text-slate-300 font-medium truncate max-w-[150px]">{meta.goal}</span>
								</div>
								<div className="flex justify-between">
									<span>Priority:</span>
									<span className="text-slate-300 font-medium">{meta.priority}</span>
								</div>
							</div>
						)}

					</div>
				</div>

			</main>
		</div>
	);
}
