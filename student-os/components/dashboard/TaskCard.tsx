
import { Task } from "../../types/compiler-ir";

interface TaskCardProps {
	task: Task;
	courseName?: string;
	onToggle: (taskId: string) => void;
	onEdit: (task: Task) => void;
	onDelete: (taskId: string) => void;
}

export function TaskCard({ task, courseName, onToggle, onEdit, onDelete }: TaskCardProps) {
	const isHighRisk = task.priority === "High";
	const isDone = task.status === "DONE";

	// Date Logic
	const now = new Date();
	const due = new Date(task.dueDate);
	const diffTime = due.getTime() - now.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	const isOverdue = diffDays < 0 && !isDone;
	const isDueSoon = diffDays >= 0 && diffDays <= 3 && !isDone;

	return (
		<div className={`group relative bg-slate-900/40 border border-white/5 rounded-xl p-4 transition-all duration-300 backdrop-blur-sm ${isDone ? 'opacity-50' : 'hover:bg-slate-800/60 hover:border-white/10 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20'}`}>

			{/* Top Row: Meta chips */}
			<div className="flex justify-between items-start mb-3 pl-8">
				<div className="flex flex-wrap gap-2">
					<span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-400 border border-white/5 uppercase tracking-wide">
						{task.type}
					</span>
					{isHighRisk && !isDone && (
						<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wide flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
							High Priority
						</span>
					)}
				</div>

				<div className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-1 rounded border border-white/5">
					{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Date'}
				</div>
			</div>

			{/* Checkbox (Status Toggle) */}
			<button
				onClick={() => onToggle(task.id)}
				className={`absolute top-4 left-3 w-5 h-5 rounded-full border flex items-center justify-center transition-all 
                    ${isDone ? 'bg-green-500 border-green-500 text-black' :
						isOverdue ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20' :
							isDueSoon ? 'border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20' :
								'border-slate-600 hover:border-slate-400 bg-transparent'}`}
				title={isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : isDone ? "Completed" : "Mark as Done"}
			>
				{isDone && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
			</button>

			{/* Main Content */}
			<div className="space-y-1 pl-8">
				<h3 className={`text-sm font-medium transition-colors line-clamp-2 ${isDone ? 'text-slate-500 line-through' : 'text-slate-200 group-hover:text-white'}`}>
					{task.name}
				</h3>
				<p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1.5">
					<span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
					{courseName || task.courseId} • Week {task.dueWeek}
				</p>
			</div>

			{/* Actions */}
			<div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
				<button
					onClick={(e) => { e.stopPropagation(); onEdit(task); }}
					className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
					title="Edit Task"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
				</button>
				<button
					onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
					className="p-1 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400"
					title="Delete Task"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
				</button>
			</div>
		</div>
	);
}
