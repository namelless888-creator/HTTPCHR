'use client';

import { useState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';

const EMAIL = 'oooiceberg95@mail.ru';
// Optional form relay (Formspree, FormSubmit, Cloudflare Worker...).
// Without it the form keeps working through the visitor's mail client.
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT?.trim() ?? '';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'mailto';

export function ContactRequest() {
  const [status, setStatus] = useState<Status>('idle');

  const sendByMail = (name: string, contact: string, message: string) => {
    const body = [
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      '',
      message,
    ].join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Заявка с сайта RAMCAD')}&body=${encodeURIComponent(body)}`;
    setStatus('mailto');
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Hidden field for bots; people never see or fill it.
    if (String(data.get('_gotcha') ?? '')) return;

    const name = String(data.get('name') ?? '').trim();
    const contact = String(data.get('contact') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!ENDPOINT) {
      sendByMail(name, contact, message);
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, contact, message, page: window.location.href }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const busy = status === 'sending';
  const message =
    status === 'sent' ? 'Заявка отправлена. Мы свяжемся с вами.'
      : status === 'error' ? `Не удалось отправить заявку. Напишите на ${EMAIL} или позвоните нам.`
        : status === 'mailto' ? `Письмо сформировано. Если почтовая программа не открылась, напишите на ${EMAIL} или позвоните нам.`
          : status === 'sending' ? 'Отправляем заявку…'
            : '';

  return <div className='request-form-wrap'>
    <form className='request-form' onSubmit={onSubmit} aria-busy={busy}>
      <label className='request-field'>
        <span>Имя</span>
        <input name='name' type='text' autoComplete='name' required placeholder='Как к вам обращаться' />
      </label>
      <label className='request-field'>
        <span>Телефон или e-mail</span>
        <input name='contact' type='text' autoComplete='email' required placeholder='Чтобы мы могли ответить' />
      </label>
      <label className='request-field request-field-wide'>
        <span>Сообщение</span>
        <textarea name='message' rows={4} required placeholder='Что интересует: ассортимент, объём, город поставки' />
      </label>
      <input className='request-honeypot' name='_gotcha' type='text' tabIndex={-1} autoComplete='off' aria-hidden='true' />
      <div className='request-form-footer'>
        <button type='submit' className='request-submit' disabled={busy}>{busy ? 'Отправляем…' : 'Отправить заявку'} <ArrowUpRight size={19} strokeWidth={1.6} aria-hidden='true' /></button>
        <p className='request-note'>{ENDPOINT ? 'Заявка уйдёт с сайта. Мы ответим по указанному контакту.' : `Откроется почтовая программа с готовым письмом на ${EMAIL}. Ничего не отправляется без вашего подтверждения.`}</p>
      </div>
    </form>
    <p className='request-status' role='status' aria-live='polite'>{message}</p>
    <a className='request-mail-link' href={`mailto:${EMAIL}`}><Mail size={15} strokeWidth={1.5} aria-hidden='true' />{EMAIL}</a>
  </div>;
}
