import { requireRole } from '@/lib/auth';

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string; error?: string }>;
}) {
  const user = await requireRole('admin');
  const params = await searchParams;

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Settings</h2>
        <p className="mt-1 text-sm text-text-secondary">Admin account and environment status.</p>
      </div>

      {params?.message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm text-success">{params.message}</p>}
      {params?.error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm text-danger">{params.error}</p>}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="card p-4">
          <h3 className="text-base font-semibold text-text-primary">Current Admin</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border pb-3">
              <span className="text-text-secondary">Name</span>
              <span className="font-medium text-text-primary">{user.fullName || 'Not set'}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-3">
              <span className="text-text-secondary">Email</span>
              <span className="font-medium text-text-primary">{user.email}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Role</span>
              <span className="badge badge-purple">admin</span>
            </div>
          </div>
        </section>

        <section className="card p-4">
          <h3 className="text-base font-semibold text-text-primary">Data Layer</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border pb-3">
              <span className="text-text-secondary">Database</span>
              <span className="font-medium text-text-primary">Postgres via Prisma</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-3">
              <span className="text-text-secondary">Session storage</span>
              <span className="font-medium text-text-primary">HTTP-only cookie</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Secrets</span>
              <span className="badge badge-green">env only</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
