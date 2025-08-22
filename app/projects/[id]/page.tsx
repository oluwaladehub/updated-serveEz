import { ProjectDetailContent } from './project-detail-content'
import { Suspense } from 'react'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div>Loading project details...</div>}>
      <ProjectDetailContent id={id} />
    </Suspense>
  );
}