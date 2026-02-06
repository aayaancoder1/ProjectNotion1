"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { CompiledSemesterPlan } from "@/types/compiler-ir";

export default function DashboardPage() {
	const [plan, setPlan] = useState<CompiledSemesterPlan | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const stored = sessionStorage.getItem("student-os-plan");
			if (!stored) { router.replace("/"); return; }
			setPlan(JSON.parse(stored));
		}
	}, [router]);

	if (!plan) return null;

	const tasks = [...plan.tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
	const riskTasks = tasks.filter(t => t.priority === "High" && t.status !== "DONE");
	const focusTasks = tasks.filter(t => t.priority !== "High" && t.status !== "DONE").slice(0, 6);
	const stats = [
		{ label: "Active Courses", value: plan.courses.length },
		{ label: "Total Credits", value: plan.totalCredits },
		{ label: "Critical Tasks", value: riskTasks.length },
		{ label: "Pending", value: plan.pendingTasks }
	];

	return (
		<div className="min-h-screen bg-background p-8 animate-in fade-in duration-500">

			{/* Header */}
			<header className="max-w-7xl mx-auto flex justify-between items-end mb-12 border-b border-white/5 pb-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-white mb-2">Command Center</h1>
					<p className="text-slate-500">Overview of your academic quarter.</p>
				</div>
				<div className="flex gap-6">
					{stats.map((s) => (
						<div key={s.label} className="text-right">
							<div className="text-2xl font-semibold text-white tracking-tight">{s.value}</div>
							<div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{s.label}</div>
						</div>
					))}
				</div>
			</header>

			<main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

				{/* Left Col: Risk & Focus (8 cols) */}
				<div className="lg:col-span-8 space-y-12">

					{/* Risk Section */}
					{riskTasks.length > 0 && (
						<section className="space-y-6">
							<div className="flex items-center gap-3">
								<div className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500">
									<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
								</div>
								<h2 className="text-lg font-semibold text-white tracking-tight">Requires Attention</h2>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{riskTasks.map(t => <TaskCard key={t.id} task={t} />)}
							</div>
						</section>
					)}

					{/* Focus Section */}
					<section className="space-y-6">
						<div className="flex items-center gap-3">
							<div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-500">
								<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
							</div>
							<h2 className="text-lg font-semibold text-white tracking-tight">Active Workload</h2>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{focusTasks.map(t => <TaskCard key={t.id} task={t} />)}
						</div>
					</section>
				</div>

				{/* Right Col: Timeline/Summary (4 cols) */}
				<div className="lg:col-span-4 space-y-8">
					<div className="bg-slate-900/30 rounded-2xl border border-white/5 p-6 space-y-6 sticky top-8">
						<h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Course Load</h3>
						<div className="space-y-4">
							{plan.courses.map(c => (
								<div key={c.id} className="flex justify-between items-center p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors border border-transparent hover:border-white/5">
									<div>
										<div className="text-sm font-medium text-slate-300">{c.name}</div>
										<div className="text-xs text-slate-500">{c.type}</div>
									</div>
									<div className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
										{c.credits} cr
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

			</main>
		</div>
	);
}
