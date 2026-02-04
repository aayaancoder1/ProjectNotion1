export interface ExecutorResult {
	createdDatabases: string[];
	createdPages: string[];
	createdViews: string[];
	notionWorkspace?: {
		user: string;
		workspaceName?: string;
	};
}
