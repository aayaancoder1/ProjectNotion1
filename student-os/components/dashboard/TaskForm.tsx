
import { useState } from "react";
import { Course, Task } from "@/types/compiler-ir";

interface TaskFormProps {
	initialData?: Partial<Task>;
	courses: Course[];
	onSubmit: (task: any) => void;
	onCancel: () => void;
}

export function TaskForm({ courses, initialData, onSubmit, onCancel }: TaskFormProps) {
	const [name, setName] = useState(initialData?.name || "");
	const [courseId, setCourseId] = useState(initialData?.courseId || courses[0]?.id || "");
	const [type, setType] = useState<Task["type"]>(initialData?.type || "Assignment");
	const [priority, setPriority] = useState<Task["priority"]>(initialData?.priority || "Medium");
	// formats date to yyyy-mm-dd for input
	const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "");
	const [riskScore, setRiskScore] = useState(initialData?.riskScore || 0);
	const [dueWeek, setDueWeek] = useState(initialData?.dueWeek || 1);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({
			name,
			courseId,
			type,
			priority,
			dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
			riskScore,
			dueWeek
		});
	};

	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
				<button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				</button>

				<h2 className="text-xl font-bold text-white mb-6">{initialData ? "Edit Task" : "New Task"}</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Task Name</label>
						<input
							type="text"
							value={name}
							onChange={e => setName(e.target.value)}
							className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
							placeholder="e.g. Essay Draft"
							required
						/>
					</div>

					<div>
						<label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Course</label>
						<select
							value={courseId}
							onChange={e => setCourseId(e.target.value)}
							className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 appearance-none"
							required
						>
							{courses.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
						</select>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Type</label>
							<select
								value={type}
								onChange={e => setType(e.target.value as any)}
								className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 appearance-none"
							>
								<option value="Assignment" className="bg-slate-900">Assignment</option>
								<option value="Exam" className="bg-slate-900">Exam</option>
								<option value="Lecture" className="bg-slate-900">Lecture</option>
								<option value="Revision" className="bg-slate-900">Revision</option>
							</select>
						</div>
						<div>
							<label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Priority</label>
							<select
								value={priority}
								onChange={e => setPriority(e.target.value as any)}
								className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 appearance-none"
							>
								<option value="Low" className="bg-slate-900">Low</option>
								<option value="Medium" className="bg-slate-900">Medium</option>
								<option value="High" className="bg-slate-900">High</option>
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Due Date</label>
							<input
								type="date"
								value={dueDate}
								onChange={e => setDueDate(e.target.value)}
								className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
								required
							/>
						</div>
						<div>
							<label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Week</label>
							<input
								type="number"
								value={dueWeek}
								onChange={e => setDueWeek(Number(e.target.value))}
								className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
								min={1}
								max={16}
								required
							/>
						</div>
					</div>

					<div>
						<label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Impact Score (0-100)</label>
						<input
							type="range"
							min="0" max="100"
							value={riskScore}
							onChange={e => setRiskScore(Number(e.target.value))}
							className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
						/>
						<div className="text-right text-xs text-slate-400 mt-1">{riskScore} pts</div>
					</div>

					<button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors mt-2">
						{initialData ? "Save Changes" : "Create Task"}
					</button>
				</form>
			</div>
		</div>
	);
}
