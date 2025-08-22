import { ProjectEditContent } from './project-edit-content'
import { Suspense } from 'react'

export default async function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div>Loading project details...</div>}>
      <ProjectEditContent id={id} />
    </Suspense>
  );
} 