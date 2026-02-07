
import { Course, Task } from "@/types/compiler-ir";

export interface SemesterMeta {
	goal: string;
	priority: string;
	hours: number;
}

export interface Semester {
	id: string;
	name: string; // e.g. "Fall 2024" or user goal
	courses: Course[];
	tasks: Task[];
	meta?: SemesterMeta;
	createdAt: string;
}

const STORAGE_KEY = "student-os-semesters";

export const SemesterService = {
	getAll: (): Semester[] => {
		if (typeof window === "undefined") return [];
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch (e) {
			console.error("Failed to parse semesters", e);
			return [];
		}
	},

	getById: (id: string): Semester | undefined => {
		return SemesterService.getAll().find((s) => s.id === id);
	},

	save: (semester: Semester): void => {
		const semesters = SemesterService.getAll();
		const index = semesters.findIndex((s) => s.id === semester.id);
		if (index >= 0) {
			semesters[index] = semester;
		} else {
			semesters.push(semester);
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
	},

	delete: (id: string): void => {
		const semesters = SemesterService.getAll().filter((s) => s.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
	},

	createFromData: (data: { courses: Course[]; tasks: Task[] }, name: string, meta?: SemesterMeta): Semester => {
		const id = crypto.randomUUID();
		const newSemester: Semester = {
			id,
			name,
			courses: data.courses,
			tasks: data.tasks,
			meta,
			createdAt: new Date().toISOString(),
		};
		SemesterService.save(newSemester);
		return newSemester;
	}
};
