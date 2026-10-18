'use client';

import type { FormEvent } from 'react';
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';

/** Two-column contact layout adapted from the supplied reference. */
export default function ContactPanel() {
  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Сотрудничество с RAMCAD — ${data.get('company') || data.get('name')}`;
    const body = `Имя: ${data.get('name')}\nКомпания: ${data.get('company') || '—'}\nПочта: ${data.get('email')}\n\n${data.get('message')}`;
    window.location.href = `mailto:oooiceberg95@mail.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return <div className='contact-panel'>
    <header className='contact-panel-heading'>
      <span className='contact-badge'><span />На связи</span>
      <h2 id='contacts-heading'>Давайте знакомиться</h2>
      <p>Хороший вкус начинается с общения.<br />Расскажите, чем мы можем быть полезны.</p>
    </header>
    <div className='contact-columns'>
      <div className='contact-details'>
        <h3>Свяжитесь с нами</h3>
        <p className='contact-description'>Производим мороженое. Помогаем с поставками.<br />Открыты новым партнёрам и хорошим идеям.</p>
        <div className='contact-channels'>
          <a href='mailto:oooiceberg95@mail.ru'><span className='contact-icon'><Mail size={17} /></span><span>oooiceberg95@mail.ru</span><ArrowUpRight size={15} className='channel-arrow' /></a>
          <a href='tel:+79389042323'><span className='contact-icon'><Phone size={17} /></span><span>+7 (938) 904-23-23</span><ArrowUpRight size={15} className='channel-arrow' /></a>
          <div><span className='contact-icon'><MapPin size={17} /></span><address>Чеченская Республика, г. Гудермес,<br />5-й км трассы Ростов–Баку</address></div>
          <div><span className='contact-icon'><Clock3 size={17} /></span><span>Пн–Сб · 08:00–18:00<br /><small>Воскресенье — выходной</small></span></div>
        </div>

      </div>
      <form className='contact-message' data-contact-form onSubmit={sendMessage}>
        <div><h3>Напишите нам</h3><p>Обсудим ассортимент, поставки и ваши идеи.</p></div>
        <div className='contact-dots' aria-hidden='true' />
        <div className='contact-field-pair'>
          <label htmlFor='contact-name'>Ваше имя<input id='contact-name' name='name' autoComplete='name' placeholder='Как к вам обращаться?' required maxLength={120} /></label>
          <label htmlFor='contact-company'>Компания<input id='contact-company' name='company' autoComplete='organization' placeholder='Название компании' maxLength={160} /></label>
        </div>
        <label htmlFor='contact-email'>Электронная почта<input id='contact-email' name='email' type='email' autoComplete='email' placeholder='you@company.ru' required maxLength={254} /></label>
        <label htmlFor='contact-message'>Сообщение<textarea id='contact-message' name='message' placeholder='Расскажите, что вас интересует…' rows={4} required maxLength={5000} /></label>
        <button type='submit'>Написать нам <ArrowUpRight size={18} /></button>
        <p className='contact-form-note'>Откроется ваша почта с готовым сообщением.</p>
      </form>
    </div>
  </div>;
}
