'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'ok' | 'error';

const fieldClass =
  'w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const ContactForm: React.FC<{ className?: string }> = ({ className }) => {
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.currentTarget));
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
      <label className='block'>
        <span className='mb-1.5 block text-sm text-muted-foreground'>Имя</span>
        <input name='name' type='text' required autoComplete='name' className={fieldClass} />
      </label>
      <label className='block'>
        <span className='mb-1.5 block text-sm text-muted-foreground'>Email</span>
        <input name='email' type='email' required autoComplete='email' className={fieldClass} />
      </label>
      <label className='block'>
        <span className='mb-1.5 block text-sm text-muted-foreground'>Сообщение</span>
        <textarea name='message' required rows={4} className={cn(fieldClass, 'resize-none')} />
      </label>

      <button
        type='submit'
        disabled={status === 'sending'}
        className='inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-60'
      >
        {status === 'sending' && <Loader2 aria-hidden className='size-4 animate-spin motion-reduce:animate-none' />}
        Отправить заявку
      </button>

      <p role='status' aria-live='polite' className='min-h-6 text-sm'>
        {status === 'ok' && (
          <span className='inline-flex items-center gap-2'>
            <CheckCircle2 aria-hidden className='size-4' />
            Спасибо! Мы свяжемся с вами в рабочее время.
          </span>
        )}
        {status === 'error' && (
          <span className='inline-flex items-center gap-2'>
            <TriangleAlert aria-hidden className='size-4' />
            Не удалось отправить. Позвоните нам: +7 (938) 904-23-23.
          </span>
        )}
      </p>
    </form>
  );
};
