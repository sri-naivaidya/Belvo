'use client';

import { MessageSquare, Send } from 'lucide-react';
import { Avatar, Badge, Card } from '@/components/ui/shared';
import { FormSubmitButton } from '@/components/ui/form-submit-button';
import { useState, useEffect } from 'react';

function formatTime(value: string) {
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface PortalMessage {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
  attachmentUrl: string | null;
  attachmentName: string | null;
}

export default function ChatPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const user = { id: 'mock-client-id' };

  useEffect(() => {
    const mockMessages: PortalMessage[] = [
      {
        id: 'mock-msg-1',
        senderId: 'mock-client-id',
        senderName: 'Rahul Sharma',
        body: 'Hi team, I wanted to check the status of the homepage design.',
        createdAt: '2026-07-27T10:30:00.000Z',
        attachmentUrl: null,
        attachmentName: null,
      },
      {
        id: 'mock-msg-2',
        senderId: 'admin-1',
        senderName: 'Admin Belvo',
        body: 'Hi Rahul, the homepage design is in review. We will share the final mockup by Friday.',
        createdAt: '2026-07-27T11:00:00.000Z',
        attachmentUrl: null,
        attachmentName: null,
      },
      {
        id: 'mock-msg-3',
        senderId: 'mock-client-id',
        senderName: 'Rahul Sharma',
        body: 'Thanks! Please also send the updated timeline.',
        createdAt: '2026-07-27T11:15:00.000Z',
        attachmentUrl: 'https://example.com/timeline.pdf',
        attachmentName: 'timeline.pdf',
      },
      {
        id: 'mock-msg-4',
        senderId: 'admin-1',
        senderName: 'Admin Belvo',
        body: 'Sure, attached is the revised timeline with the new milestones.',
        createdAt: '2026-07-27T12:00:00.000Z',
        attachmentUrl: 'https://example.com/revised-timeline.pdf',
        attachmentName: 'revised-timeline.pdf',
      },
    ];
    setMessages(mockMessages);
  }, []);

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Chat</h1>
        <p className="mt-1 text-sm text-text-secondary">Messages stored against your client account.</p>
      </div>

      {message && <p className="rounded-[8px] border border-success/20 bg-success-50 px-3 py-2 text-sm text-success">{message}</p>}
      {error && <p className="rounded-[8px] border border-danger/20 bg-danger-50 px-3 py-2 text-sm text-danger">{error}</p>}

      <Card className="flex min-h-[560px] flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Project Thread</h2>
            <p className="text-xs text-text-secondary">{messages.length} messages</p>
          </div>
          <Badge variant="purple">DB-backed</Badge>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
              <MessageSquare size={30} className="mb-3 text-text-tertiary" />
              <p className="text-sm font-semibold text-text-primary">No messages yet</p>
              <p className="mt-1 max-w-md text-sm text-text-secondary">Send a message below. It will be saved for the team to review.</p>
            </div>
          ) : messages.map((item) => {
            const own = item.senderId === user.id;
            return (
              <article key={item.id} className={`flex gap-3 ${own ? 'justify-end' : ''}`}>
                {!own && <Avatar name={item.senderName} size="sm" />}
                <div className={`max-w-2xl rounded-[8px] border px-3 py-2.5 ${own ? 'border-primary/20 bg-primary-50' : 'border-border bg-surface-secondary'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-text-primary">{item.senderName}</p>
                    <span className="text-xs text-text-tertiary">{formatTime(item.createdAt)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{item.body}</p>
                  {item.attachmentUrl && item.attachmentName && (
                    <a href={item.attachmentUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-semibold text-primary hover:text-primary-600">
                      {item.attachmentName}
                    </a>
                  )}
                </div>
                {own && <Avatar name={item.senderName} size="sm" />}
              </article>
            );
          })}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); console.log('submit', Object.fromEntries(fd)); }} className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              name="body"
              placeholder="Write a message..."
              className="h-10 min-w-0 flex-1 rounded-[8px] border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
            <FormSubmitButton pendingLabel="Sending..." className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60">
              <Send size={16} />
              Send
            </FormSubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
