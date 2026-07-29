'use client';

import { useMemo, useState } from 'react';
import { CreditCard, ExternalLink, ImageIcon, Plus, QrCode } from 'lucide-react';
import { cancelPaymentAction, createPaymentAction, updatePaymentAction, updatePaymentSettingsAction } from '@/lib/admin-actions';
import {
  paymentStatuses,
  type AdminClientRecord,
  type AdminPaymentRecord,
  type PaymentSettingsRecord,
  type PaymentStatusValue,
} from '@/lib/portal-data';
import { DEFAULT_CURRENCY, PAYMENT_AMOUNT_MAX, formatCurrency } from '@/lib/money';
import { Drawer } from '@/components/ui/slide-panel';
import { FormSubmitButton } from '@/components/ui/form-submit-button';

function formatDate(value: string | null) {
  if (!value) return 'No due date';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toDateTimeLocal(value: string | null) {
  return value ? value.slice(0, 16) : '';
}

function statusBadge(status: PaymentStatusValue) {
  if (status === 'paid') return 'badge-green';
  if (status === 'pending') return 'badge-orange';
  if (status === 'overdue') return 'badge-red';
  return 'badge-gray';
}

function inputClass(extra = '') {
  return `h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${extra}`;
}

function PaymentForm({
  payment,
  clients,
}: {
  payment?: AdminPaymentRecord;
  clients: AdminClientRecord[];
}) {
  const action = payment ? updatePaymentAction : createPaymentAction;

  return (
    <form action={action} className="space-y-4">
      {payment && <input type="hidden" name="id" value={payment.id} />}
      <div className="grid gap-4 md:grid-cols-2">
        {!payment && (
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-medium text-text-secondary">Client</span>
            <select name="clientId" required className={inputClass()} defaultValue="">
              <option value="" disabled>Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.fullName || client.email}</option>
              ))}
            </select>
          </label>
        )}
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-text-secondary">Title</span>
          <input name="title" required defaultValue={payment?.title ?? ''} placeholder="Invoice or milestone title" className={inputClass()} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary">Amount</span>
          <input name="amount" required type="number" min="0" max={PAYMENT_AMOUNT_MAX} step="0.01" defaultValue={payment?.amount ?? ''} placeholder="0.00" className={inputClass()} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary">Currency</span>
          <input name="currency" required defaultValue={payment?.currency || DEFAULT_CURRENCY} maxLength={3} pattern="[A-Za-z]{3}" className={inputClass('uppercase')} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary">Status</span>
          <select name="status" defaultValue={payment?.status ?? 'pending'} className={inputClass()}>
            {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary">Due date</span>
          <input name="dueDate" type="date" defaultValue={payment?.dueDate ?? ''} className={inputClass()} />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-text-secondary">Paid at</span>
          <input name="paidAt" type="datetime-local" defaultValue={toDateTimeLocal(payment?.paidAt ?? null)} className={inputClass()} />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-text-secondary">Notes</span>
          <textarea name="notes" defaultValue={payment?.notes ?? ''} placeholder="Optional payment note" className="min-h-24 w-full rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        {payment && payment.status !== 'cancelled' && (
          <FormSubmitButton formAction={cancelPaymentAction} pendingLabel="Cancelling..." className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-danger/20 bg-danger-50 px-3.5 text-sm font-medium text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60">
            Cancel payment
          </FormSubmitButton>
        )}
        <FormSubmitButton pendingLabel={payment ? 'Saving...' : 'Creating...'} disabled={!payment && clients.length === 0} className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50">
          {payment ? 'Save payment' : 'Create payment'}
        </FormSubmitButton>
      </div>
    </form>
  );
}

function PaymentSettingsPanel({ paymentSettings }: { paymentSettings: PaymentSettingsRecord }) {
  return (
    <section className="card p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary-50 text-primary">
          <QrCode size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">UPI Payment Settings</h3>
          <p className="mt-0.5 text-xs text-text-secondary">Shown to clients when they click Pay. QR uploads are stored in Supabase Storage.</p>
        </div>
      </div>

      <form action={updatePaymentSettingsAction} className="grid gap-4 lg:grid-cols-[1fr_1fr_220px_auto]">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary">UPI ID</span>
          <input name="upiId" defaultValue={paymentSettings.upiId ?? ''} placeholder="example@upi" required className={inputClass()} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary">Receiver name</span>
          <input name="receiverName" defaultValue={paymentSettings.receiverName ?? ''} placeholder="Belvo" className={inputClass()} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary">QR code</span>
          <input name="qrCode" type="file" accept="image/png,image/jpeg,image/webp" className="block w-full text-xs text-text-secondary file:mr-2 file:h-9 file:rounded-[8px] file:border-0 file:bg-surface-tertiary file:px-3 file:text-xs file:font-semibold file:text-text-primary hover:file:bg-primary-50" />
        </label>
        <div className="flex items-end">
          <FormSubmitButton pendingLabel="Saving..." className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50">
            Save UPI
          </FormSubmitButton>
        </div>
      </form>

      <div className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr]">
        <div className="flex h-28 w-28 items-center justify-center rounded-[8px] border border-border bg-surface-secondary p-2">
          {paymentSettings.qrCodeUrl ? (
            <img src={paymentSettings.qrCodeUrl} alt="Current UPI QR code" className="h-full w-full object-contain" />
          ) : (
            <QrCode size={28} className="text-text-tertiary" />
          )}
        </div>
        <div className="flex flex-col justify-center text-sm">
          <p className="font-medium text-text-primary">{paymentSettings.upiId || 'No UPI ID configured'}</p>
          <p className="mt-1 text-text-secondary">{paymentSettings.receiverName || 'Receiver name not set'}</p>
          <p className="mt-2 text-xs text-text-tertiary">
            {paymentSettings.updatedAt ? `Last updated ${formatDate(paymentSettings.updatedAt)}` : 'Clients will see a generated QR until you upload one.'}
          </p>
        </div>
      </div>
    </section>
  );
}

function formatFileSize(value: number | null | undefined) {
  if (!value) return 'Unknown size';
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function PaymentProofs({ payment }: { payment?: AdminPaymentRecord }) {
  if (!payment || !payment.proofs || payment.proofs.length === 0) {
    return (
      <section className="rounded-[8px] border border-border bg-surface-secondary p-4">
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <ImageIcon size={18} className="text-text-tertiary" />
          No payment screenshots uploaded yet.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3 rounded-[8px] border border-primary/20 bg-primary-50/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Uploaded Payment Proofs</h3>
          <p className="mt-0.5 text-xs text-text-secondary">Screenshots uploaded by the client for this payment.</p>
        </div>
        <span className="badge badge-purple">{payment.proofs.length} uploaded</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {payment.proofs.map((proof) => (
          <article key={proof.id} className="rounded-[8px] border border-border bg-white p-3">
            {proof.fileUrl ? (
              <a href={proof.fileUrl} target="_blank" rel="noreferrer" className="block">
                <img src={proof.fileUrl} alt={`Payment proof ${proof.fileName}`} className="h-48 w-full rounded-[8px] border border-border object-contain" />
              </a>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-[8px] border border-border bg-surface-secondary text-text-tertiary">
                <ImageIcon size={24} />
              </div>
            )}
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-primary">{proof.fileName}</p>
                <p className="mt-0.5 text-xs text-text-tertiary">
                  {formatDate(proof.createdAt)} - {formatFileSize(proof.fileSize)}
                </p>
              </div>
              {proof.fileUrl && (
                <a href={proof.fileUrl} target="_blank" rel="noreferrer" className="inline-flex h-8 shrink-0 items-center gap-1 rounded-[8px] border border-border bg-white px-2 text-xs font-semibold text-text-secondary hover:text-primary">
                  <ExternalLink size={13} />
                  Open
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AdminPaymentsTable({
  payments,
  clients,
  paymentSettings,
}: {
  payments: AdminPaymentRecord[];
  clients: AdminClientRecord[];
  paymentSettings: PaymentSettingsRecord;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPayment = useMemo(() => payments.find((payment) => payment.id === selectedId), [payments, selectedId]);
  const creating = selectedId === 'new';

  return (
    <>
      <PaymentSettingsPanel paymentSettings={paymentSettings} />

      <section className="card overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">All Payments</h3>
            <p className="mt-0.5 text-xs text-text-secondary">Click any row to inspect or edit the record.</p>
          </div>
          <button type="button" onClick={() => setSelectedId('new')} className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-primary px-3.5 text-sm font-medium text-white hover:bg-primary-600">
            <Plus size={15} />
            New payment
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Payment</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Client</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Proof</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Due</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Paid</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-text-secondary" colSpan={6}>
                    <CreditCard className="mx-auto mb-2 text-text-tertiary" size={22} />
                    No payments found.
                  </td>
                </tr>
              ) : payments.map((payment) => (
                <tr key={payment.id} onClick={() => setSelectedId(payment.id)} className="cursor-pointer border-b border-border/60 transition-colors hover:bg-primary-50/40">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{payment.title}</p>
                    <p className="mt-0.5 max-w-[280px] truncate text-xs text-text-secondary">{payment.notes || 'No notes'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{payment.clientName}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{payment.clientEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-text-primary">{formatCurrency(payment.amount, payment.currency)}</td>
                  <td className="px-4 py-3"><span className={`badge ${statusBadge(payment.status)}`}>{payment.status}</span></td>
                  <td className="px-4 py-3">
                    {payment.proofs && payment.proofs.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2 py-1 text-xs font-semibold text-primary">
                        <ImageIcon size={13} />
                        {payment.proofs.length} screenshot{payment.proofs.length === 1 ? '' : 's'}
                      </span>
                    ) : (
                      <span className="text-xs text-text-tertiary">No proof</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(payment.dueDate)}</td>
                  <td className="px-4 py-3 text-text-secondary">{payment.paidAt ? formatDate(payment.paidAt) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Drawer
        open={creating || Boolean(selectedPayment)}
        title={creating ? 'Create Payment' : selectedPayment?.title ?? 'Payment'}
        description={creating ? 'Add a payment record for a client.' : selectedPayment ? `${selectedPayment.clientName} - ${formatCurrency(selectedPayment.amount, selectedPayment.currency)}` : undefined}
        onClose={() => setSelectedId(null)}
      >
        <div className="space-y-5">
          {!creating && <PaymentProofs payment={selectedPayment} />}
          <PaymentForm payment={selectedPayment} clients={clients} />
        </div>
      </Drawer>
    </>
  );
}
