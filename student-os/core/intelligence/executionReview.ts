import { Task, TaskStatus } from "../../types/compiler-ir";

export interface ExecutionMetrics {
	completed: Task[];
	missed: Task[]; // Due in past/current week but not done
	totalScheduled: number;
	completionRate: number;
}

/**
 * Reviews execution for a specific week based on the current state of tasks.
 * Note: Without historical snapshots, 'slipped' tasks (moved to future) cannot be detected 
 * purely from current state if their dueWeek is already updated. 
 * We focus on 'missed' (overdue) and 'completed' for the target week context.
 */
export function reviewWeeklyExecution(tasks: Task[], targetWeek: number): ExecutionMetrics {
	// Filter tasks that belong to this week or are overdue relative to this week
	// Logic: 
	// - Completed: Status is DONE and dueWeek was <= targetWeek (assuming we catch up)
	// - Missed: Status is NOT DONE and dueWeek <= targetWeek

	const relevantTasks = tasks.filter(t => t.dueWeek <= targetWeek);

	const completed = relevantTasks.filter(t => t.status === TaskStatus.DONE);
	const missed = relevantTasks.filter(t => t.status !== TaskStatus.DONE);

	const total = relevantTasks.length;
	const rate = total === 0 ? 1.0 : completed.length / total;

	return {
		completed,
		missed,
		totalScheduled: total,
		completionRate: rate
	};
}
