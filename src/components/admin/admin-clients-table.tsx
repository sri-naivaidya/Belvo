'use client';

import { useMemo, useState } from 'react';
import { Mail, Pencil, Trash2, UserRound } from 'lucide-react';
import { updateAdminClientProfileAction } from '@/lib/profile-actions';
import { deleteClientAction } from '@/lib/admin-actions';
import type { AdminClientRecord, AdminPaymentRecord, AdminTimelineEventRecord } from '@/lib/portal-data';
import { formatCurrency } from '@/lib/money';
import { Drawer } from '@/components/ui/slide-panel';
import { FormSubmitButton } from '@/components/ui/form-submit-button';

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function inputClass(extra = '') {
  return `h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${extra}`;
}

function Field({ label, name, defaultValue, type = 'text', className = '' }: { label: string; name: string; defaultValue?: string | number | null; type?: string; className?: string }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1.5 block font-medium text-text-primary">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ''} className={inputClass()} />
    </label>
  );
}

function ClientDrawerContent({
  client,
  payments,
  timeline,
}: {
  client: AdminClientRecord;
  payments: AdminPaymentRecord[];
  timeline: AdminTimelineEventRecord[];
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const canDelete = confirmEmail.trim().toLowerCase() === client.email.toLowerCase();

  const outstanding = payments
    .filter((payment) => payment.status === 'pending' || payment.status === 'overdue')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[8px] border border-border bg-surface-secondary p-3">
          <p className="text-xs font-medium text-text-secondary">Payments</p>
          <p className="mt-1 text-lg font-semibold text-text-primary">{payments.length}</p>
        </div>
        <div className="rounded-[8px] border border-border bg-surface-secondary p-3">
          <p className="text-xs font-medium text-text-secondary">Outstanding</p>
          <p className="mt-1 text-lg font-semibold text-primary">{formatCurrency(outstanding)}</p>
        </div>
        <div className="rounded-[8px] border border-border bg-surface-secondary p-3">
          <p className="text-xs font-medium text-text-secondary">Timeline</p>
          <p className="mt-1 text-lg font-semibold text-text-primary">{timeline.length}</p>
        </div>
      </div>

      <form action={updateAdminClientProfileAction} className="space-y-4">
        <input type="hidden" name="clientId" value={client.id} />
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Profile</h3>
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Full name" name="fullName" defaultValue={client.fullName} />
            <Field label="Company" name="company" defaultValue={client.company} />
            <Field label="Phone" name="phone" defaultValue={client.phone} />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-text-primary">Gender</span>
              <select name="gender" defaultValue={client.gender ?? ''} className={inputClass()}>
                <option value="">Not specified</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </label>
            <Field label="Age" name="age" type="number" defaultValue={client.age} />
            <Field label="Website" name="website" defaultValue={client.website} />
            <Field label="Instagram" name="instagram" defaultValue={client.instagram} />
            <Field label="LinkedIn" name="linkedin" defaultValue={client.linkedin} />
            <Field label="Street" name="street" defaultValue={client.street} />
            <Field label="City" name="city" defaultValue={client.city} />
            <Field label="State" name="state" defaultValue={client.state} />
            <Field label="Postal code" name="postalCode" defaultValue={client.postalCode} />
            <Field label="Country" name="country" defaultValue={client.country} />
            <Field label="GST number" name="gstNumber" defaultValue={client.gstNumber} />
            <Field label="BPIT number" name="bpitNumber" defaultValue={client.bpitNumber} />
          </div>
        </section>

        <section className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <input name="emailNotifications" type="checkbox" defaultChecked={client.emailNotifications} className="h-4 w-4 accent-primary" />
            Email notifications
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <input name="weeklySummary" type="checkbox" defaultChecked={client.weeklySummary} className="h-4 w-4 accent-primary" />
            Weekly summary
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <input name="twoFactorEnabled" type="checkbox" defaultChecked={client.twoFactorEnabled} className="h-4 w-4 accent-primary" />
            Two-factor enabled
          </label>
        </section>

        <div className="flex justify-end border-t border-border pt-4">
          <FormSubmitButton pendingLabel="Saving..." className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50">
            Save client
          </FormSubmitButton>
        </div>
      </form>

      <div className="border-t border-border pt-4">
        {!confirmingDelete ? (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <Trash2 size={14} />
            Delete client
          </button>
        ) : (
          <form action={deleteClientAction} className="space-y-3">
            <input type="hidden" name="clientId" value={client.id} />
            <input type="hidden" name="confirmEmail" value={confirmEmail} />
            <p className="text-sm font-medium text-red-600">
              Type <span className="font-bold">{client.email}</span> to confirm:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder={client.email}
                className="h-9 w-56 rounded-[8px] border border-red-300 bg-white px-3 text-sm text-text-primary outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <button
                type="button"
                onClick={() => { setConfirmingDelete(false); setConfirmEmail(''); }}
                className="h-9 rounded-[8px] border border-border bg-white px-3 text-sm font-medium text-text-secondary hover:bg-surface-tertiary"
              >
                Cancel
              </button>
              <FormSubmitButton
                pendingLabel="Deleting..."
                disabled={!canDelete}
                className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={14} />
                Confirm delete
              </FormSubmitButton>
            </div>
          </form>
        )}
      </div>

      <section className="space-y-2 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-text-primary">Payments</h3>
        <div className="overflow-x-auto rounded-[8px] border border-border">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Payment</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Amount</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Status</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Due</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td className="px-3 py-6 text-center text-text-secondary" colSpan={4}>No payment records.</td></tr>
              ) : payments.map((payment) => (
                <tr key={payment.id} className="border-b border-border/60">
                  <td className="px-3 py-2 font-medium text-text-primary">{payment.title}</td>
                  <td className="px-3 py-2 text-text-primary">{formatCurrency(payment.amount, payment.currency)}</td>
                  <td className="px-3 py-2 text-text-secondary">{payment.status}</td>
                  <td className="px-3 py-2 text-text-secondary">{formatDate(payment.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-text-primary">Timeline</h3>
        <div className="overflow-x-auto rounded-[8px] border border-border">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Event</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Type</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Status</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Visible</th>
              </tr>
            </thead>
            <tbody>
              {timeline.length === 0 ? (
                <tr><td className="px-3 py-6 text-center text-text-secondary" colSpan={4}>No timeline events.</td></tr>
              ) : timeline.map((event) => (
                <tr key={event.id} className="border-b border-border/60">
                  <td className="px-3 py-2">
                    <p className="font-medium text-text-primary">{event.title}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{formatDate(event.eventDate)}</p>
                  </td>
                  <td className="px-3 py-2 text-text-secondary">{event.type}</td>
                  <td className="px-3 py-2 text-text-secondary">{event.status}</td>
                  <td className="px-3 py-2 text-text-secondary">{event.visibleToClient ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function AdminClientsTable({
  clients,
  payments,
  timeline,
}: {
  clients: AdminClientRecord[];
  payments: AdminPaymentRecord[];
  timeline: AdminTimelineEventRecord[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedClient = useMemo(() => clients.find((client) => client.id === selectedId), [clients, selectedId]);
  const selectedPayments = useMemo(() => payments.filter((payment) => payment.clientId === selectedId), [payments, selectedId]);
  const selectedTimeline = useMemo(() => timeline.filter((event) => event.clientId === selectedId), [timeline, selectedId]);

  return (
    <>
      <section className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Client</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Company</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Phone</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Payments</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Timeline</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Joined</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-text-secondary" colSpan={7}>
                    <UserRound className="mx-auto mb-2 text-text-tertiary" size={22} />
                    No client accounts yet.
                  </td>
                </tr>
              ) : clients.map((client) => (
                <tr key={client.id} onClick={() => setSelectedId(client.id)} className="cursor-pointer border-b border-border/60 transition-colors hover:bg-primary-50/40">
                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-primary-50 text-primary">
                        <UserRound size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text-primary">{client.fullName || 'Unnamed client'}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-text-secondary">
                          <Mail size={12} />
                          {client.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{client.company || '-'}</td>
                  <td className="px-4 py-3 text-text-secondary">{client.phone || '-'}</td>
                  <td className="px-4 py-3 text-text-primary">{client.paymentsCount}</td>
                  <td className="px-4 py-3 text-text-primary">{client.timelineEventsCount}</td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(client.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary">
                      <Pencil size={12} />
                      Open
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Drawer
        open={Boolean(selectedClient)}
        title={selectedClient?.fullName || selectedClient?.email || 'Client'}
        description={selectedClient ? `${selectedClient.email} - joined ${formatDate(selectedClient.createdAt)}` : undefined}
        onClose={() => setSelectedId(null)}
      >
        {selectedClient && (
          <ClientDrawerContent client={selectedClient} payments={selectedPayments} timeline={selectedTimeline} />
        )}
      </Drawer>
    </>
  );
}
