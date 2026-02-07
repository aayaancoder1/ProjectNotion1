
"use client";

import { useMemo } from "react";
import { Semester } from "@/core/services/semester-service";
import { Task } from "@/types/compiler-ir";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	CartesianGrid
} from "recharts";

export type Filter = { type: 'week' | 'priority' | 'course'; value: any } | null;

interface AnalyticsPanelProps {
	semester: Semester;
	onFilter?: (filter: Filter) => void;
	activeFilter?: Filter;
}

export function AnalyticsPanel({ semester, onFilter, activeFilter }: AnalyticsPanelProps) {
	const { tasks, courses } = semester;

	const handleFilter = (type: 'week' | 'priority' | 'course', value: any) => {
		if (onFilter) {
			// Toggle off if same
			if (activeFilter && activeFilter.type === type && activeFilter.value === value) {
				onFilter(null);
			} else {
				onFilter({ type, value });
			}
		}
	};

	// 1. Weekly Workload Logic
	const weeklyData = useMemo(() => {
		const weeks: Record<number, { week: number; tasks: number; risk: number }> = {};

		// Initialize for at least 16 weeks or max found
		const maxWeek = Math.max(16, ...tasks.map(t => t.dueWeek || 0));
		for (let i = 1; i <= maxWeek; i++) {
			weeks[i] = { week: i, tasks: 0, risk: 0 };
		}

		tasks.forEach(t => {
			const w = t.dueWeek || 1;
			if (weeks[w]) {
				weeks[w].tasks += 1;
				weeks[w].risk += t.riskScore || 0;
			}
		});

		return Object.values(weeks).sort((a, b) => a.week - b.week);
	}, [tasks]);

	// 2. Credit Distribution Logic
	const creditData = useMemo(() => {
		return courses.map(c => ({
			name: c.name,
			value: c.credits || 0
		}));
	}, [courses]);

	// 3. Task Priority Logic
	const priorityData = useMemo(() => {
		const data = {
			High: { name: "High", pending: 0, done: 0 },
			Medium: { name: "Medium", pending: 0, done: 0 },
			Low: { name: "Low", pending: 0, done: 0 },
		};

		tasks.forEach(t => {
			const p = t.priority as "High" | "Medium" | "Low";
			if (data[p]) {
				if (t.status === "DONE") {
					data[p].done += 1;
				} else {
					data[p].pending += 1;
				}
			}
		});

		return Object.values(data);
	}, [tasks]);

	// 4. Risk Score Calculation
	const riskMetrics = useMemo(() => {
		const totalRisk = tasks.reduce((sum, t) => sum + (t.riskScore || 0), 0);
		const pendingRisk = tasks
			.filter(t => t.status !== "DONE")
			.reduce((sum, t) => sum + (t.riskScore || 0), 0);

		// Percentage of risk remaining
		const rawScore = totalRisk > 0 ? Math.round((pendingRisk / totalRisk) * 100) : 0;

		let status = "Low";
		let color = "text-emerald-400";

		if (rawScore > 70) {
			status = "Critical";
			color = "text-red-400";
		} else if (rawScore > 40) {
			status = "Moderate";
			color = "text-yellow-400";
		}

		return { score: rawScore, status, color };
	}, [tasks]);

	// Colors for charts
	const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"];

	return (
		<div className="space-y-6">

			{/* Risk Score Indicator */}
			<div className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-white/5 p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
				<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
				<h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
					<span className={`w-1.5 h-1.5 rounded-full ${riskMetrics.color.replace('text-', 'bg-')}`}></span>
					Current Risk Level
				</h3>
				<div className="flex items-end gap-3">
					<span className={`text-4xl font-bold ${riskMetrics.color}`}>{riskMetrics.score}%</span>
					<span className="text-sm text-slate-500 mb-1.5 font-medium">{riskMetrics.status} Exposure</span>
				</div>
				<div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
					<div
						className={`h-full rounded-full ${riskMetrics.color.replace('text-', 'bg-')} transition-all duration-500`}
						style={{ width: `${riskMetrics.score}%` }}
					/>
				</div>
			</div>

			{/* Weekly Workload Chart */}
			<div className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-white/5 p-6">
				<h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Weekly Workload</h3>
				<div className="h-48 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={weeklyData}>
							<XAxis
								dataKey="week"
								stroke="#64748b"
								fontSize={10}
								tickLine={false}
								axisLine={false}
								tickFormatter={(val) => `W${val}`}
							/>
							<Tooltip
								contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
								itemStyle={{ color: '#cbd5e1' }}
								cursor={{ fill: 'rgba(255,255,255,0.05)' }}
							/>
							<Bar
								dataKey="tasks"
								fill="#3b82f6"
								radius={[4, 4, 0, 0]}
								maxBarSize={40}
								onClick={(data: any) => handleFilter('week', data.week)}
								cursor="pointer"
							>
								{weeklyData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={activeFilter?.type === 'week' && activeFilter.value === entry.week ? '#60a5fa' : '#3b82f6'}
										opacity={activeFilter && (activeFilter.type !== 'week' || activeFilter.value !== entry.week) ? 0.3 : 1}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Priority Distribution */}
			<div className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-white/5 p-6">
				<h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Task Status by Priority</h3>
				<div className="h-48 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={priorityData} layout="vertical" barSize={20}>
							<XAxis type="number" hide />
							<YAxis
								dataKey="name"
								type="category"
								stroke="#64748b"
								fontSize={10}
								tickLine={false}
								axisLine={false}
								width={50}
							/>
							<Tooltip
								contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
								cursor={{ fill: 'rgba(255,255,255,0.05)' }}
							/>
							<Bar
								dataKey="pending"
								name="Pending"
								stackId="a"
								fill="#3b82f6"
								radius={[0, 4, 4, 0]}
								onClick={(data: any) => handleFilter('priority', data.name)}
								cursor="pointer"
							>
								{priorityData.map((entry, index) => (
									<Cell
										key={`cell-pending-${index}`}
										opacity={activeFilter && (activeFilter.type !== 'priority' || activeFilter.value !== entry.name) ? 0.3 : 1}
									/>
								))}
							</Bar>
							<Bar
								dataKey="done"
								name="Completed"
								stackId="a"
								fill="#10b981"
								radius={[0, 4, 4, 0]}
								onClick={(data: any) => handleFilter('priority', 'Completed')} // Special case for completed
								cursor="pointer"
							>
								{priorityData.map((entry, index) => (
									<Cell
										key={`cell-done-${index}`}
										opacity={activeFilter && (activeFilter.type !== 'priority' || activeFilter.value !== 'Completed') ? 0.3 : 1}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Credit Distribution */}
			<div className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-white/5 p-6">
				<h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Credit Distribution</h3>
				<div className="h-48 w-full flex items-center justify-center">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={creditData}
								cx="50%"
								cy="50%"
								innerRadius={40}
								outerRadius={70}
								paddingAngle={5}
								dataKey="value"
								stroke="none"
								onClick={(data: any) => handleFilter('course', data.name)}
								cursor="pointer"
							>
								{creditData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
										opacity={activeFilter && (activeFilter.type !== 'course' || activeFilter.value !== entry.name) ? 0.3 : 1}
									/>
								))}
							</Pie>
							<Tooltip
								contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
								itemStyle={{ color: '#cbd5e1' }}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className="flex flex-wrap gap-2 justify-center mt-2">
					{creditData.map((entry, index) => (
						<div
							key={index}
							className={`flex items-center gap-1 cursor-pointer transition-opacity ${activeFilter && (activeFilter.type !== 'course' || activeFilter.value !== entry.name) ? 'opacity-30' : 'opacity-100'}`}
							onClick={() => handleFilter('course', entry.name)}
						>
							<span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
							<span className="text-[10px] text-slate-400">{entry.name.substring(0, 10)}...</span>
						</div>
					))}
				</div>
			</div>

		</div>
	);
}
