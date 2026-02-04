import { Task, Course, TaskStatus } from "../../types/compiler-ir";

export function getThisWeekTasks(tasks: Task[], now: Date): Task[] {
	// Logic: Due current ISO week or earlier (overdue)
	// Simplified: Due within next 7 days or overdue, AND not done.
	// Actually prompts says: Due Week = current or next. Sort: Due Week asc, Priority desc.
	// We need to map Date to "Due Week".
	// For now, let's use the 'dueWeek' field from IR as primary if available, but users live in real dates.
	// The IR 'dueWeek' is relative to semester start.
	// The Prompt 4.1 says "thisWeek(tasks, now)".
	// Let's assume 'dueWeek' 1 is the first week of semester.
	// Without semester start date, 'dueWeek' is abstract.
	// However, tasks have 'dueDate' (ISO string). We should use that.

	const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
	const today = now.getTime();
	const nextWeek = today + oneWeekInMs;

	return tasks
		.filter(task => {
			if (task.status === TaskStatus.DONE) return false;
			const due = new Date(task.dueDate).getTime();
			// Include overdue tasks too? Prompt says "Due Week = current or next".
			// Let's stick to: Not Done AND Due Date <= nextWeek.
			return due <= nextWeek;
		})
		.sort((a, b) => {
			// Sort by Due Date ascending
			const dateA = new Date(a.dueDate).getTime();
			const dateB = new Date(b.dueDate).getTime();
			if (dateA !== dateB) return dateA - dateB;

			// Then Priority descending (High > Medium > Low)
			const priorityMap = { High: 3, Medium: 2, Low: 1 };
			return priorityMap[b.priority] - priorityMap[a.priority];
		});
}

export function getUpcomingTasks(tasks: Task[]): Task[] {
	// Filter: Status != DONE
	// Sort: Due Date ascending
	return tasks
		.filter(task => task.status !== TaskStatus.DONE)
		.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export function getAtRiskTasks(tasks: Task[], courses: Course[]): Task[] {
	// Filter: Status != DONE, Course Credits >= 4
	// Sort: Due Date ascending

	// Map courseId to credits
	const courseCredits = new Map<string, number>();
	courses.forEach(c => courseCredits.set(c.id, c.credits));

	return tasks
		.filter(task => {
			if (task.status === TaskStatus.DONE) return false;
			const credits = courseCredits.get(task.courseId) || 0;
			return credits >= 4;
		})
		.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}
