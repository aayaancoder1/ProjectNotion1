import { Task } from "../../types/compiler-ir";

interface TaskCardProps {
	task: Task;
	courseName?: string;
}

export function TaskCard({ task, courseName }: TaskCardProps) {
	const isHighRisk = task.priority === "High";

	return (
		<div className="group relative bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20 backdrop-blur-sm">

			{/* Top Row: Meta chips */}
			<div className="flex justify-between items-start mb-3">
				<div className="flex flex-wrap gap-2">
					<span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-400 border border-white/5 uppercase tracking-wide">
						{task.type}
					</span>
					{isHighRisk && (
						<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wide flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
							High Priority
						</span>
					)}
				</div>

				{/* Date Pill */}
				<div className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-1 rounded border border-white/5">
					{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Date'}
				</div>
			</div>

			{/* Main Content */}
			<div className="space-y-1">
				<h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2">
					{task.name}
				</h3>
				<p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1.5">
					<span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
					{courseName || task.courseId} • Week {task.dueWeek}
				</p>
			</div>

			{/* Status Dot */}
			<div className={`absolute top-4 right-4 w-2 h-2 rounded-full ring-2 ring-background transition-colors ${task.status === 'DONE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-700'}`} />
		</div>
	);
}
