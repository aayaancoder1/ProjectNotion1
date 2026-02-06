import { Task } from "../../types/compiler-ir";

interface TaskCardProps {
	task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
	const isHighRisk = task.priority === "High";

	return (
		<div className="group relative bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20">

			{/* Top Row: Meta chips */}
			<div className="flex justify-between items-start mb-3">
				<div className="flex gap-2">
					<span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-400 border border-white/5 uppercase tracking-wide">
						{task.type}
					</span>
					{isHighRisk && (
						<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wide flex items-center gap-1">
							High Priority
						</span>
					)}
				</div>

				{/* Date Pill */}
				<div className="text-[10px] font-mono text-slate-500 bg-black/20 px-2 py-1 rounded">
					{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
				</div>
			</div>

			{/* Main Content */}
			<div className="space-y-1">
				<h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2">
					{task.name}
				</h3>
				<p className="text-xs text-slate-500 line-clamp-1">
					{task.courseId} • Week {task.dueWeek}
				</p>
			</div>

			{/* Decorative Status Dot */}
			<div className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full ring-2 ring-background ${task.status === 'DONE' ? 'bg-green-500' : 'bg-slate-700'}`} />
		</div>
	);
}
