import React, { ReactNode } from 'react';

interface SectionWrapperProps {
	title: string;
	description?: string;
	children: ReactNode;
}

export function SectionWrapper({ title, description, children }: SectionWrapperProps) {
	return (
		<div className="space-y-4 mb-8">
			<div>
				<h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{children}
			</div>
		</div>
	);
}
