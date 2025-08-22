import { VerificationDetailContent } from './verification-detail-content'
import { Suspense } from 'react'

export default async function VerificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div>Loading verification details...</div>}>
      <VerificationDetailContent id={id} />
    </Suspense>
  );
} 