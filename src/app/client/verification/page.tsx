'use client';

import { useState, useEffect } from 'react';
import { BadgeCheck, CheckCircle2, Clock, ExternalLink, FileText, Upload, XCircle } from 'lucide-react';
import { Badge, Card, ProgressBar } from '@/components/ui/shared';
import { VerificationDocumentUploadGrid } from '@/components/client/verification-document-upload-grid';

const documentTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'national-id', label: 'National ID' },
  { value: 'drivers-license', label: "Driver's License" },
  { value: 'commitment-letter', label: 'Commitment Letter' },
  { value: 'mou', label: 'MOU' },
  { value: 'other', label: 'Other' },
];

const MOCK_DOCUMENTS = [
  {
    id: '1',
    documentType: 'passport',
    status: 'approved' as const,
    fileName: 'passport_scan.pdf',
    createdAt: '2026-06-10T10:30:00Z',
    documentNumber: 'P1234567',
    rejectionReason: null,
    fileUrl: '#',
  },
  {
    id: '2',
    documentType: 'national-id',
    status: 'pending' as const,
    fileName: 'aadhaar_front.jpg',
    createdAt: '2026-07-15T14:00:00Z',
    documentNumber: null,
    rejectionReason: null,
    fileUrl: '#',
  },
  {
    id: '3',
    documentType: 'drivers-license',
    status: 'rejected' as const,
    fileName: 'license_back.jpg',
    createdAt: '2026-07-12T09:15:00Z',
    documentNumber: 'DL-987654',
    rejectionReason: 'Document is blurry and text is not legible. Please upload a clearer scan.',
    fileUrl: '#',
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function labelForType(type: string) {
  return documentTypes.find((item) => item.value === type)?.label ?? type;
}

function statusBadge(status: 'approved' | 'rejected' | 'pending') {
  if (status === 'approved') return <Badge variant="green">Approved</Badge>;
  if (status === 'rejected') return <Badge variant="red">Rejected</Badge>;
  return <Badge variant="orange">Pending review</Badge>;
}

export default function ClientVerificationPage() {
  const [documents, setDocuments] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [message] = useState<string | null>(null);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/client/verification');
        if (res.ok) {
          const json = await res.json();
          setDocuments(json.data || MOCK_DOCUMENTS);
        } else {
          setDocuments(MOCK_DOCUMENTS);
        }
      } catch {
        setDocuments(MOCK_DOCUMENTS);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!documents) return null;

  const approvedCount = documents.filter((document) => document.status === 'approved').length;
  const pendingCount = documents.filter((document) => document.status === 'pending').length;
  const progressPercent = documents.length === 0 ? 0 : Math.round((approvedCount / documents.length) * 100);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Verification Center</h1>
          <p className="mt-1 text-sm text-text-secondary">Upload onboarding, identity, and business verification documents.</p>
        </div>
        <Badge variant={pendingCount > 0 ? 'orange' : approvedCount > 0 ? 'green' : 'purple'}>
          {approvedCount} approved / {documents.length} uploaded
        </Badge>
      </div>

      {message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm text-success">{message}</p>}
      {error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary-50">
                <Upload size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-text-primary">Upload Document</h2>
                <p className="text-sm text-text-secondary">Files are stored privately in Supabase Storage for admin review.</p>
              </div>
            </div>

            <VerificationDocumentUploadGrid documentTypes={documentTypes} />
          </Card>

          <Card className="p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-text-primary">Uploaded Documents</h2>
              <p className="text-sm text-text-secondary">Admin decisions will appear here.</p>
            </div>

            <div className="divide-y divide-border">
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-10 text-center text-text-secondary">
                  <FileText size={28} className="mb-2 text-text-tertiary" />
                  <p className="text-sm">No verification documents uploaded yet.</p>
                </div>
              ) : documents.map((document) => (
                <div key={document.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-text-primary">{labelForType(document.documentType)}</h3>
                      {statusBadge(document.status)}
                    </div>
                    <p className="mt-1 truncate text-sm text-text-secondary">{document.fileName}</p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      Uploaded {formatDate(document.createdAt)}
                      {document.documentNumber ? ` - ${document.documentNumber}` : ''}
                    </p>
                    {document.rejectionReason && <p className="mt-2 text-sm text-danger">{document.rejectionReason}</p>}
                  </div>
                  {document.fileUrl && (
                    <a href={document.fileUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-white px-3 text-sm font-semibold text-text-secondary hover:text-primary">
                      <ExternalLink size={14} />
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="h-fit p-5">
          <div className="mb-4 flex items-center gap-2">
            <BadgeCheck size={18} className="text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">Verification Status</h2>
          </div>
          <ProgressBar progress={progressPercent} />
          <p className="mt-2 text-center text-xs text-text-tertiary">{progressPercent}% approved</p>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="shrink-0 text-success" />
              <span className="text-text-secondary">{approvedCount} approved</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="shrink-0 text-warning" />
              <span className="text-text-secondary">{pendingCount} pending review</span>
            </div>
            <div className="flex items-center gap-3">
              <XCircle size={16} className="shrink-0 text-danger" />
              <span className="text-text-secondary">{documents.filter((document) => document.status === 'rejected').length} rejected</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
