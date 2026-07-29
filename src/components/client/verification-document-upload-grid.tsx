'use client';

import { FileUp, LoaderCircle, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

type DocumentType = { value: string; label: string };

async function uploadVerificationDocumentAction(formData: FormData) {
  await fetch('/api/upload/verification', { method: 'POST', body: formData });
}

function UploadButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-primary px-3 text-sm font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />}
      {pending ? 'Uploading...' : 'Upload files'}
    </button>
  );
}

function DocumentUploadBox({ type }: { type: DocumentType }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <form action={uploadVerificationDocumentAction} className="rounded-[10px] border border-border bg-white p-4 shadow-sm">
      <input type="hidden" name="documentType" value={type.value} />
      <input ref={inputRef} name="files" type="file" multiple accept="application/pdf,image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center rounded-[8px] border border-dashed border-primary-300 bg-primary-50/50 px-4 py-5 text-center transition hover:border-primary hover:bg-primary-50"
      >
        <FileUp size={23} className="mb-2 text-primary" />
        <span className="font-semibold text-text-primary">{type.label}</span>
        <span className="mt-1 text-xs text-text-secondary">Click to choose one or more files</span>
      </button>
      <div className="mt-3 flex min-h-9 items-center justify-between gap-3">
        <p className="line-clamp-2 text-xs text-text-secondary">
          {files.length === 0 ? 'PDF, PNG, JPG, or WEBP - 10MB each' : `${files.length} file${files.length === 1 ? '' : 's'} selected`}
        </p>
        <UploadButton disabled={files.length === 0} />
      </div>
    </form>
  );
}

export function VerificationDocumentUploadGrid({ documentTypes }: { documentTypes: DocumentType[] }) {
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{documentTypes.map((type) => <DocumentUploadBox key={type.value} type={type} />)}</div>;
}
