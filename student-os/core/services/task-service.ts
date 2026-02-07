
import { Task } from "@/types/compiler-ir";
import { SemesterService } from "./semester-service";

export const TaskService = {
	addTask: (semesterId: string, task: Task): void => {
		const semester = SemesterService.getById(semesterId);
		if (semester) {
			semester.tasks.push(task);
			SemesterService.save(semester);
		}
	},

	updateTask: (semesterId: string, taskId: string, updates: Partial<Task>): void => {
		const semester = SemesterService.getById(semesterId);
		if (semester) {
			const taskIndex = semester.tasks.findIndex((t) => t.id === taskId);
			if (taskIndex >= 0) {
				semester.tasks[taskIndex] = { ...semester.tasks[taskIndex], ...updates };
				SemesterService.save(semester);
			}
		}
	},

	deleteTask: (semesterId: string, taskId: string): void => {
		const semester = SemesterService.getById(semesterId);
		if (semester) {
			semester.tasks = semester.tasks.filter((t) => t.id !== taskId);
			SemesterService.save(semester);
		}
	},

	getTasks: (semesterId: string): Task[] => {
		const semester = SemesterService.getById(semesterId);
		return semester ? semester.tasks : [];
	}
};
