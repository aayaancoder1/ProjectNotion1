import { Task } from "../../types/compiler-ir";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TaskCardProps {
	task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
	const isHighRisk = task.priority === "High";
	const statusColor = task.status === "DONE" ? "text-green-400" : "text-muted-foreground";

	return (
		<Card className="bg-secondary/20 hover:bg-secondary/40 transition-colors border-secondary/50">
			<CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-sm font-medium leading-none truncate pr-4">
					{task.name}
				</CardTitle>
				<div className={`h-2 w-2 rounded-full ${isHighRisk ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-primary/20'}`} />
			</CardHeader>
			<CardContent className="p-4 pt-2">
				<div className="text-xs text-muted-foreground flex justify-between">
					<span>{task.type}</span>
					<span className={statusColor}>{task.status}</span>
				</div>
				<div className="mt-2 text-xs font-mono opacity-50">
					Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
				</div>
			</CardContent>
		</Card>
	);
}
