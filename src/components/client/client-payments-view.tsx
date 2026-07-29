'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, Clock, Copy, CreditCard, QrCode, Upload } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge, Card, StatCard, Tabs } from '@/components/ui/shared';
import type { ClientPaymentRecord, PaymentSettingsRecord, PaymentStatusValue } from '@/lib/portal-data';
import { DEFAULT_CURRENCY, formatCompactCurrency, formatCurrency } from '@/lib/money';
import { Drawer } from '@/components/ui/slide-panel';
import { FormSubmitButton } from '@/components/ui/form-submit-button';
async function uploadPaymentProofAction(formData: FormData) {
  await new Promise(r => setTimeout(r, 500));
  console.log('uploadPaymentProofAction', Object.fromEntries(formData));
}

type TabId = 'all' | PaymentStatusValue;

type MonthlyPaymentData = {
  month: string;
  paid: number;
  outstanding: number;
};

const statusVariant: Record<PaymentStatusValue, 'green' | 'orange' | 'red' | 'gray'> = {
  paid: 'green',
  pending: 'orange',
  overdue: 'red',
  cancelled: 'gray',
};

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ClientPaymentsView({
  payments,
  paymentSettings,
  message,
  error,
}: {
  payments: ClientPaymentRecord[];
  paymentSettings: PaymentSettingsRecord;
  message?: string;
  error?: string;
}) {
  const [tab, setTab] = useState<TabId>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const monthlyData = useMemo(() => {
    const grouped = payments.reduce<Record<string, MonthlyPaymentData>>((acc, payment) => {
      const sourceDate = payment.dueDate ?? payment.createdAt;
      const month = sourceDate.slice(0, 7);
      acc[month] ??= { month, paid: 0, outstanding: 0 };
      if (payment.status === 'paid') acc[month].paid += payment.amount;
      if (payment.status === 'pending' || payment.status === 'overdue') acc[month].outstanding += payment.amount;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
  }, [payments]);

  const totalPaid = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = payments.filter((payment) => payment.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
  const totalOverdue = payments.filter((payment) => payment.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0);
  const filtered = tab === 'all' ? payments : payments.filter((payment) => payment.status === tab);
  const paymentInDrawer = payments.find((payment) => payment.id === (payingId ?? selectedId));
  const drawerMode: 'pay' | 'details' = payingId ? 'pay' : 'details';

  function openDetails(paymentId: string) {
    setPayingId(null);
    setSelectedId(paymentId);
  }

  function openPay(paymentId: string) {
    setSelectedId(paymentId);
    setPayingId(paymentId);
  }

  function closeDrawer() {
    setSelectedId(null);
    setPayingId(null);
  }

  function upiUrl(payment: ClientPaymentRecord) {
    const params = new URLSearchParams({
      pa: paymentSettings.upiId || 'belvo@upi',
      pn: paymentSettings.receiverName || 'Belvo',
      am: String(payment.amount),
      cu: payment.currency || DEFAULT_CURRENCY,
      tn: payment.title,
    });
    return `upi://pay?${params.toString()}`;
  }

  function qrImageUrl(payment: ClientPaymentRecord) {
    return paymentSettings.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl(payment))}`;
  }

  return (
    <>
      <div className="animate-fade-in space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Payments & Invoices</h1>
          <p className="mt-1 text-text-secondary">Track payment status, due dates, and billing notes.</p>
        </div>

        {message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm font-medium text-success">{message}</p>}
        {error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm font-medium text-danger">{error}</p>}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatCard label="Total Paid" value={formatCurrency(totalPaid)} icon={<CheckCircle2 size={20} />} color="#10B981" />
          <StatCard label="Pending" value={formatCurrency(totalPending)} icon={<Clock size={20} />} color="#F59E0B" />
          <StatCard label="Overdue" value={formatCurrency(totalOverdue)} icon={<AlertTriangle size={20} />} color="#EF4444" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <Tabs
              tabs={[
                { id: 'all', label: 'All Payments', count: payments.length },
                { id: 'paid', label: 'Paid', count: payments.filter((payment) => payment.status === 'paid').length },
                { id: 'pending', label: 'Pending', count: payments.filter((payment) => payment.status === 'pending').length },
                { id: 'overdue', label: 'Overdue', count: payments.filter((payment) => payment.status === 'overdue').length },
                { id: 'cancelled', label: 'Cancelled', count: payments.filter((payment) => payment.status === 'cancelled').length },
              ]}
              active={tab}
              onChange={(nextTab) => setTab(nextTab as TabId)}
            />

            <div className="overflow-x-auto rounded-[8px] border border-border bg-white">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary">
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">Payment</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">Due Date</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">Paid At</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">Notes</th>
                    <th className="px-4 py-3 text-right font-medium text-text-secondary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-center text-text-secondary" colSpan={7}>No payment records for this view.</td>
                    </tr>
                  ) : filtered.map((payment) => (
                    <tr key={payment.id} onClick={() => openDetails(payment.id)} className="cursor-pointer border-b border-border/50 transition-colors hover:bg-primary-50/40">
                      <td className="px-4 py-3 font-medium text-text-primary">{payment.title}</td>
                      <td className="px-4 py-3 font-semibold text-text-primary">{formatCurrency(payment.amount, payment.currency)}</td>
                      <td className="px-4 py-3"><Badge variant={statusVariant[payment.status]}>{payment.status}</Badge></td>
                      <td className="px-4 py-3 text-text-secondary">{formatDate(payment.dueDate)}</td>
                      <td className="px-4 py-3 text-text-secondary">{payment.paidAt ? formatDate(payment.paidAt) : '-'}</td>
                      <td className="max-w-[240px] truncate px-4 py-3 text-text-secondary">{payment.notes || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        {payment.status === 'pending' || payment.status === 'overdue' ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openPay(payment.id);
                            }}
                            className="inline-flex h-9 items-center justify-center rounded-[8px] bg-primary px-3 text-xs font-semibold text-white transition hover:bg-primary-600"
                          >
                            Pay
                          </button>
                        ) : (
                          <span className="text-xs text-text-tertiary">No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><BarChart3 size={16} /> Payment History</h3>
              <div className="h-52">
                {monthlyData.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-sm text-text-secondary">
                    <CreditCard className="mb-2 text-text-tertiary" size={22} />
                    No payment activity yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(value: string) => value.slice(5)} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(value: number) => formatCompactCurrency(value, DEFAULT_CURRENCY)} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, DEFAULT_CURRENCY)} />
                      <Bar dataKey="paid" fill="#10B981" radius={[4, 4, 0, 0]} name="Paid" />
                      <Bar dataKey="outstanding" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Outstanding" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 text-sm font-semibold">Payment Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">Total records</span>
                  <span className="font-semibold text-text-primary">{payments.length}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">Outstanding</span>
                  <span className="font-semibold text-primary">{formatCurrency(totalPending + totalOverdue)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">Cancelled</span>
                  <span className="font-semibold text-text-primary">{payments.filter((payment) => payment.status === 'cancelled').length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Drawer
        open={Boolean(paymentInDrawer)}
        title={paymentInDrawer?.title ?? 'Payment'}
        description={paymentInDrawer ? `${formatCurrency(paymentInDrawer.amount, paymentInDrawer.currency)} - ${paymentInDrawer.status}` : undefined}
        onClose={closeDrawer}
      >
        {paymentInDrawer && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] border border-border bg-surface-secondary p-3">
                <p className="text-xs font-medium text-text-secondary">Amount</p>
                <p className="mt-1 text-lg font-semibold text-text-primary">{formatCurrency(paymentInDrawer.amount, paymentInDrawer.currency)}</p>
              </div>
              <div className="rounded-[8px] border border-border bg-surface-secondary p-3">
                <p className="text-xs font-medium text-text-secondary">Status</p>
                <p className="mt-1 text-lg font-semibold text-text-primary capitalize">{paymentInDrawer.status}</p>
              </div>
              <div className="rounded-[8px] border border-border bg-surface-secondary p-3">
                <p className="text-xs font-medium text-text-secondary">Currency</p>
                <p className="mt-1 text-lg font-semibold text-text-primary">{paymentInDrawer.currency}</p>
              </div>
            </div>

            {drawerMode === 'pay' && (
              <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
                <div className="rounded-[8px] border border-primary-200 bg-primary-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                    <QrCode size={16} />
                    Scan to Pay
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-[8px] border border-border bg-white p-4">
                    <img src={qrImageUrl(paymentInDrawer)} alt={`UPI QR code for ${paymentInDrawer.title}`} className="h-full w-full object-contain" />
                  </div>
                  <p className="mt-3 text-center text-xs text-text-secondary">
                    Opens any UPI app with the amount and note pre-filled.
                  </p>
                </div>

                <div className="space-y-4 rounded-[8px] border border-border bg-white p-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-text-tertiary">UPI ID</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 rounded-[8px] border border-border bg-surface-secondary px-3 py-2">
                      <span className="font-mono text-sm font-semibold text-text-primary">{paymentSettings.upiId || 'belvo@upi'}</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(paymentSettings.upiId || 'belvo@upi')}
                        className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-border bg-white px-2 text-xs font-semibold text-text-secondary hover:text-primary"
                      >
                        <Copy size={13} />
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-text-tertiary">Amount</p>
                      <p className="mt-1 font-semibold text-text-primary">{formatCurrency(paymentInDrawer.amount, paymentInDrawer.currency)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-tertiary">Reference</p>
                      <p className="mt-1 font-semibold text-text-primary">{paymentInDrawer.title}</p>
                    </div>
                  </div>

                  <form action={uploadPaymentProofAction} className="block rounded-[8px] border border-dashed border-primary-300 bg-primary-50/60 p-4">
                    <input type="hidden" name="paymentId" value={paymentInDrawer.id} />
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white text-primary">
                        <Upload size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-text-primary">Upload payment screenshot</p>
                        <p className="mt-1 text-xs text-text-secondary">PNG, JPG, or WEBP proof from your UPI app.</p>
                        <input
                          name="proof"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="mt-3 block w-full text-sm text-text-secondary file:mr-3 file:rounded-[8px] file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                          required
                        />
                        <FormSubmitButton pendingLabel="Uploading..." className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60">
                          Upload Screenshot
                        </FormSubmitButton>
                      </div>
                    </div>
                  </form>

                  {paymentInDrawer.proofs && paymentInDrawer.proofs.length > 0 && (
                    <div className="rounded-[8px] border border-border bg-surface-secondary p-3">
                      <p className="text-sm font-semibold text-text-primary">Uploaded screenshots</p>
                      <div className="mt-3 space-y-2">
                        {paymentInDrawer.proofs.map((proof) => (
                          <div key={proof.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-border bg-white px-3 py-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-text-primary">{proof.fileName}</p>
                              <p className="text-xs text-text-tertiary">
                                {formatDate(proof.createdAt)}{proof.fileSize ? ` - ${(proof.fileSize / 1024).toFixed(1)} KB` : ''}
                              </p>
                            </div>
                            {proof.fileUrl && (
                              <a href={proof.fileUrl} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center justify-center rounded-[8px] border border-border bg-white px-3 text-xs font-semibold text-text-secondary hover:text-primary">
                                View
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">Payment Details</h3>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-text-tertiary">Due date</p>
                  <p className="mt-1 text-text-primary">{formatDate(paymentInDrawer.dueDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-tertiary">Paid at</p>
                  <p className="mt-1 text-text-primary">{paymentInDrawer.paidAt ? formatDate(paymentInDrawer.paidAt) : 'Not paid yet'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-text-tertiary">Notes</p>
                  <p className="mt-1 text-text-primary">{paymentInDrawer.notes || 'No notes added.'}</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </Drawer>
    </>
  );
}
