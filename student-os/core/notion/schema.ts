// Pure Schema Builders for Notion Databases

export function getCoursesDatabaseSchema(parentPageId: string) {
	return {
		parent: { page_id: parentPageId },
		title: [
			{
				type: "text",
				text: {
					content: "Student OS — Courses",
				},
			},
		],
		properties: {
			Name: {
				title: {},
			},
			Credits: {
				number: {
					format: "number",
				},
			},
			Status: {
				select: {
					options: [
						{ name: "Active", color: "green" },
						{ name: "Completed", color: "gray" },
						{ name: "Dropped", color: "red" },
					],
				},
			},
			Type: {
				select: {
					options: [
						{ name: "CORE", color: "blue" },
						{ name: "ELECTIVE", color: "purple" },
						{ name: "LAB", color: "yellow" },
					],
				},
			},
		},
	} as const;
}

export function getTasksDatabaseSchema(parentPageId: string, coursesDbId: string) {
	return {
		parent: { page_id: parentPageId },
		title: [
			{
				type: "text",
				text: {
					content: "Student OS — Tasks",
				},
			},
		],
		properties: {
			Name: {
				title: {},
			},
			Status: {
				status: {
					options: [
						{ name: "TODO", color: "red" },
						{ name: "IN_PROGRESS", color: "blue" },
						{ name: "DONE", color: "green" },
					],
				},
			},
			Priority: {
				select: {
					options: [
						{ name: "High", color: "red" },
						{ name: "Medium", color: "yellow" },
						{ name: "Low", color: "gray" },
					],
				},
			},
			"Due Date": {
				date: {},
			},
			Type: {
				select: {
					options: [
						{ name: "Assignment", color: "orange" },
						{ name: "Exam", color: "red" },
						{ name: "Lecture", color: "blue" },
						{ name: "Revision", color: "green" },
					],
				},
			},
			Course: {
				relation: {
					database_id: coursesDbId,
					type: "single_property",
					single_property: {},
				},
			},
		},
	} as const;
}
