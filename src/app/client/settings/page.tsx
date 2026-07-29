'use client';

import { Bell, Globe, Lock, MapPin, Shield, User } from 'lucide-react';
import { useState, useEffect } from 'react';

function inputClass(extra = '') {
  return `h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${extra}`;
}

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  placeholder,
  className = '',
  readOnly = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1.5 block font-medium text-text-primary">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ''} placeholder={placeholder} readOnly={readOnly} className={inputClass(readOnly ? 'bg-surface-secondary text-text-secondary' : '')} />
    </label>
  );
}

function Checkbox({ name, label, description, defaultChecked }: { name: string; label: string; description: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-medium text-text-primary">{label}</span>
        <span className="mt-0.5 block text-xs text-text-secondary">{description}</span>
      </span>
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-primary" />
    </label>
  );
}

export default function SettingsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const mockProfile = {
      fullName: 'Rahul Sharma',
      company: 'TechStart Inc.',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      gender: 'Male',
      age: 32,
      website: 'https://techstart.com',
      instagram: '@rahulsharma',
      linkedin: 'linkedin.com/company/techstart',
      street: '42, MG Road, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      gstNumber: '29ABCDE1234F1Z5',
      bpitNumber: 'BPIT123456',
      emailNotifications: true,
      weeklySummary: false,
      twoFactorEnabled: true,
    };
    setProfile(mockProfile);
  }, []);

  if (!profile) {
    return <div className="animate-fade-in space-y-5"><p className="text-sm text-text-secondary">Loading...</p></div>;
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage the real account details connected to your client profile.</p>
      </div>

      {message && <p className="rounded-[8px] border border-primary/20 bg-primary-50 px-3 py-2 text-sm font-medium text-primary">{message}</p>}

      <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); console.log('submit', Object.fromEntries(fd)); }} className="space-y-5">
        <section className="card p-4">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <User size={16} className="text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">Profile</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="fullName" defaultValue={profile.fullName} placeholder="Your name" />
            <Field label="Company" name="company" defaultValue={profile.company} placeholder="Company name" />
            <Field label="Email" name="email" defaultValue={profile.email} readOnly className="sm:col-span-2" />
            <Field label="Phone" name="phone" defaultValue={profile.phone} placeholder="+1 555 000 0000" />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-text-primary">Gender</span>
              <select name="gender" defaultValue={profile.gender ?? ''} className={inputClass()}>
                <option value="">Not specified</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </label>
            <Field label="Age" name="age" type="number" defaultValue={profile.age} placeholder="Age" />
          </div>
        </section>

        <section className="card p-4">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Globe size={16} className="text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">Social Links</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website" name="website" defaultValue={profile.website} placeholder="https://example.com" />
            <Field label="Instagram" name="instagram" defaultValue={profile.instagram} placeholder="@username" />
            <Field label="LinkedIn" name="linkedin" defaultValue={profile.linkedin} placeholder="linkedin.com/company/example" className="sm:col-span-2" />
          </div>
        </section>

        <section className="card p-4">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <MapPin size={16} className="text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">Address</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Street address" name="street" defaultValue={profile.street} className="sm:col-span-2" />
            <Field label="City" name="city" defaultValue={profile.city} />
            <Field label="State" name="state" defaultValue={profile.state} />
            <Field label="Postal code" name="postalCode" defaultValue={profile.postalCode} />
            <Field label="Country" name="country" defaultValue={profile.country} />
            <Field label="GST number" name="gstNumber" defaultValue={profile.gstNumber} />
            <Field label="BPIT number" name="bpitNumber" defaultValue={profile.bpitNumber} />
          </div>
        </section>

        <section className="card p-4">
          <div className="mb-2 flex items-center gap-2 border-b border-border pb-3">
            <Bell size={16} className="text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">Preferences</h2>
          </div>
          <div className="divide-y divide-border">
            <Checkbox name="emailNotifications" label="Email notifications" description="Project updates, invoice reminders, and meeting changes." defaultChecked={profile.emailNotifications} />
            <Checkbox name="weeklySummary" label="Weekly summary" description="A compact weekly digest of project movement." defaultChecked={profile.weeklySummary} />
            <Checkbox name="twoFactorEnabled" label="Two-factor authentication" description="Mark this account as using an extra verification step." defaultChecked={profile.twoFactorEnabled} />
          </div>
        </section>

        <div className="sticky bottom-0 flex justify-end border-t border-border bg-surface-secondary/90 py-3 backdrop-blur">
          <button type="submit" className="inline-flex h-9 items-center rounded-[8px] bg-primary px-4 text-sm font-medium text-white hover:bg-primary-600">
            Save profile
          </button>
        </div>
      </form>

      <section className="card p-4">
        <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
          <Lock size={16} className="text-text-secondary" />
          <h2 className="text-sm font-semibold text-text-primary">Change Password</h2>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); console.log('submit', Object.fromEntries(fd)); }} className="grid gap-4 sm:grid-cols-3">
          <Field label="Current password" name="currentPassword" type="password" />
          <Field label="New password" name="newPassword" type="password" />
          <Field label="Confirm password" name="confirmPassword" type="password" />
          <div className="sm:col-span-3">
            <button type="submit" className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-border bg-white px-3.5 text-sm font-medium text-text-primary hover:bg-surface-tertiary">
              <Shield size={16} />
              Update password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
