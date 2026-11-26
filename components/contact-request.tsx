'use client';

import { useState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';

const EMAIL = 'oooiceberg95@mail.ru';

export function ContactRequest() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const contact = String(data.get('contact') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const body = [
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      '',
      message,
    ].join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Заявка с сайта RAMCAD')}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return <div className='request-form-wrap'>
    <form className='request-form' onSubmit={onSubmit}>
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
      <div className='request-form-footer'>
        <button type='submit' className='request-submit'>Отправить заявку <ArrowUpRight size={19} strokeWidth={1.6} aria-hidden='true' /></button>
        <p className='request-note'>Откроется почтовая программа с готовым письмом на {EMAIL}. Ничего не отправляется без вашего подтверждения.</p>
      </div>
    </form>
    <p className='request-status' role='status' aria-live='polite'>{sent ? `Письмо сформировано. Если почтовая программа не открылась, напишите на ${EMAIL} или позвоните нам.` : ''}</p>
    <a className='request-mail-link' href={`mailto:${EMAIL}`}><Mail size={15} strokeWidth={1.5} aria-hidden='true' />{EMAIL}</a>
  </div>;
}
