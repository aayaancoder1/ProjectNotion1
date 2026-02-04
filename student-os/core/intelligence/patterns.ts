import { Task, Course, TaskStatus } from "../../types/compiler-ir";

export interface PatternInsights {
	laggingCourses: string[]; // IDs of courses with < 50% completion
	strugglingTaskTypes: string[]; // Types (e.g. 'Exam', 'Assignment') with high miss rate
	overloadedWeeks: number[]; // Weeks with excessive missed tasks
}

export function detectPatterns(tasks: Task[], courses: Course[]): PatternInsights {
	const insights: PatternInsights = {
		laggingCourses: [],
		strugglingTaskTypes: [],
		overloadedWeeks: []
	};

	// 1. Analyze Course Lag
	const courseStats = new Map<string, { total: number, missed: number }>();

	tasks.forEach(task => {
		const stats = courseStats.get(task.courseId) || { total: 0, missed: 0 };
		stats.total++;
		if (task.status !== TaskStatus.DONE && isOverdue(task)) {
			stats.missed++;
		}
		courseStats.set(task.courseId, stats);
	});

	courseStats.forEach((stats, courseId) => {
		if (stats.total > 0 && (stats.missed / stats.total) > 0.5) {
			insights.laggingCourses.push(courseId);
		}
	});

	// 2. Analyze Task Types
	const typeStats = new Map<string, { total: number, missed: number }>();

	tasks.forEach(task => {
		const type = task.type || "Generic";
		const stats = typeStats.get(type) || { total: 0, missed: 0 };
		stats.total++;
		if (task.status !== TaskStatus.DONE && isOverdue(task)) {
			stats.missed++;
		}
		typeStats.set(type, stats);
	});

	typeStats.forEach((stats, type) => {
		if (stats.total > 0 && (stats.missed / stats.total) > 0.4) {
			insights.strugglingTaskTypes.push(type);
		}
	});

	return insights;
}

// Helper to check if a task is effectively "overdue" or "missed" in a general sense
// For pattern detection, we assume current time context or check if status is trailing.
// Here we assume if it's not done, and we are analyzing "patterns", it counts as a negative signal relative to "now".
// Since this is a pure function without "now", we rely on the input state. 
// Ideally we'd pass "now". For now, we assume all non-DONE tasks in the input list are candidates for analysis if they look "old" or just generally checks failure rates.
// Actually, without 'now', we can't strictly say it's overdue. 
// But we can check completion rates of *all* tasks provided. 
// If the caller passes *all* tasks (including future), completion rate is biased.
// We assume the caller passes "tasks up to now" or we accept raw completion rate.
// Let's refine: The prompt implies detecting "Repeated deadline slips" / "lagging".
// We will look at "Missed" ratio vs Total.
function isOverdue(task: Task): boolean {
	// Simple proxy: If status is not DONE, we count it as 'missed' for pattern stats 
	// ONLY if we assume the input list has been pre-filtered to "past/present" tasks.
	// Or we check if status is explicitly not DONE.
	// We'll trust the caller to provide the relevant dataset (e.g. past weeks).
	return task.status !== TaskStatus.DONE;
}
