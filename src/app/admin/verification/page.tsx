import { CheckCircle2, ExternalLink, FileText, ShieldCheck, XCircle } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { approveClientDocumentsAction, verifyDocumentAction } from '@/lib/admin-actions';
import { getAdminVerificationDocuments, type VerificationDocumentRecord } from '@/lib/portal-data';
import { Badge, Card } from '@/components/ui/shared';
import { FormSubmitButton } from '@/components/ui/form-submit-button';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function labelForType(type: string) {
  return type
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function statusBadge(status: VerificationDocumentRecord['status']) {
  if (status === 'approved') return <Badge variant="green">Approved</Badge>;
  if (status === 'rejected') return <Badge variant="red">Rejected</Badge>;
  return <Badge variant="orange">Pending</Badge>;
}

export default async function AdminVerificationPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string; error?: string }>;
}) {
  await requireRole('admin');
  const params = await searchParams;
  const documents = await getAdminVerificationDocuments();
  const pending = documents.filter((document) => document.status === 'pending');
  const approved = documents.filter((document) => document.status === 'approved');
  const rejected = documents.filter((document) => document.status === 'rejected');
  const documentsByClient = Array.from(
    documents.reduce((groups, document) => {
      const group = groups.get(document.clientId) ?? [];
      group.push(document);
      groups.set(document.clientId, group);
      return groups;
    }, new Map<string, VerificationDocumentRecord[]>()),
  );

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Verification Review</h2>
          <p className="mt-1 text-sm text-text-secondary">Review client-uploaded onboarding and identity documents.</p>
        </div>
        <Badge variant={pending.length > 0 ? 'orange' : 'green'}>{pending.length} pending</Badge>
      </div>

      {params?.message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm text-success">{params.message}</p>}
      {params?.error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm text-danger">{params.error}</p>}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card>
          <p className="text-sm text-text-secondary">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-warning">{pending.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Approved</p>
          <p className="mt-1 text-2xl font-semibold text-success">{approved.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Rejected</p>
          <p className="mt-1 text-2xl font-semibold text-danger">{rejected.length}</p>
        </Card>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-border bg-white">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-base font-semibold text-text-primary">Client Documents</h3>
          <p className="mt-0.5 text-sm text-text-secondary">All verification files are grouped by the client who uploaded them.</p>
        </div>

        <div className="divide-y divide-border">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-10 text-center text-text-secondary">
              <FileText size={28} className="mb-2 text-text-tertiary" />
              <p className="text-sm">No verification documents submitted yet.</p>
            </div>
          ) : documentsByClient.map(([clientId, clientDocuments]) => {
            const client = clientDocuments[0];
            const pendingForClient = clientDocuments.filter((document) => document.status === 'pending');

            return (
              <section key={clientId} className="bg-surface-secondary/30">
                <div className="flex flex-col gap-3 border-b border-border bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-semibold text-text-primary">{client.clientName}</h4>
                    <p className="mt-0.5 text-sm text-text-secondary">{client.clientEmail} - {clientDocuments.length} file{clientDocuments.length === 1 ? '' : 's'} uploaded</p>
                  </div>
                  {pendingForClient.length > 0 && (
                    <form action={approveClientDocumentsAction}>
                      <input type="hidden" name="clientId" value={clientId} />
                      <FormSubmitButton pendingLabel="Approving all..." className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-success px-3 text-sm font-semibold text-white hover:bg-success-500 disabled:cursor-not-allowed disabled:opacity-60">
                        <CheckCircle2 size={14} />
                        Approve all ({pendingForClient.length})
                      </FormSubmitButton>
                    </form>
                  )}
                </div>

                <div className="divide-y divide-border bg-white">
                  {clientDocuments.map((document) => (
                    <article key={document.id} className="grid gap-4 px-4 py-4 xl:grid-cols-[1fr_320px]">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h5 className="font-semibold text-text-primary">{labelForType(document.documentType)}</h5>
                          {statusBadge(document.status)}
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">{document.fileName}</p>
                        <p className="mt-1 text-xs text-text-tertiary">
                          Uploaded {formatDate(document.createdAt)}
                          {document.documentNumber ? ` - Ref: ${document.documentNumber}` : ''}
                        </p>
                        {document.rejectionReason && <p className="mt-2 text-sm text-danger">{document.rejectionReason}</p>}
                      </div>

                      <div className="flex flex-col gap-2">
                        {document.fileUrl && (
                          <a href={document.fileUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-white px-3 text-sm font-semibold text-text-secondary hover:text-primary">
                            <ExternalLink size={14} />
                            Open Document
                          </a>
                        )}

                        {document.status === 'pending' && (
                          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                            <form action={verifyDocumentAction}>
                              <input type="hidden" name="id" value={document.id} />
                              <input type="hidden" name="decision" value="approved" />
                              <FormSubmitButton pendingLabel="Approving..." className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[8px] bg-success px-3 text-sm font-semibold text-white hover:bg-success-500 disabled:cursor-not-allowed disabled:opacity-60">
                                <CheckCircle2 size={14} />
                                Approve
                              </FormSubmitButton>
                            </form>

                            <form action={verifyDocumentAction} className="space-y-2">
                              <input type="hidden" name="id" value={document.id} />
                              <input type="hidden" name="decision" value="rejected" />
                              <input name="rejectionReason" placeholder="Rejection reason" className="h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                              <FormSubmitButton pendingLabel="Rejecting..." className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[8px] bg-danger px-3 text-sm font-semibold text-white hover:bg-danger-500 disabled:cursor-not-allowed disabled:opacity-60">
                                <XCircle size={14} />
                                Reject
                              </FormSubmitButton>
                            </form>
                          </div>
                        )}

                        {document.status !== 'pending' && (
                          <div className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-surface-secondary px-3 text-sm font-semibold text-text-secondary">
                            <ShieldCheck size={14} />
                            Reviewed
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
