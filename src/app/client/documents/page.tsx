'use client';

import { ExternalLink, FileText, Folder, Image as ImageIcon, Upload, Video } from 'lucide-react';
import { Badge, Card, StatCard } from '@/components/ui/shared';
import { FormSubmitButton } from '@/components/ui/form-submit-button';
import { useState, useEffect } from 'react';

const projectDocumentTypes = ['deliverable', 'invoice', 'report', 'contract', 'specification', 'other'];

interface ProjectDocumentRecord {
  id: string;
  name: string;
  type: string;
  version: number;
  projectId: string | null;
  projectName: string | null;
  milestoneTitle: string | null;
  createdAt: string;
  fileSize: number | null;
  fileUrl: string | null;
}

interface ProjectRecord {
  id: string;
  name: string;
}

interface MilestoneRecord {
  id: string;
  title: string;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatFileSize(value: number | null) {
  if (!value) return 'Unknown size';
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function iconForType(type: string) {
  if (type === 'folder') return <Folder size={18} className="text-warning" />;
  if (type === 'image') return <ImageIcon size={18} className="text-primary" />;
  if (type === 'video') return <Video size={18} className="text-danger" />;
  return <FileText size={18} className="text-text-secondary" />;
}

function inputClass(extra = '') {
  return `h-9 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${extra}`;
}

export default function DocumentsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<ProjectDocumentRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [milestones, setMilestones] = useState<MilestoneRecord[]>([]);

  useEffect(() => {
    const mockDocuments: ProjectDocumentRecord[] = [
      { id: 'mock-doc-1', name: 'Project Proposal.pdf', type: 'deliverable', version: 1, projectId: 'mock-proj-1', projectName: 'Website Redesign', milestoneTitle: 'Design Phase', createdAt: '2026-07-20T10:00:00.000Z', fileSize: 245760, fileUrl: 'https://example.com/proposal.pdf' },
      { id: 'mock-doc-2', name: 'Invoice_June2026.pdf', type: 'invoice', version: 2, projectId: 'mock-proj-1', projectName: 'Website Redesign', milestoneTitle: null, createdAt: '2026-07-01T08:30:00.000Z', fileSize: 102400, fileUrl: 'https://example.com/invoice.pdf' },
      { id: 'mock-doc-3', name: 'Screenshot_Design.png', type: 'image', version: 1, projectId: null, projectName: null, milestoneTitle: null, createdAt: '2026-06-15T14:00:00.000Z', fileSize: 512000, fileUrl: 'https://example.com/screenshot.png' },
    ];
    const mockProjects: ProjectRecord[] = [
      { id: 'mock-proj-1', name: 'Website Redesign' },
    ];
    const mockMilestones: MilestoneRecord[] = [
      { id: 'mock-milestone-1', title: 'Design Phase' },
      { id: 'mock-milestone-2', title: 'Development Phase' },
    ];
    setDocuments(mockDocuments);
    setProjects(mockProjects);
    setMilestones(mockMilestones);
  }, []);

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Documents</h1>
        <p className="mt-1 text-sm text-text-secondary">Upload and view project files stored against your account.</p>
      </div>

      {message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm text-success">{message}</p>}
      {error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total documents" value={String(documents.length)} icon={<FileText size={18} />} />
        <StatCard label="Project-linked" value={String(documents.filter((document) => document.projectId).length)} icon={<Folder size={18} />} />
        <StatCard label="Latest version" value={String(Math.max(0, ...documents.map((document) => document.version)))} icon={<Upload size={18} />} />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary-50 text-primary">
            <Upload size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">Upload Document</h2>
            <p className="text-sm text-text-secondary">PDF, PNG, JPG, WEBP, or MP4 up to 20MB.</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); console.log('submit', Object.fromEntries(fd)); }} className="grid gap-4 lg:grid-cols-[1fr_180px_1fr_1fr]">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Name</span>
            <input name="name" required className={inputClass()} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Type</span>
            <select name="type" defaultValue="deliverable" className={inputClass()}>
              {projectDocumentTypes.map((type) => (
                <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Project</span>
            <select name="projectId" defaultValue="" className={inputClass()}>
              <option value="">None</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Milestone</span>
            <select name="milestoneId" defaultValue="" className={inputClass()}>
              <option value="">None</option>
              {milestones.map((milestone) => <option key={milestone.id} value={milestone.id}>{milestone.title}</option>)}
            </select>
          </label>
          <label className="space-y-1.5 lg:col-span-3">
            <span className="text-xs font-medium text-text-secondary">File</span>
            <input name="file" required type="file" accept="application/pdf,image/png,image/jpeg,image/webp,video/mp4" className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-[8px] file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
          </label>
          <div className="flex items-end">
            <FormSubmitButton pendingLabel="Uploading..." className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60">
              Upload
            </FormSubmitButton>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-text-primary">Repository</h2>
          <p className="mt-0.5 text-sm text-text-secondary">Only client-visible documents are shown here.</p>
        </div>
        <div className="divide-y divide-border">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
              <FileText size={28} className="mb-3 text-text-tertiary" />
              <p className="text-sm font-semibold text-text-primary">No documents uploaded yet</p>
              <p className="mt-1 max-w-md text-sm text-text-secondary">Upload your first project document above.</p>
            </div>
          ) : documents.map((document) => (
            <article key={document.id} className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-surface-secondary">
                  {iconForType(document.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold text-text-primary">{document.name}</h3>
                    <Badge variant="gray">v{document.version}</Badge>
                    <Badge variant="purple">{document.type}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-text-secondary">{document.projectName || 'No project'}{document.milestoneTitle ? ` - ${document.milestoneTitle}` : ''}</p>
                  <p className="mt-1 text-xs text-text-tertiary">{formatDate(document.createdAt)} - {formatFileSize(document.fileSize)}</p>
                </div>
              </div>
              {document.fileUrl ? (
                <a href={document.fileUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-white px-3 text-sm font-semibold text-text-secondary hover:text-primary">
                  <ExternalLink size={14} />
                  Open
                </a>
              ) : (
                <span className="text-sm text-text-tertiary">No file link</span>
              )}
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
