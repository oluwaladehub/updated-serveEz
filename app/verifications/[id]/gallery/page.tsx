import { Suspense } from 'react'
import { GalleryContent } from './gallery-content'

export default async function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div>Loading gallery...</div>}>
      <GalleryContent id={id} />
    </Suspense>
  );
} 